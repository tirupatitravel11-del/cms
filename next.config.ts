import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode:false,
  env: {
    // apiUrl: "http://localhost:8000"
    apiUrl: "https://api.tirupatitravel.in/"
 

  },

  // output:"export",
  // trailingSlash: true,
  /* config options here */
  // output: 'export', // ✅ Required for static export in Next.js 13+
  // Optional additions:
  // trailingSlash: true, // Ensures proper folder structure in 'out'
  images: {

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

