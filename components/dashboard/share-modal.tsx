"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link, Copy, Lock, Eye, Download, Edit, Check, X, Calendar, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { getPublicAppUrl } from "@/lib/app-url";
import type { FileRow } from "@/types";
import type { FilePermission } from "@/types";

interface ShareModalProps {
  file: FileRow;
  onClose: () => void;
}

const permissions: { value: FilePermission; label: string; icon: typeof Eye; description: string }[] = [
  { value: "view", label: "View only", icon: Eye, description: "Can only view the file" },
  { value: "download", label: "Can download", icon: Download, description: "Can view and download" },
  { value: "edit", label: "Can edit", icon: Edit, description: "Full access to the file" },
];

export function ShareModal({ file, onClose }: ShareModalProps) {
  const [permission, setPermission] = useState<FilePermission>("view");
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState("");
  const [expiresIn, setExpiresIn] = useState<"" | "1" | "7" | "30" | "365">("");
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateLink = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const token = crypto.randomUUID();
      const expiresAt = expiresIn
        ? new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase.from("shared_links").insert({
        file_id: file.id,
        created_by: user.id,
        token,
        permission,
        is_public: isPublic,
        password_hash: password || null,
        expires_at: expiresAt,
      });

      if (error) throw error;

      const baseUrl = getPublicAppUrl(window.location.origin);
      const link = `${baseUrl}/share/${token}`;
      setShareLink(link);
    } catch (error) {
      toast.error("Failed to generate link");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Link className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Share File</h2>
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">{file.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-5 space-y-5">
          {/* Permissions */}
          <div>
            <label className="text-sm font-semibold mb-2.5 block">Permissions</label>
            <div className="space-y-2">
              {permissions.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPermission(p.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    permission === p.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-border/80 hover:bg-muted/30"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    permission === p.value ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <p.icon className={`w-4 h-4 ${permission === p.value ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-medium ${permission === p.value ? "text-primary" : ""}`}>{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                  {permission === p.value && (
                    <Check className="w-4 h-4 text-primary ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
              <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Password protection</p>
                <p className="text-xs text-muted-foreground">Require a password to access</p>
              </div>
            </div>
            <Input
              type="password"
              placeholder="Enter password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
            />

            <div>
              <label className="text-sm font-medium mb-1.5 block">Link expiration</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Never", value: "" },
                  { label: "1 day", value: "1" },
                  { label: "7 days", value: "7" },
                  { label: "30 days", value: "30" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setExpiresIn(opt.value as typeof expiresIn)}
                    className={`p-2 text-xs font-medium rounded-lg border transition-colors ${
                      expiresIn === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Link */}
          {shareLink ? (
            <div className="flex gap-2">
              <input
                readOnly
                value={shareLink}
                className="flex-1 h-10 px-3 rounded-xl border bg-muted text-sm font-mono truncate"
              />
              <Button variant="premium" size="sm" onClick={copyLink} className="shrink-0 gap-1.5">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          ) : (
            <Button
              variant="premium"
              className="w-full gap-2"
              onClick={generateLink}
              loading={loading}
            >
              <Link className="w-4 h-4" />
              Generate Share Link
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
