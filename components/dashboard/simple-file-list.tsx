"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FileIcon } from "./file-icon";
import { FilePreviewModal } from "./file-preview-modal";
import { ShareModal } from "./share-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { FileRow } from "@/types";
import { formatFileSize, formatDate } from "@/types";
import { MoreHorizontal, Download, Share2, Eye, Edit2 } from "lucide-react";

interface SimpleFileListProps {
  files: FileRow[];
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptySubtitle: string;
  icon: "clock" | "star" | "trash";
}

const icons = {
  clock: Clock,
  star: Star,
  trash: Trash2,
};

export function SimpleFileList({
  files: initialFiles,
  title,
  subtitle,
  emptyTitle,
  emptySubtitle,
  icon,
}: SimpleFileListProps) {
  const [files, setFiles] = useState(initialFiles);
  const [previewFile, setPreviewFile] = useState<FileRow | null>(null);
  const [shareFile, setShareFile] = useState<FileRow | null>(null);

  const Icon = icons[icon];

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

  const handleStar = async (file: FileRow) => {
    const supabase = createClient();
    await supabase.from("files").update({ is_starred: !file.is_starred }).eq("id", file.id);
    setFiles((prev) =>
      prev.map((f) => f.id === file.id ? { ...f, is_starred: !file.is_starred } : f)
    );
    toast.success(file.is_starred ? "Removed from favorites" : "Added to favorites");
  };

  const handleTrash = async (file: FileRow) => {
    const supabase = createClient();
    await supabase
      .from("files")
      .update({ is_trashed: true, trashed_at: new Date().toISOString() })
      .eq("id", file.id);
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
    toast.success("Moved to trash");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>

      {files.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Icon className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{emptyTitle}</h3>
          <p className="text-muted-foreground text-sm">{emptySubtitle}</p>
        </motion.div>
      ) : (
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_100px_36px] gap-4 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Name</span>
            <span>Size</span>
            <span>Date</span>
            <span></span>
          </div>

          {files.map((file, i) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-[1fr_80px_100px_36px] gap-4 items-center px-3 py-2.5 rounded-xl hover:bg-accent group cursor-pointer"
              onClick={() => setPreviewFile(file)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileIcon mimeType={file.mime_type} size="sm" />
                <span className="text-sm font-medium truncate">{file.name}</span>
                {file.is_starred && (
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
              <span className="text-xs text-muted-foreground">{formatDate(file.created_at)}</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setPreviewFile(file)}>
                      <Eye className="w-4 h-4" /> Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(file)}>
                      <Download className="w-4 h-4" /> Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShareFile(file)}>
                      <Share2 className="w-4 h-4" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStar(file)}>
                      <Star className="w-4 h-4" />
                      {file.is_starred ? "Unstar" : "Star"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleTrash(file)} destructive>
                      <Trash2 className="w-4 h-4" /> Move to Trash
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
    </div>
  );
}
