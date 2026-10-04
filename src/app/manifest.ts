import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/admin/dashboard",
    name: "Rare Legacy CRM",
    short_name: "Rare Legacy",
    description: "Private Rare Legacy Life CRM",
    start_url: "/admin/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#0C0B09",
    theme_color: "#0C0B09",
    // Generated from the logo symbol by `npm run brand:assets`.
    icons: [
      { src: "/brand/app-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/app-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/app-icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
