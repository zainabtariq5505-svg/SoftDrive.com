"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import {
  Cloud,
  HardDrive,
  Share2,
  Clock,
  Star,
  Trash2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Plus,
  FolderPlus,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { formatFileSize } from "@/types";
import { useUpload } from "@/components/providers/upload-provider";

const navItems = [
  { href: "/dashboard", icon: HardDrive, label: "My Drive" },
  { href: "/dashboard/shared", icon: Share2, label: "Shared" },
  { href: "/dashboard/recent", icon: Clock, label: "Recent" },
  { href: "/dashboard/favorites", icon: Star, label: "Favorites" },
  { href: "/dashboard/trash", icon: Trash2, label: "Trash" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  profile: Profile | null;
  user: User;
  isAdmin?: boolean;
}

export function Sidebar({ collapsed, onToggle, profile, user, isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openUpload } = useUpload();

  const storageUsed = profile?.storage_used ?? 0;
  const storageLimit = profile?.storage_limit ?? 32212254720; // 30 GB
  const storagePercent = Math.min((storageUsed / storageLimit) * 100, 100);

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col h-full bg-background border-r border-border overflow-hidden shrink-0 z-20"
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center shadow-sm hover:bg-accent transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="flex flex-col h-full px-3 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-6 px-1 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-glow shrink-0">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-base overflow-hidden whitespace-nowrap"
              >
                Soft Drive
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Upload Button */}
        <Button
          onClick={() => openUpload()}
          variant="premium"
          size="sm"
          className={cn(
            "mb-6 gap-2 transition-all",
            collapsed ? "px-0 w-10 h-10 rounded-xl justify-center" : "justify-start"
          )}
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Upload Files</span>}
        </Button>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => {
            const active = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "sidebar-item",
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", active && "text-primary")} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/dashboard/admin"
              className={cn(
                "sidebar-item",
                pathname.startsWith("/dashboard/admin")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? "Admin" : undefined}
            >
              <Shield className={cn("w-5 h-5 shrink-0", pathname.startsWith("/dashboard/admin") && "text-primary")} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    Admin
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}
        </nav>

        {/* Storage Usage */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-3 rounded-xl bg-muted/50 border border-border/50"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-foreground">Storage</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(storagePercent)}%
                </span>
              </div>
              <Progress
                value={storagePercent}
                className="h-1.5 mb-2"
                indicatorClassName={
                  storagePercent > 80 ? "bg-red-500" : "bg-gradient-to-r from-blue-500 to-blue-400"
                }
              />
              <p className="text-xs text-muted-foreground">
                {formatFileSize(storageUsed)} of {formatFileSize(storageLimit)} used
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Actions */}
        <div className="mt-3 space-y-0.5 border-t border-border/50 pt-3">
          <Link
            href="/dashboard/settings"
            className={cn(
              "sidebar-item text-muted-foreground hover:text-foreground hover:bg-accent",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="overflow-hidden whitespace-nowrap">Settings</span>}
          </Link>

          {/* User */}
          <div className={cn(
            "flex items-center gap-2.5 p-2 rounded-xl hover:bg-accent cursor-pointer transition-colors group",
            collapsed && "justify-center"
          )}>
            <Avatar className="w-7 h-7 shrink-0">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{profile?.full_name ?? user.email}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-accent"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
