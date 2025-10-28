"use client";

import { useEffect } from 'react';
import { initAmplitudeUnstable } from '@/services/analytics/amplitude-unstable';

type Props = {
  apiKey?: string;
};

// TESTING ONLY: Initializes Amplitude with unstable settings to reproduce event loss
export default function InitAmplitudeUnstable({ apiKey }: Props) {
  useEffect(() => {
    const key = apiKey || process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    if (!key) return;
    
    // eslint-disable-next-line no-console
    console.warn('⚠️ [UNSTABLE MODE] Amplitude initialized with event-loss settings for testing');
    
    initAmplitudeUnstable(key);
  }, [apiKey]);
  
  return null;
}
