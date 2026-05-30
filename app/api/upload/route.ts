import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // Upload to Supabase Storage
    const bytes = await file.arrayBuffer();
    const { error: storageError } = await supabase.storage
      .from("files")
      .upload(storagePath, bytes, {
        contentType: file.type || "application/octet-stream",
      });

    if (storageError) {
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    // Save file record
    const { data: fileRecord, error: dbError } = await supabase
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
      await supabase.storage.from("files").remove([storagePath]);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Update storage usage
    await supabase.rpc("increment_storage", {
      user_id_input: user.id,
      size_bytes: file.size,
    });

    // Log activity
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      file_id: fileRecord.id,
      action: "upload",
      metadata: { name: file.name, size: file.size },
    });

    return NextResponse.json({ file: fileRecord });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
