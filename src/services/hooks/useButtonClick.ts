"use client"

import { useCallback } from "react";

declare global {
  interface Window {
    amplitude?: {
      track: (eventName: string, eventProperties?: Record<string, any>) => void;
    };
  }
}

/**
 * 버튼 클릭 이벤트를 Amplitude로 전송하는 커스텀 훅
 * @param pageName - 현재 페이지 이름
 * @param buttonId - 버튼의 고유 id
 * @returns 클릭 시 호출할 핸들러 함수
 */
export function useButtonClick(pageName: string, buttonId: string) {
  return useCallback(() => {
    console.log("[BC] button click event fired", { page: pageName, buttonId });
    if (typeof window !== "undefined" && window.amplitude) {
      window.amplitude.track("BC", { page: pageName, buttonId });
    }
  }, [pageName, buttonId]);
}
