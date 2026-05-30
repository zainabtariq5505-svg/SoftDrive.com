import { createClient } from "@/lib/supabase/server";
import { SimpleFileList } from "@/components/dashboard/simple-file-list";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Favorites" };

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: files } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_starred", true)
    .eq("is_trashed", false)
    .order("updated_at", { ascending: false });

  return (
    <SimpleFileList
      files={files ?? []}
      title="Favorites"
      subtitle="Files you've starred for quick access"
      emptyTitle="No favorites yet"
      emptySubtitle="Star files to save them here for quick access"
      icon="star"
    />
  );
}
