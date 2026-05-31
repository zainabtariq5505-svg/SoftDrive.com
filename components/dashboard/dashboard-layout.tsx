"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { UploadProvider } from "@/components/providers/upload-provider";

interface DashboardLayoutProps {
  user: User;
  profile: Profile | null;
  isAdmin?: boolean;
  children: React.ReactNode;
}

export function DashboardLayout({ user, profile, isAdmin, children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <UploadProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          profile={profile}
          user={user}
          isAdmin={isAdmin}
        />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar
            user={user}
            profile={profile}
            onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <main className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="max-w-screen-2xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </UploadProvider>
  );
}
