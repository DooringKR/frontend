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
    initAmplitude(key, { defaultTracking: false });
  }, [apiKey]);
  return null;
}
