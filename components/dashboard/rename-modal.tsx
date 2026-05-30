"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface RenameModalProps {
  item: { id: string; name: string; type: "file" | "folder" };
  onClose: () => void;
  onSuccess: (newName: string) => void;
}

export function RenameModal({ item, onClose, onSuccess }: RenameModalProps) {
  const [name, setName] = useState(item.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required"); return; }
    if (name.trim() === item.name) { onClose(); return; }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const table = item.type === "file" ? "files" : "folders";
      const { error: dbError } = await supabase
        .from(table)
        .update({ name: name.trim() })
        .eq("id", item.id);

      if (dbError) throw dbError;
      onSuccess(name.trim());
    } catch {
      setError("Failed to rename. Please try again.");
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
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="font-semibold">Rename {item.type}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Input
            label={item.type === "file" ? "File name" : "Folder name"}
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            error={error}
            autoFocus
            onFocus={(e) => {
              const val = e.target.value;
              const dotIndex = val.lastIndexOf(".");
              if (dotIndex > 0) {
                e.target.setSelectionRange(0, dotIndex);
              } else {
                e.target.select();
              }
            }}
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="premium" size="sm" loading={loading}>Rename</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
