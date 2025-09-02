import type { Metadata, Viewport } from "next";

import FloatingButton from "@/components/FloatingButton";

import "./globals.css";

export const metadata: Metadata = {
  title: "Dooring",
  description: "어디서든 가볍게 인테리어 자재를 주문해주세요",
  icons: {
    icon: "/favicon.svg",
    apple: "/img/logo-192x192.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard 폰트 preload */}
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />

        {/* Amplitude 스크립트 */}
        <script src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz"></script>
        <script src="https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.8.0-min.js.gz"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
              window.amplitude.init('66eecfdad205c95650a11f88c68b1d96', {
                "autocapture": {
                  "elementInteractions": true
                }
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-100">
        <div className="mx-auto min-h-screen max-w-[460px] bg-white shadow-[0_0_20px_0_rgba(3,7,18,0.10)]">{children}</div>
        {/* 우측 하단 고정 버튼 */}
        <FloatingButton />
      </body>
    </html>
  );
}

export default RootLayout;
