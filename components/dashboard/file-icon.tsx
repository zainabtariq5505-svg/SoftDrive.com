import {
  FileText,
  ImageIcon,
  Video,
  Music,
  FileArchive,
  FileSpreadsheet,
  Presentation,
  Code,
  File,
} from "lucide-react";
import { getFileType } from "@/types";
import { cn } from "@/lib/utils";

const iconConfig = {
  image: { icon: ImageIcon, bg: "bg-green-100 dark:bg-green-900/30", color: "text-green-600 dark:text-green-400" },
  video: { icon: Video, bg: "bg-purple-100 dark:bg-purple-900/30", color: "text-purple-600 dark:text-purple-400" },
  audio: { icon: Music, bg: "bg-orange-100 dark:bg-orange-900/30", color: "text-orange-600 dark:text-orange-400" },
  pdf: { icon: FileText, bg: "bg-red-100 dark:bg-red-900/30", color: "text-red-600 dark:text-red-400" },
  document: { icon: FileText, bg: "bg-blue-100 dark:bg-blue-900/30", color: "text-blue-600 dark:text-blue-400" },
  spreadsheet: { icon: FileSpreadsheet, bg: "bg-emerald-100 dark:bg-emerald-900/30", color: "text-emerald-600 dark:text-emerald-400" },
  presentation: { icon: Presentation, bg: "bg-amber-100 dark:bg-amber-900/30", color: "text-amber-600 dark:text-amber-400" },
  archive: { icon: FileArchive, bg: "bg-yellow-100 dark:bg-yellow-900/30", color: "text-yellow-600 dark:text-yellow-400" },
  code: { icon: Code, bg: "bg-cyan-100 dark:bg-cyan-900/30", color: "text-cyan-600 dark:text-cyan-400" },
  other: { icon: File, bg: "bg-gray-100 dark:bg-gray-900/30", color: "text-gray-600 dark:text-gray-400" },
};

interface FileIconProps {
  mimeType: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FileIcon({ mimeType, size = "md", className }: FileIconProps) {
  const type = getFileType(mimeType);
  const config = iconConfig[type];
  const Icon = config.icon;

  const sizeClasses = { sm: "w-7 h-7", md: "w-10 h-10", lg: "w-14 h-14" };
  const iconSizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-7 h-7" };
  const radiusClasses = { sm: "rounded-lg", md: "rounded-xl", lg: "rounded-2xl" };

  return (
    <div className={cn(sizeClasses[size], radiusClasses[size], config.bg, "flex items-center justify-center shrink-0", className)}>
      <Icon className={cn(iconSizes[size], config.color)} />
    </div>
  );
}
