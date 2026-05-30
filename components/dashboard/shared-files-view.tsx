"use client";

import { motion } from "framer-motion";
import { Share2, Link, Trash2, Eye, Download, Edit, Clock, Shield, Copy } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileIcon } from "./file-icon";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/types";

interface SharedLink {
  id: string;
  token: string;
  permission: string;
  is_public: boolean;
  expires_at: string | null;
  created_at: string;
  files: {
    id: string;
    name: string;
    mime_type: string;
    size: number;
  } | null;
}

export function SharedFilesView({ sharedLinks }: { sharedLinks: SharedLink[] }) {
  const copyLink = async (token: string) => {
    const link = `${window.location.origin}/share/${token}`;
    await navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  const revokeLink = async (id: string) => {
    const supabase = createClient();
    await supabase.from("shared_links").delete().eq("id", id);
    toast.success("Link revoked");
    window.location.reload();
  };

  const getPermIcon = (perm: string) => {
    if (perm === "view") return Eye;
    if (perm === "download") return Download;
    return Edit;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Shared Files</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Files you&apos;ve shared with others via links
        </p>
      </div>

      {sharedLinks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Share2 className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No shared files</h3>
          <p className="text-muted-foreground text-sm">
            Share files from your drive to see them here
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {sharedLinks.map((link, i) => {
            const PermIcon = getPermIcon(link.permission);
            const isExpired = link.expires_at && new Date(link.expires_at) < new Date();

            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl border bg-card hover:shadow-premium transition-all"
              >
                {link.files ? (
                  <FileIcon mimeType={link.files.mime_type} size="sm" />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{link.files?.name ?? "Unknown file"}</p>
                  <p className="text-xs text-muted-foreground">
                    Shared {formatDate(link.created_at)}
                    {link.expires_at && (
                      <span className={isExpired ? "text-red-500" : ""}>
                        {" · "}
                        {isExpired ? "Expired" : `Expires ${formatDate(link.expires_at)}`}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={isExpired ? "destructive" : "outline"} className="gap-1">
                    <PermIcon className="w-3 h-3" />
                    {link.permission}
                  </Badge>
                  {!link.is_public && (
                    <Badge variant="outline" className="gap-1">
                      <Shield className="w-3 h-3" />
                      Private
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyLink(link.token)}
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => revokeLink(link.id)}
                    title="Revoke link"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
