"use client";

import { Suspense, useEffect } from "react";

import AddressClientPage from "./AddressClient";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName } from "@/utils/screenName";

export default function AddressPage() {
  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
      // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
      setScreenName('address');
      const prev = getPreviousScreenName();
      trackView({
          object_type: "screen",
          object_name: null,
          current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
          previous_screen: prev,
      });
  }, []);
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <InitAmplitude />
      <AddressClientPage />
    </Suspense>
  );
}
