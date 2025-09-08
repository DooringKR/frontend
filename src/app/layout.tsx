import type { Metadata, Viewport } from "next";

import FloatingButton from "@/components/FloatingButton";

import "./globals.css";

export const metadata: Metadata = {
  title: "바로가구",
  description: "가구 문짝 ∙ 가구 마감재 ∙ 부분장 ∙ 가구 부속 ∙ 가구 하드웨어 | 모바일로 쉽고 편리하게 주문하고, 정확한 맞춤 가구를 오늘배송 받으세요.",
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
        <title>바로가구: 현장에서 필요한 가구, 오늘배송</title>
        <meta name="title" content="바로가구: 현장에서 필요한 가구, 오늘배송" />
        <meta name="description" content="가구 문짝 ∙ 가구 마감재 ∙ 부분장 ∙ 가구 부속 ∙ 가구 하드웨어 | 모바일로 쉽고 편리하게 주문하고, 정확한 맞춤 가구를 오늘배송 받으세요." />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://baro.dooring.kr/" />
        <meta property="og:title" content="바로가구: 현장에서 필요한 가구, 오늘배송" />
        <meta property="og:description" content="가구 문짝 ∙ 가구 마감재 ∙ 부분장 ∙ 가구 부속 ∙ 가구 하드웨어 | 모바일로 쉽고 편리하게 주문하고, 정확한 맞춤 가구를 오늘배송 받으세요." />
        <meta property="og:image" content="https://ltndnqysxsyldvkrbpfq.supabase.co/storage/v1/object/public/meta-tag/metatag.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="바로가구 - 현장에서 필요한 가구, 오늘배송" />
        <meta property="og:site_name" content="바로가구" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:locale:alternate" content="en_US" />

        {/* 카카오톡 최적화 태그 */}
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:secure_url" content="https://ltndnqysxsyldvkrbpfq.supabase.co/storage/v1/object/public/meta-tag/metatag.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://baro.dooring.kr/" />
        <meta property="twitter:title" content="바로가구: 현장에서 필요한 가구, 오늘배송" />
        <meta property="twitter:description" content="가구 문짝 ∙ 가구 마감재 ∙ 부분장 ∙ 가구 부속 ∙ 가구 하드웨어 | 모바일로 쉽고 편리하게 주문하고, 정확한 맞춤 가구를 오늘배송 받으세요." />
        <meta property="twitter:image" content="https://ltndnqysxsyldvkrbpfq.supabase.co/storage/v1/object/public/meta-tag/metatag.png" />


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
        <script src="https://cdn.amplitude.com/script/1c3c986b6f0e608a2b6d193d238e06c4.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
              window.amplitude.init('1c3c986b6f0e608a2b6d193d238e06c4', {"fetchRemoteConfig":true,"autocapture":{"attribution":true,"fileDownloads":true,"formInteractions":true,"pageViews":true,"sessions":true,"elementInteractions":true,"networkTracking":true,"webVitals":true,"frustrationInteractions":true}});
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
