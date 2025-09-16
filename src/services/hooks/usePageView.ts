"use client"

import { useEffect } from "react";

declare global {
  interface Window {
    amplitude?: {
      track: (eventName: string, eventProperties?: Record<string, any>) => void;
    };
  }
}

export function usePageView(pageName: string) {
    useEffect(() => {
    if (typeof window !== "undefined" && window.amplitude) {
        window.amplitude.track(`PV_${pageName}`, { page: pageName });
    }
    }, [pageName]);
}