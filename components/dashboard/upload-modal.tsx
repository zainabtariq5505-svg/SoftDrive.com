"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  File,
  CheckCircle2,
  AlertCircle,
  Cloud,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/types";
import type { UploadTask } from "@/types";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB per file

interface UploadModalProps {
  folderId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadModal({ folderId, onClose, onSuccess }: UploadModalProps) {
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [uploading, setUploading] = useState(false);

  const updateTask = (id: string, updates: Partial<UploadTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newTasks: UploadTask[] = acceptedFiles
        .filter((f) => f.size <= MAX_FILE_SIZE)
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          progress: 0,
          status: "pending" as const,
          folderId,
        }));

      const oversized = acceptedFiles.filter((f) => f.size > MAX_FILE_SIZE);
      if (oversized.length > 0) {
        toast.error(`${oversized.length} file(s) exceed the 5GB limit`);
      }

      setTasks((prev) => [...prev, ...newTasks]);
    },
    [folderId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const uploadFile = async (task: UploadTask) => {
    updateTask(task.id, { status: "uploading", progress: 5 });

    let fakeProgress = 5;
    const progressInterval = setInterval(() => {
      fakeProgress = Math.min(fakeProgress + 4, 85);
      updateTask(task.id, { progress: fakeProgress });
    }, 400);

    try {
      const formData = new FormData();
      formData.append("file", task.file);
      if (task.folderId) formData.append("folderId", task.folderId);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Upload failed");
      }

      updateTask(task.id, { status: "success", progress: 100 });
    } catch (err) {
      clearInterval(progressInterval);
      throw err;
    }
  };

  const startUpload = async () => {
    const pendingTasks = tasks.filter((t) => t.status === "pending");
    if (pendingTasks.length === 0) return;

    setUploading(true);

    for (const task of pendingTasks) {
      try {
        await uploadFile(task);
      } catch (error) {
        updateTask(task.id, {
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed",
        });
      }
    }

    setUploading(false);

    const successful = tasks.filter((t) => t.status === "success").length;
    if (successful > 0) {
      toast.success(`${successful} file(s) uploaded successfully`);
      setTimeout(onSuccess, 500);
    }
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const allDone = tasks.length > 0 && tasks.every((t) => t.status === "success" || t.status === "error");
  const hasErrors = tasks.some((t) => t.status === "error");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-background rounded-2xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Upload Files</h2>
              <p className="text-xs text-muted-foreground">
                {folderId ? "To current folder" : "To My Drive"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-5 space-y-4">
          {/* Drop zone */}
          {tasks.length === 0 && (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200",
                isDragActive
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              )}
            >
              <input {...getInputProps()} />
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors",
                isDragActive ? "bg-primary/10" : "bg-muted"
              )}>
                {isDragActive ? (
                  <Cloud className="w-8 h-8 text-primary animate-bounce" />
                ) : (
                  <FolderOpen className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <p className="font-semibold mb-1">
                {isDragActive ? "Drop files here" : "Drop files or click to browse"}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports all file types · Max 5 GB per file
              </p>
            </div>
          )}

          {/* Additional files drop zone */}
          {tasks.length > 0 && !uploading && !allDone && (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all",
                isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
            >
              <input {...getInputProps()} />
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">Add more files</span> or drag & drop
              </p>
            </div>
          )}

          {/* File list */}
          {tasks.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin pr-1">
              <AnimatePresence initial={false}>
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      task.status === "success" ? "bg-green-100 dark:bg-green-900/30" :
                      task.status === "error" ? "bg-red-100 dark:bg-red-900/30" :
                      "bg-blue-100 dark:bg-blue-900/30"
                    )}>
                      {task.status === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : task.status === "error" ? (
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <File className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{formatFileSize(task.size)}</span>
                        {task.status === "error" && (
                          <span className="text-xs text-red-500">{task.error}</span>
                        )}
                      </div>
                      {task.status === "uploading" && (
                        <Progress value={task.progress} className="h-1 mt-1.5" />
                      )}
                    </div>

                    {task.status === "pending" && !uploading && (
                      <button
                        onClick={() => removeTask(task.id)}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {task.status === "uploading" && (
                      <span className="text-xs text-blue-500 font-medium shrink-0">
                        {task.progress}%
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {tasks.length > 0 && (
          <div className="flex items-center justify-between p-5 border-t border-border bg-muted/20">
            <span className="text-sm text-muted-foreground">
              {tasks.length} file{tasks.length !== 1 ? "s" : ""}
              {" · "}
              {formatFileSize(tasks.reduce((sum, t) => sum + t.size, 0))}
            </span>
            <div className="flex gap-2">
              {!allDone && (
                <Button variant="outline" size="sm" onClick={onClose} disabled={uploading}>
                  Cancel
                </Button>
              )}
              {!allDone ? (
                <Button
                  variant="premium"
                  size="sm"
                  onClick={startUpload}
                  loading={uploading}
                  disabled={tasks.every((t) => t.status !== "pending")}
                >
                  {uploading ? "Uploading..." : "Upload All"}
                </Button>
              ) : (
                <Button variant={hasErrors ? "outline" : "premium"} size="sm" onClick={onClose}>
                  {hasErrors ? "Close" : "Done"}
                </Button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
