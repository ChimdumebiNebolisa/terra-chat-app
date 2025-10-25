import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable Turbopack for compatibility
  experimental: {
    turbo: false,
  },
};

export default nextConfig;
