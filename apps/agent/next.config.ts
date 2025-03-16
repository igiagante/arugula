import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
  transpilePackages: ["@workspace/ui", "@workspace/schemas"],
  experimental: {
    ppr: true,
  },
  images: {
    domains: [
      "arugula-store.s3.us-east-2.amazonaws.com",
      "img.clerk.com",
      "images.clerk.dev",
      "leaflegacy.ai",
      "www.leaflegacy.ai",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "leaflegacy.ai",
        pathname: "/api/images/**",
      },
      {
        protocol: "https",
        hostname: "www.leaflegacy.ai",
        pathname: "/api/images/**",
      },
    ],
  },
};

export default nextConfig;
