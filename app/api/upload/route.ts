import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folderId = formData.get("folderId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check storage quota
    const { data: profileData } = await supabase
      .from("profiles")
      .select("storage_used, storage_limit")
      .eq("id", user.id)
      .single();

    const profile = profileData as { storage_used: number; storage_limit: number } | null;
    if (profile && profile.storage_used + file.size > profile.storage_limit) {
      return NextResponse.json({ error: "Storage quota exceeded" }, { status: 400 });
    }

    const ext = file.name.split(".").pop();
    const storagePath = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // Use admin client to bypass storage bucket policies
    const admin = createAdminClient();

    // Ensure profile row exists (trigger may not have fired on first signup)
    await admin.from("profiles").upsert(
      {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name as string ?? user.email!.split("@")[0],
        avatar_url: user.user_metadata?.avatar_url as string ?? null,
      },
      { onConflict: "id", ignoreDuplicates: true }
    );
    const bytes = await file.arrayBuffer();
    const { error: storageError } = await admin.storage
      .from("files")
      .upload(storagePath, bytes, {
        contentType: file.type || "application/octet-stream",
      });

    if (storageError) {
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    const { data: fileRecord, error: dbError } = await admin
      .from("files")
      .insert({
        user_id: user.id,
        folder_id: folderId || null,
        name: file.name,
        original_name: file.name,
        size: file.size,
        mime_type: file.type || "application/octet-stream",
        storage_path: storagePath,
      })
      .select()
      .single();

    if (dbError) {
      await admin.storage.from("files").remove([storagePath]);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    await admin.rpc("increment_storage", {
      user_id_input: user.id,
      size_bytes: file.size,
    });

    await admin.from("activity_logs").insert({
      user_id: user.id,
      file_id: fileRecord.id,
      action: "upload",
      metadata: { name: file.name, size: file.size },
    });

    return NextResponse.json({ file: fileRecord });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
