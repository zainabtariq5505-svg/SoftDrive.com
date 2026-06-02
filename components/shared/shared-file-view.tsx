"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Cloud, Download, Eye, Clock, AlertTriangle, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileIcon } from "@/components/dashboard/file-icon";
import { formatFileSize, formatDate } from "@/types";

interface SharedFileViewProps {
  sharedLink: {
    id: string;
    token: string;
    permission: string;
    is_public: boolean;
    password_hash: string | null;
    expires_at: string | null;
    created_at: string;
    files: {
      id: string;
      name: string;
      size: number;
      mime_type: string;
      storage_path: string;
    } | null;
  };
  isExpired: boolean;
}

export function SharedFileView({ sharedLink, isExpired }: SharedFileViewProps) {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(!sharedLink.password_hash);
  const [downloading, setDownloading] = useState(false);

  const file = sharedLink.files;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === sharedLink.password_hash) {
      setAuthenticated(true);
    } else {
      toast.error("Incorrect password");
    }
  };

  const handleDownload = async () => {
    if (!file) return;
    setDownloading(true);
    try {
      window.open(`/api/share/${sharedLink.token}/download`, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Failed to start download");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="border-b border-border/50 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg w-fit">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          Soft Drive
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {isExpired ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-8 rounded-2xl border bg-card"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Link Expired</h2>
              <p className="text-muted-foreground text-sm mb-6">
                This shared link has expired. Please ask the owner for a new link.
              </p>
              <Link href="/">
                <Button variant="outline">Go to Soft Drive</Button>
              </Link>
            </motion.div>
          ) : !authenticated ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl border bg-card"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold mb-1">Password Protected</h2>
                <p className="text-muted-foreground text-sm">
                  Enter the password to access this file
                </p>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  autoFocus
                />
                <Button type="submit" variant="premium" className="w-full">
                  Access File
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl border bg-card"
            >
              {file ? (
                <>
                  <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-muted/50">
                    <FileIcon mimeType={file.mime_type} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <Badge variant="outline" className="gap-1">
                      <Eye className="w-3 h-3" />
                      {sharedLink.permission}
                    </Badge>
                    {sharedLink.expires_at && (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        Expires {formatDate(sharedLink.expires_at)}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    Shared on {formatDate(sharedLink.created_at)}
                  </p>

                  {(sharedLink.permission === "download" || sharedLink.permission === "edit") && (
                    <Button
                      variant="premium"
                      className="w-full gap-2"
                      onClick={handleDownload}
                      loading={downloading}
                    >
                      <Download className="w-4 h-4" />
                      Download File
                    </Button>
                  )}

                  <p className="text-center text-xs text-muted-foreground mt-4">
                    Powered by{" "}
                    <Link href="/" className="text-primary hover:underline">
                      Soft Drive
                    </Link>
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">File not found</h3>
                  <p className="text-muted-foreground text-sm">This file may have been deleted</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
