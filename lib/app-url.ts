export function getPublicAppUrl(origin?: string) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  return (origin ?? "").replace(/\/+$/, "");
}
