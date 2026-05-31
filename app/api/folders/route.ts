import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, parentId } = await request.json() as { name: string; parentId: string | null };

    if (!name?.trim()) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("folders")
      .insert({ user_id: user.id, parent_id: parentId ?? null, name: name.trim() })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await admin.from("activity_logs").insert({
      user_id: user.id,
      folder_id: data.id,
      action: "create_folder",
      metadata: { name: name.trim() },
    });

    return NextResponse.json({ folder: data });
  } catch (error) {
    console.error("Create folder error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
