import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Dooring",
  description: "어디서든 가볍게 인테리어 자재를 주문해보세요",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  themeColor: "#000000",
  manifest: "/manifest.json",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="mx-auto min-h-screen max-w-[500px]">{children}</body>
    </html>
  );
}

export default RootLayout;
