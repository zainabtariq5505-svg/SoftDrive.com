const BOM = /^\uFEFF/;

function normalizeEnv(value: string | undefined, name: string): string {
  const cleaned = value?.replace(BOM, "").trim();

  if (!cleaned) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return cleaned;
}

export function getSupabaseEnv() {
  return {
    url: normalizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: normalizeEnv(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    ),
  };
}

export function getSupabaseServiceRoleKey() {
  return normalizeEnv(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    "SUPABASE_SERVICE_ROLE_KEY"
  );
}
