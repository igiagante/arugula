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
    domains: ["arugula-store.s3.us-east-2.amazonaws.com"],
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
    ],
  },
};

export default nextConfig;
