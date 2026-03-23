import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
});

const baseConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/order_item/:path*", // 프론트엔드에서 /order_item으로 오는 모든 요청을
        destination: "http://localhost:3001/order_item/:path*", // 백엔드로 프록시
      },
      {
        source: "/order/:path*",
        destination: "http://localhost:3001/order/:path*",
      },
      // 필요하다면 다른 API 경로도 추가
    ];
  },
};

const nextConfig = withPWA({
  ...baseConfig,
});

export default nextConfig;
