import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { SharedFileView } from "@/components/shared/shared-file-view";

export default async function SharedFilePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Use service role here so public viewers can still load file metadata
  // even when RLS blocks joins from `files` table.
  const admin = createAdminClient();

  const { data: sharedLinkRow } = await admin
    .from("shared_links")
    .select("id, token, permission, is_public, password_hash, expires_at, created_at, created_by, file_id")
    .eq("token", token)
    .single();

  if (!sharedLinkRow) notFound();
  // If someone guesses a token that shouldn't be public, don't show it.
  if (!sharedLinkRow.is_public) notFound();

  const isExpired =
    sharedLinkRow.expires_at && new Date(sharedLinkRow.expires_at) < new Date();

  let files: {
    id: string;
    name: string;
    size: number;
    mime_type: string;
    storage_path: string;
  } | null = null;

  if (sharedLinkRow.file_id) {
    const { data: fileRow } = await admin
      .from("files")
      .select("id, name, size, mime_type, storage_path")
      .eq("id", sharedLinkRow.file_id)
      .single();

    if (fileRow) {
      files = {
        id: fileRow.id,
        name: fileRow.name,
        size: fileRow.size,
        mime_type: fileRow.mime_type,
        storage_path: fileRow.storage_path,
      };
    }
  }

  const sharedLink = {
    ...sharedLinkRow,
    files,
  };

  return (
    <SharedFileView
      sharedLink={sharedLink}
      isExpired={!!isExpired}
    />
  );
}
