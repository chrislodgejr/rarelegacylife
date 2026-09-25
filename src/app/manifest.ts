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
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "any", type: "image/png" },
    ],
  };
}
