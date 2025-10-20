"use client";

import { LICENSE_LIST } from "@/constants/license/licenseData";
import { LICENSE_PAGE } from "@/constants/pageName";

import TopNavigator from "@/components/TopNavigator/TopNavigator";

import LicenseList from "./components/LicenseList";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName } from "@/utils/screenName";
import { useEffect } from "react";

export default function LicensePage() {
    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('license');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);
  return (
    <div>
      <InitAmplitude />
      <TopNavigator title="오픈소스 라이선스" page={LICENSE_PAGE} />
      <LicenseList list={LICENSE_LIST} />
    </div>
  );
}
