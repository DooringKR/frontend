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
    // Debug logs disabled - set NEXT_PUBLIC_AMPLITUDE_DEBUG=1 to enable if needed
    const enableDebug = process.env.NEXT_PUBLIC_AMPLITUDE_DEBUG === '1';
    const config: Record<string, any> = { defaultTracking: false };
    if (enableDebug) {
      config.logLevel = 3;
      // eslint-disable-next-line no-console
      console.info('[Amplitude] Debug log enabled');
    }
    initAmplitude(key, config);
  }, [apiKey]);
  return null;
}
