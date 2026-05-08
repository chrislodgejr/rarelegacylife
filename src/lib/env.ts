export function getSiteUrl() {
  const configuredUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const vercelUrl = normalizeUrl(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  );
  const siteUrl = configuredUrl ?? vercelUrl;

  if (siteUrl) {
    return siteUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing NEXT_PUBLIC_SITE_URL or VERCEL_URL for production URL generation.");
  }

  return "http://localhost:3000";
}

export function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function normalizeUrl(value: string | undefined) {
  const url = value?.trim().replace(/\/+$/, "");
  return url || undefined;
}
