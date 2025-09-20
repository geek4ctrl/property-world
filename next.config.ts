import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure external image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Disable source maps in development to reduce file I/O
  productionBrowserSourceMaps: false,
};

export default nextConfig;
