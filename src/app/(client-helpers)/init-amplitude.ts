"use client";

import { useEffect } from 'react';
import { initAmplitude } from '@/services/analytics/amplitude';

type Props = {
  apiKey?: string;
};

export default function InitAmplitude({ apiKey }: Props) {
  useEffect(() => {
    const key = apiKey || process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    if (!key) return;
    // Enable verbose SDK logs in dev (or when explicitly toggled via NEXT_PUBLIC_AMPLITUDE_DEBUG=1)
    const enableDebug = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_AMPLITUDE_DEBUG === '1';
    const config: Record<string, any> = { defaultTracking: false };
    if (enableDebug) {
      // LogLevel.Debug = 3 for @amplitude/analytics-browser; numeric fallback keeps wrapper decoupled
      config.logLevel = 3;
      // Optional: small console hint so you know it's on
      // eslint-disable-next-line no-console
      console.info('[Amplitude] Debug log enabled');
    }
    initAmplitude(key, config);
  }, [apiKey]);
  return null;
}
