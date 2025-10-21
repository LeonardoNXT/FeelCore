import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://www.feelsystem.com.br/:path*",
      },
    ];
  },
};

export default nextConfig;
