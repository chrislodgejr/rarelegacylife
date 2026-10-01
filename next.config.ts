import type { NextConfig } from "next";

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
    ];
  },
};

export default nextConfig;
