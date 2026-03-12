import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for tRPC + superjson
  serverExternalPackages: ["@neondatabase/serverless"],

  // Optimize images if needed
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
