"use client"

import { useEffect } from "react";
import { previousPage, setPreviousPage } from "@/utils/previousPage";
import useUserStore from "@/store/userStore";

declare global {
  interface Window {
    amplitude?: {
      track: (eventName: string, eventProperties?: Record<string, any>) => void;
      setUserId?: (userId: string) => void;
    };
  }
}

export function usePageView(pageName: string) {
  const amplitudeUserId = useUserStore(state => state.amplitude_user_id);
  useEffect(() => {
    if (typeof window !== "undefined" && window.amplitude) {
      window.amplitude.track(`Page Viewed`, {
        page_name: pageName,
        previous_page: previousPage,
        user_id: amplitudeUserId,
      });
    }
    setPreviousPage(pageName);
  }, [pageName, amplitudeUserId]);
}