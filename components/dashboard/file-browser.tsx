"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Grid3X3,
  List,
  Upload,
  FolderPlus,
  SortAsc,
  MoreHorizontal,
  Folder,
  Star,
  Trash2,
  Download,
  Share2,
  Edit2,
  Eye,
  ChevronRight,
  Home,
  ArrowUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileIcon } from "./file-icon";
import { FilePreviewModal } from "./file-preview-modal";
import { ShareModal } from "./share-modal";
import { CreateFolderModal } from "./create-folder-modal";
import { RenameModal } from "./rename-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import type { FileRow, Folder as FolderType } from "@/types";
import { formatFileSize, formatDate, getFileType } from "@/types";
import { cn } from "@/lib/utils";
import { useUpload } from "@/components/providers/upload-provider";

type SortBy = "name" | "date" | "size" | "type";
type ViewMode = "grid" | "list";

interface FileBrowserProps {
  initialFiles: FileRow[];
  initialFolders: FolderType[];
  currentFolder: FolderType | null;
  searchQuery?: string;
  userId: string;
}

export function FileBrowser({
  initialFiles,
  initialFolders,
  currentFolder,
  searchQuery,
  userId,
}: FileBrowserProps) {
  const [files, setFiles] = useState(initialFiles);
  const [folders, setFolders] = useState(initialFolders);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previewFile, setPreviewFile] = useState<FileRow | null>(null);
  const [shareFile, setShareFile] = useState<FileRow | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [renameItem, setRenameItem] = useState<{ id: string; name: string; type: "file" | "folder" } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { openUpload } = useUpload();

  // Listen for upload completions
  useEffect(() => {
    const handler = () => router.refresh();
    window.addEventListener("files-updated", handler);
    return () => window.removeEventListener("files-updated", handler);
  }, [router]);

  useEffect(() => {
    setFiles(initialFiles);
    setFolders(initialFolders);
  }, [initialFiles, initialFolders]);

  const sortedFiles = [...files].sort((a, b) => {
    switch (sortBy) {
      case "name": return a.name.localeCompare(b.name);
      case "size": return b.size - a.size;
      case "type": return a.mime_type.localeCompare(b.mime_type);
      case "date":
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const sortedFolders = [...folders].sort((a, b) =>
    sortBy === "name" ? a.name.localeCompare(b.name) : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handleStar = async (fileId: string, starred: boolean) => {
    const supabase = createClient();
    await supabase.from("files").update({ is_starred: !starred }).eq("id", fileId);
    setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, is_starred: !starred } : f));
  };

  const handleFolderStar = async (folderId: string, starred: boolean) => {
    const supabase = createClient();
    await supabase.from("folders").update({ is_starred: !starred }).eq("id", folderId);
    setFolders((prev) => prev.map((f) => f.id === folderId ? { ...f, is_starred: !starred } : f));
  };

  const handleTrash = async (fileId: string) => {
    const supabase = createClient();
    await supabase.from("files").update({ is_trashed: true, trashed_at: new Date().toISOString() }).eq("id", fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.success("Moved to trash");
  };

  const handleFolderTrash = async (folderId: string) => {
    const supabase = createClient();
    await supabase.from("folders").update({ is_trashed: true, trashed_at: new Date().toISOString() }).eq("id", folderId);
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    toast.success("Folder moved to trash");
  };

  const handleDownload = async (file: FileRow) => {
    const supabase = createClient();
    const { data } = await supabase.storage.from("files").createSignedUrl(file.storage_path, 60);
    if (data?.signedUrl) {
      const a = document.createElement("a");
      a.href = data.signedUrl;
      a.download = file.original_name;
      a.click();
    }
  };

  const handleFolderOpen = (folderId: string) => {
    router.push(`/dashboard?folder=${folderId}`);
  };

  const handleBack = () => {
    if (currentFolder?.parent_id) {
      router.push(`/dashboard?folder=${currentFolder.parent_id}`);
    } else {
      router.push("/dashboard");
    }
  };

  const isEmpty = sortedFiles.length === 0 && sortedFolders.length === 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm mb-1">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
            {currentFolder && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium text-foreground">{currentFolder.name}</span>
              </>
            )}
          </div>
          <h1 className="text-xl font-bold">
            {searchQuery
              ? `Search: "${searchQuery}"`
              : currentFolder?.name ?? "My Drive"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {sortedFolders.length} folder{sortedFolders.length !== 1 ? "s" : ""}
            {", "}
            {sortedFiles.length} file{sortedFiles.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentFolder && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1.5">
              <ArrowUp className="w-4 h-4" />
              Up
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreateFolder(true)}
            className="gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            New Folder
          </Button>

          <Button
            variant="premium"
            size="sm"
            onClick={() => openUpload(currentFolder?.id)}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>

          <div className="flex items-center border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <SortAsc className="w-4 h-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {(["date", "name", "size", "type"] as SortBy[]).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={sortBy === s ? "text-primary font-medium" : ""}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Empty State */}
      {isEmpty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Folder className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? "No files found" : "This folder is empty"}
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : "Upload files or create a folder to get started"}
          </p>
          {!searchQuery && (
            <Button variant="premium" onClick={() => openUpload(currentFolder?.id)} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Files
            </Button>
          )}
        </motion.div>
      )}

      {/* Content */}
      {!isEmpty && (
        <>
          {/* Folders */}
          {sortedFolders.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Folders
              </h2>
              <div className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3"
                  : "space-y-1"
              )}>
                {sortedFolders.map((folder, i) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    viewMode={viewMode}
                    index={i}
                    onOpen={() => handleFolderOpen(folder.id)}
                    onStar={() => handleFolderStar(folder.id, folder.is_starred)}
                    onTrash={() => handleFolderTrash(folder.id)}
                    onRename={() => setRenameItem({ id: folder.id, name: folder.name, type: "folder" })}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Files */}
          {sortedFiles.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Files
              </h2>
              <div className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
                  : "space-y-1"
              )}>
                {sortedFiles.map((file, i) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    viewMode={viewMode}
                    index={i}
                    onPreview={() => setPreviewFile(file)}
                    onStar={() => handleStar(file.id, file.is_starred)}
                    onTrash={() => handleTrash(file.id)}
                    onDownload={() => handleDownload(file)}
                    onShare={() => setShareFile(file)}
                    onRename={() => setRenameItem({ id: file.id, name: file.name, type: "file" })}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Modals */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={() => handleDownload(previewFile)}
        />
      )}

      {shareFile && (
        <ShareModal file={shareFile} onClose={() => setShareFile(null)} />
      )}

      {showCreateFolder && (
        <CreateFolderModal
          parentId={currentFolder?.id ?? null}
          userId={userId}
          onClose={() => setShowCreateFolder(false)}
          onSuccess={(folder) => {
            setFolders((prev) => [folder, ...prev]);
            setShowCreateFolder(false);
            toast.success("Folder created");
          }}
        />
      )}

      {renameItem && (
        <RenameModal
          item={renameItem}
          onClose={() => setRenameItem(null)}
          onSuccess={(newName) => {
            if (renameItem.type === "file") {
              setFiles((prev) => prev.map((f) => f.id === renameItem.id ? { ...f, name: newName } : f));
            } else {
              setFolders((prev) => prev.map((f) => f.id === renameItem.id ? { ...f, name: newName } : f));
            }
            setRenameItem(null);
            toast.success("Renamed successfully");
          }}
        />
      )}
    </div>
  );
}

