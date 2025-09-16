"use client"

import { useEffect } from "react";
import * as amplitude from "@amplitude/analytics-browser"; // 또는 "amplitude-js"

declare global {
    interface Window {
        amplitude?: typeof amplitude;
    }
}

export function usePageView(pageName: string) {
    useEffect(() => {
    if (typeof window !== "undefined" && window.amplitude) {
        window.amplitude.track("PV", { page: pageName });
    }
    }, [pageName]);
}