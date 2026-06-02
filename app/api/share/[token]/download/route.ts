import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: sharedLink } = await admin
    .from("shared_links")
    .select("permission, expires_at, file_id")
    .eq("token", token)
    .single();

  if (!sharedLink) {
    return NextResponse.json({ error: "Share link not found" }, { status: 404 });
  }

  if (
    sharedLink.permission !== "download" &&
    sharedLink.permission !== "edit"
  ) {
    return NextResponse.json({ error: "Download not allowed" }, { status: 403 });
  }

  if (sharedLink.expires_at && new Date(sharedLink.expires_at) < new Date()) {
    return NextResponse.json({ error: "Share link expired" }, { status: 410 });
  }

  const { data: file } = await admin
    .from("files")
    .select("name, storage_path")
    .eq("id", sharedLink.file_id)
    .single();

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const { data: signed, error: signError } = await admin.storage
    .from("files")
    .createSignedUrl(file.storage_path, 60, { download: file.name });

  if (signError || !signed?.signedUrl) {
    return NextResponse.json({ error: "Failed to create download URL" }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