// Folder Card Component
function FolderCard({
  folder,
  viewMode,
  index,
  onOpen,
  onStar,
  onTrash,
  onRename,
}: {
  folder: FolderType;
  viewMode: ViewMode;
  index: number;
  onOpen: () => void;
  onStar: () => void;
  onTrash: () => void;
  onRename: () => void;
}) {
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent group cursor-pointer"
        onDoubleClick={onOpen}
      >
        <div className="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
          <Folder className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <span className="text-sm font-medium flex-1 truncate">{folder.name}</span>
        <span className="text-xs text-muted-foreground">{formatDate(folder.created_at)}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onStar} className="p-1.5 rounded-lg hover:bg-background">
            <Star className={cn("w-3.5 h-3.5", folder.is_starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
          </button>
          <FolderMenu onOpen={onOpen} onStar={onStar} onTrash={onTrash} onRename={onRename} starred={folder.is_starred} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      className="group relative p-3 rounded-2xl border bg-card hover:border-primary/20 hover:shadow-premium transition-all duration-200 cursor-pointer"
      onDoubleClick={onOpen}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
          <Folder className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
          <button onClick={onStar} className="p-1 rounded-md hover:bg-accent">
            <Star className={cn("w-3.5 h-3.5", folder.is_starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
          </button>
          <FolderMenu onOpen={onOpen} onStar={onStar} onTrash={onTrash} onRename={onRename} starred={folder.is_starred} />
        </div>
      </div>
      <p className="text-sm font-medium truncate">{folder.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(folder.created_at)}</p>
    </motion.div>
  );
}

function FolderMenu({ onOpen, onStar, onTrash, onRename, starred }: {
  onOpen: () => void;
  onStar: () => void;
  onTrash: () => void;
  onRename: () => void;
  starred: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-accent">
          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onOpen}>
          <Folder className="w-4 h-4" /> Open
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRename}>
          <Edit2 className="w-4 h-4" /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onStar}>
          <Star className="w-4 h-4" /> {starred ? "Unstar" : "Star"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onTrash} destructive>
          <Trash2 className="w-4 h-4" /> Move to Trash
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// File Card Component
function FileCard({
  file,
  viewMode,
  index,
  onPreview,
  onStar,
  onTrash,
  onDownload,
  onShare,
  onRename,
}: {
  file: FileRow;
  viewMode: ViewMode;
  index: number;
  onPreview: () => void;
  onStar: () => void;
  onTrash: () => void;
  onDownload: () => void;
  onShare: () => void;
  onRename: () => void;
}) {
  const fileType = getFileType(file.mime_type);

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent group cursor-pointer"
        onClick={onPreview}
      >
        <FileIcon mimeType={file.mime_type} size="sm" />
        <span className="text-sm font-medium flex-1 truncate">{file.name}</span>
        <span className="text-xs text-muted-foreground shrink-0">{formatFileSize(file.size)}</span>
        <span className="text-xs text-muted-foreground shrink-0">{formatDate(file.created_at)}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onStar(); }} className="p-1.5 rounded-lg hover:bg-background">
            <Star className={cn("w-3.5 h-3.5", file.is_starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
          </button>
          <FileMenu onPreview={onPreview} onDownload={onDownload} onShare={onShare} onStar={onStar} onRename={onRename} onTrash={onTrash} starred={file.is_starred} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      className="group relative p-3 rounded-2xl border bg-card hover:border-primary/20 hover:shadow-premium transition-all duration-200 cursor-pointer"
      onClick={onPreview}
    >
      <div className="flex items-start justify-between mb-3">
        <FileIcon mimeType={file.mime_type} />
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5" onClick={(e) => e.stopPropagation()}>
          <button onClick={onStar} className="p-1 rounded-md hover:bg-accent">
            <Star className={cn("w-3.5 h-3.5", file.is_starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <FileMenu onPreview={onPreview} onDownload={onDownload} onShare={onShare} onStar={onStar} onRename={onRename} onTrash={onTrash} starred={file.is_starred} />
          </div>
        </div>
      </div>

      {/* Thumbnail for images */}
      {fileType === "image" && (
        <div className="w-full h-24 rounded-xl bg-muted mb-2 overflow-hidden">
          <FileThumbnail file={file} />
        </div>
      )}

      <p className="text-sm font-medium truncate">{file.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{formatFileSize(file.size)}</p>
    </motion.div>
  );
}

function FileMenu({ onPreview, onDownload, onShare, onStar, onRename, onTrash, starred }: {
  onPreview: () => void;
  onDownload: () => void;
  onShare: () => void;
  onStar: () => void;
  onRename: () => void;
  onTrash: () => void;
  starred: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-md hover:bg-accent">
          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onPreview}>
          <Eye className="w-4 h-4" /> Preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDownload}>
          <Download className="w-4 h-4" /> Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShare}>
          <Share2 className="w-4 h-4" /> Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRename}>
          <Edit2 className="w-4 h-4" /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onStar}>
          <Star className="w-4 h-4" /> {starred ? "Unstar" : "Star"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onTrash} destructive>
          <Trash2 className="w-4 h-4" /> Move to Trash
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FileThumbnail({ file }: { file: FileRow }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.storage.from("files").createSignedUrl(file.storage_path, 300);
      if (data?.signedUrl) setUrl(data.signedUrl);
    };
    load();
  }, [file.storage_path]);

  if (!url) return <div className="w-full h-full skeleton" />;
  return <img src={url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />;
}
