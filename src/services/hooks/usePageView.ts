"use client"

import { useEffect } from "react";
import { previousPage, setPreviousPage } from "@/utils/previousPage";

declare global {
  interface Window {
    amplitude?: {
      track: (eventName: string, eventProperties?: Record<string, any>) => void;
      setUserId?: (userId: string) => void;
    };
  }
}

export function usePageView(pageName: string) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.amplitude) {
      window.amplitude.track(`Page Viewed`, {
        page_name: pageName,
        previous_page: previousPage,
      });
    }
    setPreviousPage(pageName);
  }, [pageName]);
}