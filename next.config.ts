import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "https://panel.nexxacodeid.site/:path*",
      },
    ];
  },
};

export default nextConfig;
