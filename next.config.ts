import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://backend-fellsystem.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;
