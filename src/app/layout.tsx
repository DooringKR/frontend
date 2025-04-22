import ReactQueryProviders from "@/providers/ReactQueryProviders";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Dooring",
  description: "어디서든 가볍게 인테리어 자재를 주문해보세요",
  icons: {
    icon: "@/app/favicon.ico",
  },
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="mx-auto max-w-[500px]">
        <ReactQueryProviders>
          {children}
          <ReactQueryDevtools />
        </ReactQueryProviders>
      </body>
    </html>
  );
}

export default RootLayout;
