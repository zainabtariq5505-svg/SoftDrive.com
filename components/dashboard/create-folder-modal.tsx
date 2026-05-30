"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FolderPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { Folder } from "@/types";

interface CreateFolderModalProps {
  parentId: string | null;
  userId: string;
  onClose: () => void;
  onSuccess: (folder: Folder) => void;
}

export function CreateFolderModal({ parentId, userId, onClose, onSuccess }: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Folder name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from("folders")
        .insert({ user_id: userId, parent_id: parentId, name: name.trim() })
        .select()
        .single();

      if (dbError) throw dbError;
      onSuccess(data as Folder);
    } catch {
      setError("Failed to create folder. Please try again.");
    } finally {
      setLoading(false);
    }
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
        className="relative w-full max-w-sm bg-background rounded-2xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <FolderPlus className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="font-semibold">New Folder</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Input
            label="Folder name"
            placeholder="My Folder"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            error={error}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="premium" size="sm" loading={loading}>Create Folder</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
