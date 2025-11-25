import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true, // Ignoruj błędy TS podczas buildu
  },
};

export default nextConfig;
