"use client";

import { motion } from "framer-motion";
import {
  Users,
  Files,
  HardDrive,
  TrendingUp,
  Shield,
  Activity,
  Eye,
  Trash2,
  Ban,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import type { Profile, ActivityLog } from "@/types";
import { formatFileSize, formatDate } from "@/types";

// Mock chart data
const activityData = [
  { date: "Mon", uploads: 42, users: 8 },
  { date: "Tue", uploads: 78, users: 15 },
  { date: "Wed", uploads: 56, users: 12 },
  { date: "Thu", uploads: 92, users: 18 },
  { date: "Fri", uploads: 115, users: 24 },
  { date: "Sat", uploads: 48, users: 10 },
  { date: "Sun", uploads: 35, users: 7 },
];

const storageDistribution = [
  { name: "Images", value: 35, color: "#22c55e" },
  { name: "Videos", value: 45, color: "#a855f7" },
  { name: "Documents", value: 12, color: "#3b82f6" },
  { name: "Other", value: 8, color: "#f59e0b" },
];

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
      change: "+12%",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Files",
      value: totalFiles.toLocaleString(),
      change: "+24%",
      icon: Files,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Storage Used",
      value: formatFileSize(totalStorage),
      change: "+8%",
      icon: HardDrive,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Active Today",
      value: "—",
      change: "+5%",
      icon: Activity,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const banUser = async (userId: string) => {
    toast.error("User ban feature — connect to your backend");
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Platform overview and management</p>
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
              <Badge variant="success" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </Badge>
            </div>
            <p className="text-2xl font-bold mb-0.5">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl border bg-card">
          <h3 className="font-semibold mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="uploads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
              <Area type="monotone" dataKey="uploads" stroke="#3b82f6" strokeWidth={2} fill="url(#uploads)" name="Uploads" />
              <Area type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={2} fill="url(#users)" name="Active Users" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Storage Distribution */}
        <div className="p-6 rounded-2xl border bg-card">
          <h3 className="font-semibold mb-4">Storage Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={storageDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" strokeWidth={0}>
                {storageDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {storageDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-2xl border bg-card">
        <h3 className="font-semibold mb-4">Recent Users</h3>
        <div className="space-y-1">
          <div className="grid grid-cols-[1fr_120px_120px_100px_80px] gap-4 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>User</span>
            <span>Storage</span>
            <span>Joined</span>
            <span>Role</span>
            <span>Actions</span>
          </div>
          {recentUsers.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[1fr_120px_120px_100px_80px] gap-4 items-center px-3 py-3 rounded-xl hover:bg-accent"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="text-xs">
                    {u.full_name?.[0] ?? u.email[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{u.full_name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{formatFileSize(u.storage_used)}</span>
              <span className="text-sm text-muted-foreground">{formatDate(u.created_at)}</span>
              <Badge variant={u.role === "admin" ? "default" : "outline"} className="w-fit text-xs">
                {u.role}
              </Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="w-7 h-7">
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => banUser(u.id)}
                >
                  <Ban className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
