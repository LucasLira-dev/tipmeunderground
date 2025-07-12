import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    eslint: {
    ignoreDuringBuilds: true, // Ignorar erros de lint durante o build
  },
    experimental: {
    serverActions: {},
  },
};

export default nextConfig;
