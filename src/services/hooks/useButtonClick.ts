"use client"

import { useCallback } from "react";

declare global {
  interface Window {
    amplitude?: {
      track: (eventName: string, eventProperties?: Record<string, any>) => void;
      setUserId?: (userId: string) => void;
    };
  }
}

/**
 * 버튼 클릭 이벤트를 Amplitude로 전송하는 커스텀 훅
 * @param buttonName - 버튼의 이름 (button_name property)
 * @param pageName - 페이지의 이름 (page_name property)
 * @returns 클릭 시 호출할 핸들러 함수
 *
 * Amplitude 이벤트명: "Button Clicked"
 * Properties: { button_name: string, page_name: string }
 */
export function useButtonClick(buttonName: string, pageName: string) {
  return useCallback(() => {
    if (typeof window !== "undefined" && window.amplitude) {
      window.amplitude.track("Button Clicked", {
        page_name: String(pageName),
        button_name: String(buttonName),
      });
    }
  }, [buttonName, pageName]);
}
