"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import type { User } from "@supabase/supabase-js";
import {
  User as UserIcon,
  Lock,
  Bell,
  Palette,
  HardDrive,
  Shield,
  Save,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { formatFileSize } from "@/types";

interface SettingsViewProps {
  user: User;
  profile: Profile | null;
}

export function SettingsView({ user, profile }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    uploads: true,
    shares: true,
    security: true,
    updates: false,
  });

  const storageUsed = profile?.storage_used ?? 0;
  const storageLimit = profile?.storage_limit ?? 32212254720;
  const storagePercent = Math.min((storageUsed / storageLimit) * 100, 100);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password changed successfully");
    } catch {
      toast.error("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl border bg-card space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{profile?.full_name ?? "User"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  icon={<UserIcon className="w-4 h-4" />}
                />
                <Input
                  label="Email Address"
                  value={user.email ?? ""}
                  disabled
                  icon={<UserIcon className="w-4 h-4" />}
                />
              </div>

              <Button variant="premium" onClick={saveProfile} loading={saving} className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border bg-card space-y-6"
          >
            <div>
              <h3 className="font-semibold mb-1">Change Password</h3>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>

            <div className="space-y-4">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                iconRight={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <Button variant="premium" onClick={changePassword} loading={saving} className="gap-2">
              <Shield className="w-4 h-4" />
              Update Password
            </Button>

            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-1">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline" className="gap-2">
                <Shield className="w-4 h-4" />
                Enable 2FA
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border bg-card space-y-6"
          >
            <div>
              <h3 className="font-semibold mb-1">Theme</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred appearance</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    theme === t.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <t.icon className={`w-5 h-5 ${theme === t.value ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${theme === t.value ? "text-primary" : ""}`}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border bg-card space-y-5"
          >
            <div>
              <h3 className="font-semibold mb-1">Notification Preferences</h3>
              <p className="text-sm text-muted-foreground">Choose what notifications to receive</p>
            </div>

            {[
              { key: "uploads" as const, label: "Upload notifications", description: "When file uploads complete" },
              { key: "shares" as const, label: "Share notifications", description: "When someone accesses your shared files" },
              { key: "security" as const, label: "Security alerts", description: "Unusual account activity" },
              { key: "updates" as const, label: "Product updates", description: "New features and improvements" },
            ].map((notif) => (
              <div key={notif.key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{notif.label}</p>
                  <p className="text-xs text-muted-foreground">{notif.description}</p>
                </div>
                <Switch
                  checked={notifications[notif.key]}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, [notif.key]: checked }))
                  }
                />
              </div>
            ))}

            <Button variant="premium" className="gap-2" onClick={() => toast.success("Preferences saved")}>
              <Save className="w-4 h-4" />
              Save Preferences
            </Button>
          </motion.div>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border bg-card space-y-6"
          >
            <div>
              <h3 className="font-semibold mb-1">Storage Usage</h3>
              <p className="text-sm text-muted-foreground">Track your storage consumption</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{formatFileSize(storageUsed)} used</span>
                <span className="text-muted-foreground">{formatFileSize(storageLimit)} total</span>
              </div>
              <Progress
                value={storagePercent}
                className="h-3"
                indicatorClassName={
                  storagePercent > 90 ? "bg-red-500" :
                  storagePercent > 70 ? "bg-yellow-500" :
                  "bg-gradient-to-r from-blue-500 to-blue-400"
                }
              />
              <p className="text-xs text-muted-foreground">
                {Math.round(100 - storagePercent)}% free · {formatFileSize(storageLimit - storageUsed)} available
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex items-center gap-3 mb-1">
                <HardDrive className="w-5 h-5 text-primary" />
                <span className="font-semibold">Pro Plan</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Upgrade to get more storage and premium features
              </p>
            </div>

            <Button variant="premium" className="gap-2">
              <HardDrive className="w-4 h-4" />
              Upgrade Storage
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
