import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  output: isStaticExport ? 'export' : undefined,
  basePath: isStaticExport ? '/nexforge' : undefined,
  assetPrefix: isStaticExport ? '/nexforge/' : undefined,
  images: {
    unoptimized: isStaticExport,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
