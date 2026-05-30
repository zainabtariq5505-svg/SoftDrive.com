import { createClient } from "@/lib/supabase/server";
import { SharedFilesView } from "@/components/dashboard/shared-files-view";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shared Files" };

export default async function SharedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: sharedLinks } = await supabase
    .from("shared_links")
    .select("*, files(*)")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  return <SharedFilesView sharedLinks={sharedLinks ?? []} />;
}
