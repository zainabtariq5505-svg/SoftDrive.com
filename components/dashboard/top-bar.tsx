"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  Search,
  Menu,
  Bell,
  Settings,
  LogOut,
  User as UserIcon,
  Upload,
  Trash2,
  Share2,
  Download,
  FolderPlus,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import type { Profile, ActivityLog } from "@/types";
import { formatDate } from "@/types";

interface TopBarProps {
  user: User;
  profile: Profile | null;
  onMenuToggle: () => void;
}

const actionIcon: Record<string, React.ElementType> = {
  upload: Upload,
  delete: Trash2,
  share: Share2,
  download: Download,
  create_folder: FolderPlus,
};

const actionLabel: Record<string, string> = {
  upload: "Uploaded",
  delete: "Deleted",
  share: "Shared",
  download: "Downloaded",
  create_folder: "Created folder",
};

const actionColor: Record<string, string> = {
  upload: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  delete: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  share: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  download: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  create_folder: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
};

export function TopBar({ user, profile, onMenuToggle }: TopBarProps) {
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<ActivityLog[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U";

  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(15);
    setNotifications(data ?? []);
    setNotifLoading(false);
    setHasUnread(false);
  }, [user.id]);

  const toggleNotifications = () => {
    const next = !notifOpen;
    setNotifOpen(next);
    if (next && notifications.length === 0) {
      fetchNotifications();
    } else if (next) {
      setHasUnread(false);
    }
  };

  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="h-14 border-b border-border/50 flex items-center gap-4 px-6 bg-background/95 backdrop-blur-sm shrink-0 z-10">
      {/* Mobile menu */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuToggle}>
        <Menu className="w-5 h-5" />
      </Button>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search files, folders..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-muted/60 border border-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/20 focus:bg-background transition-all"
          />
        </div>
      </form>

      <div className="flex items-center gap-1.5 ml-auto">
        <ThemeToggle />

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={toggleNotifications}
          >
            <Bell className="w-4.5 h-4.5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            )}
          </Button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Panel body */}
              <div className="max-h-96 overflow-y-auto">
                {notifLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <Bell className="w-8 h-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">No activity yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      Upload or share a file to get started
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {notifications.map((notif) => {
                      const action = notif.action ?? "upload";
                      const Icon = actionIcon[action] ?? Upload;
                      const colorClass = actionColor[action] ?? actionColor.upload;
                      const label = actionLabel[action] ?? action;
                      const meta = notif.metadata as Record<string, unknown> | null;
                      const fileName = (meta?.name as string) ?? "Unknown file";

                      return (
                        <div
                          key={notif.id}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-accent transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{label}</p>
                            <p className="text-xs text-muted-foreground truncate">{fileName}</p>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                            {formatDate(notif.created_at)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="border-t border-border px-4 py-2.5">
                  <button
                    onClick={fetchNotifications}
                    className="text-xs text-primary hover:underline"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-accent transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{profile?.full_name ?? "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard/profile">
              <DropdownMenuItem>
                <UserIcon className="w-4 h-4" />
                Profile
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard/settings">
              <DropdownMenuItem>
                <Settings className="w-4 h-4" />
                Settings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} destructive>
              <LogOut className="w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
