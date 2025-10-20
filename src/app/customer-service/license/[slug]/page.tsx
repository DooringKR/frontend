"use client";

// /customer-service/license/[slug]/page.tsx
import { LICENSE_CONTENTS } from "@/constants/license/licenseContents";
import { LICENSE_LIST } from "@/constants/license/licenseData";
import { LICENSE_PAGE } from "@/constants/pageName";
import { notFound } from "next/navigation";

import TopNavigator from "@/components/TopNavigator/TopNavigator";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName } from "@/utils/screenName";
import { useEffect } from "react";

export default async function LicenseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = LICENSE_CONTENTS[slug];
  const license = LICENSE_LIST.find(item => item.slug === slug);

  if (!content || !license) return notFound();

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('license_' + slug);
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

  return (
    <div className="whitespace-pre-line text-[17px] font-400 leading-relaxed text-gray-500">
      <TopNavigator title={license.name} page={LICENSE_PAGE} />
      <InitAmplitude />
      <div className="p-5">{content}</div>
    </div>
  );
}
