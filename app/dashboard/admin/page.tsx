import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
  const isAdmin = profile?.role === "admin" || adminEmails.includes(user.email ?? "");
  if (!isAdmin) redirect("/dashboard");

  // Use admin client to bypass RLS and see all users
  const admin = createAdminClient();

  const [
    { count: totalUsers },
    { count: totalFiles },
    { data: allUsers },
    { data: recentActivity },
    { data: storageStats },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("files").select("*", { count: "exact", head: true }),
    admin.from("profiles").select("*").order("created_at", { ascending: false }).limit(100),
    admin.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(30),
    admin.from("profiles").select("storage_used, storage_limit"),
  ]);

  const totalStorage = storageStats?.reduce((sum, p) => sum + (p.storage_used ?? 0), 0) ?? 0;

  return (
    <AdminDashboard
      totalUsers={totalUsers ?? 0}
      totalFiles={totalFiles ?? 0}
      totalStorage={totalStorage}
      recentUsers={allUsers ?? []}
      recentActivity={recentActivity ?? []}
    />
  );
}
