"use client"

import { useEffect } from "react";
import { previousPage, setPreviousPage } from "@/utils/previousPage";
import useUserStore from "@/store/userStore";
import { toAmplitudeUserId } from "@/utils/amplitudeUserId";

declare global {
  interface Window {
    amplitude?: {
      track: (eventName: string, eventProperties?: Record<string, any>) => void;
      setUserId?: (userId: string) => void;
    };
  }
}

export function usePageView(pageName: string) {
  const userId = useUserStore(state => state.id);
  useEffect(() => {
    if (typeof window !== "undefined" && window.amplitude) {
      window.amplitude.track(`Page Viewed`, {
        page_name: pageName,
        previous_page: previousPage,
        user_id: toAmplitudeUserId(userId),
      });
    }
    setPreviousPage(pageName);
  }, [pageName, userId]);
}