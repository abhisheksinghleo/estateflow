/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.NEXT_PUBLIC_REPO_NAME || "";

const nextConfig = {
  reactStrictMode: true,
  // "output: export" is only needed for GitHub Pages static hosting.
  // Enabling it in dev mode breaks dynamic [slug] routes because Next.js
  // tries to pre-render ALL params at startup — even ones not yet visited.
  ...(isProd && { output: "export" }),
  trailingSlash: true,
  basePath: isProd && repoName ? `/${repoName}` : "",
  assetPrefix: isProd && repoName ? `/${repoName}/` : "",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
