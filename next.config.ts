import type { NextConfig } from "next";
// 타입 에러 방지를 위해 require 사용
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
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
  // 주소는 as.barogagu.com 하나(2026-11-23) — barogagu.com·www·옛 주소 baro.dooring.kr 로 오면 같은 경로로 넘긴다(알림톡·옛 링크 살림)
  async redirects() {
    return [
      ...["barogagu.com", "www.barogagu.com", "baro.dooring.kr"].map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: "https://as.barogagu.com/:path*",
        permanent: true,
      })),
      // 짧은 주소: 오픈채팅 등 카카오톡에 붙이는 링크(as.barogagu.com/k)
      { source: "/k", destination: "/?utm_source=kakaotalk", permanent: false },
    ];
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
