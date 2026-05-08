"use client";

function getConfiguredSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  return siteUrl || undefined;
}

export function getAuthRedirectUrl(path: `/${string}`) {
  const origin = getConfiguredSiteUrl() ?? window.location.origin;
  return `${origin}${path}`;
}
