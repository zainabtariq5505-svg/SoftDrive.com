"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, RotateCcw, Folder, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileIcon } from "./file-icon";
import { createClient } from "@/lib/supabase/client";
import type { FileRow, Folder as FolderType } from "@/types";
import { formatFileSize, formatDate } from "@/types";

interface TrashViewProps {
  files: FileRow[];
  folders: FolderType[];
  userId: string;
}

export function TrashView({ files: initialFiles, folders: initialFolders, userId }: TrashViewProps) {
  const [files, setFiles] = useState(initialFiles);
  const [folders, setFolders] = useState(initialFolders);

  const restoreFile = async (file: FileRow) => {
    const supabase = createClient();
    await supabase.from("files").update({ is_trashed: false, trashed_at: null }).eq("id", file.id);
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
    toast.success("File restored");
  };

  const deleteFilePermanently = async (file: FileRow) => {
    const supabase = createClient();
    await supabase.storage.from("files").remove([file.storage_path]);
    await supabase.from("files").delete().eq("id", file.id);
    await supabase.rpc("decrement_storage", {
      user_id_input: userId,
      size_bytes: file.size,
    });
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
    toast.success("File permanently deleted");
  };

  const restoreFolder = async (folder: FolderType) => {
    const supabase = createClient();
    await supabase.from("folders").update({ is_trashed: false, trashed_at: null }).eq("id", folder.id);
    setFolders((prev) => prev.filter((f) => f.id !== folder.id));
    toast.success("Folder restored");
  };

  const emptyTrash = async () => {
    const supabase = createClient();
    const storagePaths = files.map((f) => f.storage_path);
    if (storagePaths.length > 0) {
      await supabase.storage.from("files").remove(storagePaths);
    }
    await supabase.from("files").delete().eq("user_id", userId).eq("is_trashed", true);
    await supabase.from("folders").delete().eq("user_id", userId).eq("is_trashed", true);

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 0) {
      await supabase.rpc("decrement_storage", { user_id_input: userId, size_bytes: totalSize });
    }

    setFiles([]);
    setFolders([]);
    toast.success("Trash emptied");
  };

  const isEmpty = files.length === 0 && folders.length === 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Trash</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Items in trash are deleted after 30 days
          </p>
        </div>
        {!isEmpty && (
          <Button
            variant="outline"
            size="sm"
            onClick={emptyTrash}
            className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
            Empty Trash
          </Button>
        )}
      </div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Trash2 className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Trash is empty</h3>
          <p className="text-muted-foreground text-sm">
            Deleted files and folders will appear here
          </p>
        </motion.div>
      ) : (
        <>
          {/* Warning banner */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Items in the trash are permanently deleted after 30 days
            </p>
          </div>

          {/* Folders */}
          {folders.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Folders</h2>
              <div className="space-y-2">
                {folders.map((folder, i) => (
                  <motion.div
                    key={folder.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-xl border bg-card"
                  >
                    <div className="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <Folder className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Deleted {folder.trashed_at ? formatDate(folder.trashed_at) : "recently"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => restoreFolder(folder)} className="gap-1.5 text-xs">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restore
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Files */}
          {files.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Files</h2>
              <div className="space-y-2">
                {files.map((file, i) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-xl border bg-card"
                  >
                    <FileIcon mimeType={file.mime_type} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} · Deleted {file.trashed_at ? formatDate(file.trashed_at) : "recently"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => restoreFile(file)} className="gap-1.5 text-xs">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restore
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteFilePermanently(file)}
                        className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
