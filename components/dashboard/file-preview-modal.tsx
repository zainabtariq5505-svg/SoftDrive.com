"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Download, ExternalLink, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileIcon } from "./file-icon";
import { createClient } from "@/lib/supabase/client";
import type { FileRow } from "@/types";
import { formatFileSize, formatDate, getFileType } from "@/types";

interface FilePreviewModalProps {
  file: FileRow;
  onClose: () => void;
  onDownload: () => void;
}

export function FilePreviewModal({ file, onClose, onDownload }: FilePreviewModalProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);

  const fileType = getFileType(file.mime_type);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.storage
        .from("files")
        .createSignedUrl(file.storage_path, 3600);
      if (data?.signedUrl) setUrl(data.signedUrl);
      setLoading(false);
    };
    load();
  }, [file.storage_path]);

  const canPreview = ["image", "video", "audio", "pdf"].includes(fileType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-background rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <FileIcon mimeType={file.mime_type} size="sm" />
            <div>
              <p className="font-semibold text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} · {formatDate(file.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {fileType === "image" && (
              <>
                <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-xs font-medium w-12 text-center">{zoom}%</span>
                <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={onDownload} className="gap-1.5">
              <Download className="w-4 h-4" />
              Download
            </Button>
            {url && (
              <Button variant="ghost" size="sm" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer" className="gap-1.5">
                  <ExternalLink className="w-4 h-4" />
                  Open
                </a>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-muted/30 min-h-0 p-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">Loading preview...</p>
            </div>
          ) : !canPreview || !url ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <FileIcon mimeType={file.mime_type} size="lg" />
              <p className="font-semibold text-lg">{file.name}</p>
              <p className="text-muted-foreground text-sm">Preview not available for this file type</p>
              <Button variant="premium" onClick={onDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Download to view
              </Button>
            </div>
          ) : fileType === "image" ? (
            <div className="overflow-auto flex items-center justify-center w-full h-full">
              <img
                src={url}
                alt={file.name}
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center center" }}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform duration-200"
              />
            </div>
          ) : fileType === "video" ? (
            <video
              src={url}
              controls
              className="max-w-full max-h-full rounded-xl shadow-lg"
              autoPlay={false}
              preload="metadata"
            >
              Your browser doesn't support video playback.
            </video>
          ) : fileType === "audio" ? (
            <div className="flex flex-col items-center gap-6 py-12 w-full max-w-md">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-glow">
                <FileIcon mimeType={file.mime_type} size="lg" className="bg-transparent border-0" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">{file.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <audio src={url} controls className="w-full" />
            </div>
          ) : fileType === "pdf" ? (
            <iframe
              src={url}
              className="w-full h-full rounded-xl border border-border"
              title={file.name}
            />
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
