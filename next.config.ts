import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  serverExternalPackages: ["@remotion/renderer"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
