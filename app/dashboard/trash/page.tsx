import { createClient } from "@/lib/supabase/server";
import { TrashView } from "@/components/dashboard/trash-view";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trash" };

export default async function TrashPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: files }, { data: folders }] = await Promise.all([
    supabase
      .from("files")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_trashed", true)
      .order("trashed_at", { ascending: false }),
    supabase
      .from("folders")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_trashed", true)
      .order("trashed_at", { ascending: false }),
  ]);

  return <TrashView files={files ?? []} folders={folders ?? []} userId={user.id} />;
}
