import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SharedFileView } from "@/components/shared/shared-file-view";

export default async function SharedFilePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: sharedLink } = await supabase
    .from("shared_links")
    .select("*, files(*)")
    .eq("token", token)
    .single();

  if (!sharedLink) notFound();

  const isExpired = sharedLink.expires_at && new Date(sharedLink.expires_at) < new Date();

  return (
    <SharedFileView
      sharedLink={sharedLink}
      isExpired={!!isExpired}
    />
  );
}
