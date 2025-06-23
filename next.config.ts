import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://backend-feelflow-core.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;
