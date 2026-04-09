/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // No "output: export" — Vercel handles SSR/ISR natively.
  // Static export was only needed for GitHub Pages; Vercel does NOT need it.
  trailingSlash: false,
  images: {
    // Allow images from Supabase storage and Unsplash
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    unoptimized: false,
  },
};

module.exports = nextConfig;
