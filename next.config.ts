import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'images.unsplash.com', 
      'via.placeholder.com',
      'cdnjs.cloudflare.com', // For Leaflet map icons
      'api.dicebear.com', // For DiceBear avatars
      'ui-avatars.com' // For UI Avatars
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Enable compression for better performance
  compress: true,
  // Disable strict type checking for build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
