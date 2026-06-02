import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseEnv();
  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
