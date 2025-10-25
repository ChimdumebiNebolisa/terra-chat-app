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
        stream: false,
        buffer: false,
        crypto: false,
        module: false,
        net: false,
        tls: false,
        child_process: false,
        util: false,
        url: false,
        http: false,
        https: false,
        zlib: false,
        events: false,
        assert: false,
        constants: false,
        dns: false,
        dgram: false,
        readline: false,
        punycode: false,
        querystring: false,
        string_decoder: false,
        sys: false,
        vm: false,
        cluster: false,
        perf_hooks: false,
        async_hooks: false,
        inspector: false,
        'fs/promises': false,
      };
    }
    return config;
  },
  // Disable Turbopack for now as it doesn't support the same fallback configuration
  experimental: {
    turbo: false,
  },
};

export default nextConfig;
