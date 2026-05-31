"use client";

import { motion } from "framer-motion";
import {
  Users,
  HardDrive,
  TrendingUp,
  Shield,
  Activity,
  FileText,
  FolderPlus,
  Upload,
  Download,
  Share2,
  Trash2,
  Crown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Profile, ActivityLog } from "@/types";
import { formatFileSize, formatDate } from "@/types";

const actionIcon: Record<string, React.ElementType> = {
  upload: Upload,
  delete: Trash2,
  share: Share2,
  download: Download,
  create_folder: FolderPlus,
};

const actionColor: Record<string, string> = {
  upload: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  delete: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  share: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  download: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  create_folder: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
};

const actionLabel: Record<string, string> = {
  upload: "Uploaded a file",
  delete: "Deleted a file",
  share: "Shared a file",
  download: "Downloaded",
  create_folder: "Created folder",
};

interface AdminDashboardProps {
  totalUsers: number;
  totalFiles: number;
  totalStorage: number;
  recentUsers: Profile[];
  recentActivity: ActivityLog[];
}

export function AdminDashboard({
  totalUsers,
  totalFiles,
  totalStorage,
  recentUsers,
  recentActivity,
}: AdminDashboardProps) {
  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      description: "Registered accounts",
    },
    {
      label: "Total Files",
      value: totalFiles.toLocaleString(),
      icon: FileText,
      color: "from-purple-500 to-purple-600",
      description: "Files uploaded",
    },
    {
      label: "Storage Used",
      value: formatFileSize(totalStorage),
      icon: HardDrive,
      color: "from-green-500 to-green-600",
      description: "Across all users",
    },
    {
      label: "Recent Activity",
      value: recentActivity.length.toString(),
      icon: Activity,
      color: "from-orange-500 to-orange-600",
      description: "Last 30 actions",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Platform overview and user management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl border bg-card hover:shadow-premium transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-muted-foreground/40" />
            </div>
            <p className="text-2xl font-bold mb-0.5">{stat.value}</p>
            <p className="text-sm font-medium">{stat.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">All Users ({totalUsers})</h3>
            <Badge variant="outline" className="text-xs">
              {recentUsers.length} shown
            </Badge>
          </div>

          {recentUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Users className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No users yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-[1fr_100px_110px_80px] gap-3 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>User</span>
                <span>Storage</span>
                <span>Joined</span>
                <span>Role</span>
              </div>
              {recentUsers.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[1fr_100px_110px_80px] gap-3 items-center px-3 py-3 rounded-xl hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                        {(u.full_name?.[0] ?? u.email[0])?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{u.full_name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{formatFileSize(u.storage_used)}</span>
                    <div className="w-full bg-muted rounded-full h-1 mt-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: `${Math.min((u.storage_used / u.storage_limit) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(u.created_at)}</span>
                  <Badge variant={u.role === "admin" ? "default" : "outline"} className="w-fit text-xs">
                    {u.role === "admin" ? <Crown className="w-3 h-3 mr-1" /> : null}
                    {u.role}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-2xl border bg-card">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Activity className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
              {recentActivity.map((log) => {
                const action = log.action ?? "upload";
                const Icon = actionIcon[action] ?? Upload;
                const colorClass = actionColor[action] ?? actionColor.upload;
                const label = actionLabel[action] ?? action;
                const meta = log.metadata as Record<string, unknown> | null;
                const fileName = (meta?.name as string) ?? "Unknown";

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-accent transition-colors"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground truncate">{fileName}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                      {formatDate(log.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
