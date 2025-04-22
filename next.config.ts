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
};

const nextConfig = withPWA({
  ...baseConfig,
});

export default nextConfig;
