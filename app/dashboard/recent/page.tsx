import { createClient } from "@/lib/supabase/server";
import { SimpleFileList } from "@/components/dashboard/simple-file-list";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Recent Files" };

export default async function RecentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: files } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_trashed", false)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <SimpleFileList
      files={files ?? []}
      title="Recent Files"
      subtitle="Files you've uploaded or accessed recently"
      emptyTitle="No recent files"
      emptySubtitle="Files you upload will appear here"
      icon="clock"
    />
  );
}
