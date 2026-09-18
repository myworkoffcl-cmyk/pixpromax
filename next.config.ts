import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/convert-image", destination: "/image-tools/convert", permanent: true },
    ];
  },
};

export default nextConfig;
