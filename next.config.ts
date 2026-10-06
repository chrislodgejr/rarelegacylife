import type { NextConfig } from "next";
import { LEGACY_BRAND_REDIRECTS } from "./src/lib/brand-paths";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
    ],
  },
  async redirects() {
    return [
      // Old URL still indexed by Google — send its ranking signals somewhere useful.
      { source: "/why-work-with-us", destination: "/about", permanent: true },
      // Duplicate of /apply-as-agent.
      { source: "/agent-opportunity", destination: "/apply-as-agent", permanent: true },
      // Old logo URLs (possibly in sent emails) now show the current logo.
      ...LEGACY_BRAND_REDIRECTS.map(([source, destination]) => ({ source, destination, permanent: false })),
    ];
  },
};

export default nextConfig;
