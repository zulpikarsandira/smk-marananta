import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure we don't treat this as strictly static for development (optional but good for hybrid)
};

export default nextConfig;
