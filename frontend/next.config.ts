import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        v8: false,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  turbopack: {},
};

export default nextConfig;
