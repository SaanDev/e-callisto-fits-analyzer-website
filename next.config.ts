import type { NextConfig } from "next";

// GitHub Pages serves a project site from /<repository>/. The deploy workflow
// passes that prefix in NEXT_PUBLIC_BASE_PATH; it stays empty for a custom
// domain and for local development.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
