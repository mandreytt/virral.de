import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.b-cdn.net" },
      { protocol: "https", hostname: "vz-*.b-cdn.net" },
    ],
  },
};

export default nextConfig;
