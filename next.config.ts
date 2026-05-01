import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", // Disabled for stability
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
