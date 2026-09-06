import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export: works on Vercel, GitHub Pages, Netlify, Cloudflare Pages — all free tiers.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
