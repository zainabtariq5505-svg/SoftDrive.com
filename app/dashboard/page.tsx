import { createClient } from "@/lib/supabase/server";
import { FileBrowser } from "@/components/dashboard/file-browser";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Drive" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; folder?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const query = params.q;
  const folderId = params.folder ?? null;

  let filesQuery = supabase
    .from("files")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_trashed", false)
    .order("created_at", { ascending: false });

  if (folderId) {
    filesQuery = filesQuery.eq("folder_id", folderId);
  } else {
    filesQuery = filesQuery.is("folder_id", null);
  }

  if (query) {
    filesQuery = filesQuery.ilike("name", `%${query}%`);
  }

  let foldersQuery = supabase
    .from("folders")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_trashed", false)
    .order("created_at", { ascending: false });

  if (folderId) {
    foldersQuery = foldersQuery.eq("parent_id", folderId);
  } else {
    foldersQuery = foldersQuery.is("parent_id", null);
  }

  if (query) {
    foldersQuery = foldersQuery.ilike("name", `%${query}%`);
  }

  const [{ data: files }, { data: folders }, { data: currentFolder }] = await Promise.all([
    filesQuery,
    foldersQuery,
    folderId
      ? supabase.from("folders").select("*").eq("id", folderId).single()
      : Promise.resolve({ data: null }),
  ]);

  return (
    <FileBrowser
      initialFiles={files ?? []}
      initialFolders={folders ?? []}
      currentFolder={currentFolder}
      searchQuery={query}
      userId={user.id}
    />
  );
}
