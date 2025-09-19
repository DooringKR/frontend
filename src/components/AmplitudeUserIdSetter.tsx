"use client";
import { useEffect } from "react";
import useUserStore from "@/store/userStore";
import { toAmplitudeUserId } from "@/utils/amplitudeUserId";

export default function AmplitudeUserIdSetter() {
  useEffect(() => {
    const userId = useUserStore.getState().id;
    const amplitudeId = toAmplitudeUserId(userId);
    let interval: NodeJS.Timeout | null = null;
    let count = 0;
    function trySetUserId() {
      if (window.amplitude && amplitudeId) {
        window.amplitude.setUserId?.(amplitudeId);
        if (interval) clearInterval(interval);
      } else if (count++ > 20) {
        if (interval) clearInterval(interval);
      }
    }
    interval = setInterval(trySetUserId, 100);
    trySetUserId();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);
  return null;
}
