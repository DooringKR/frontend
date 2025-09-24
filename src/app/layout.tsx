import type { Metadata, Viewport } from "next";


import FloatingButton from "@/components/FloatingButton";
import AmplitudeUserIdSetter from "@/components/AmplitudeUserIdSetter";

import "./globals.css";

// ...existing code...
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />

        {/* Amplitude 스크립트 */}
        <script src="https://cdn.amplitude.com/script/1c3c986b6f0e608a2b6d193d238e06c4.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
              window.amplitude.init('1c3c986b6f0e608a2b6d193d238e06c4', {
                fetchRemoteConfig: true,
                autocapture: {
                  attribution: true,
                  fileDownloads: true,
                  formInteractions: true,
                  pageViews: true,
                  sessions: true,
                  elementInteractions: true,
                  networkTracking: true,
                  webVitals: true,
                  frustrationInteractions: true
                }
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-100">
        <AmplitudeUserIdSetter />
        <div className="mx-auto min-h-screen max-w-[460px] bg-white shadow-[0_0_20px_0_rgba(3,7,18,0.10)]">{children}</div>
        {/* 우측 하단 고정 버튼 */}
        <FloatingButton />
      </body>
          </html>
        );
      }

