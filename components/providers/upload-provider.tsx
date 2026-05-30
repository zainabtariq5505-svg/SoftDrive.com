"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { UploadModal } from "@/components/dashboard/upload-modal";

interface UploadContextType {
  openUpload: (folderId?: string | null) => void;
  closeUpload: () => void;
  isOpen: boolean;
  currentFolderId: string | null | undefined;
}

const UploadContext = createContext<UploadContextType | null>(null);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null | undefined>(null);

  const openUpload = useCallback((folderId?: string | null) => {
    setCurrentFolderId(folderId);
    setIsOpen(true);
  }, []);

  const closeUpload = useCallback(() => setIsOpen(false), []);

  return (
    <UploadContext.Provider value={{ openUpload, closeUpload, isOpen, currentFolderId }}>
      {children}
      {isOpen && (
        <UploadModal
          folderId={currentFolderId}
          onClose={closeUpload}
          onSuccess={() => {
            closeUpload();
            window.dispatchEvent(new CustomEvent("files-updated"));
          }}
        />
      )}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const ctx = useContext(UploadContext);
  if (!ctx) throw new Error("useUpload must be used within UploadProvider");
  return ctx;
}
