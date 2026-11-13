import { useEffect, useState } from "react";

import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";

/**
 * 주소로 오늘배송 가능 여부를 잰다. 18시 전에 도착하면 가능.
 * minutes: null = 재는 중(주소가 없거나 실패면 status 로 가른다).
 */
export function useDeliverySchedule(roadAddress: string | undefined) {
  const [minutes, setMinutes] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "failed">(roadAddress?.trim() ? "loading" : "idle");

  useEffect(() => {
    if (!roadAddress?.trim()) {
      setStatus("idle");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    calculateDeliveryInfo(roadAddress)
      .then(({ remainingMinutes }) => {
        if (cancelled) return;
        setMinutes(remainingMinutes);
        setStatus(remainingMinutes == null ? "failed" : "done");
      })
      .catch((e) => {
        console.error("오늘배송 계산 실패:", e);
        if (!cancelled) setStatus("failed");
      });
    return () => {
      cancelled = true;
    };
  }, [roadAddress]);

  const todayDeadline = new Date();
  todayDeadline.setHours(18, 0, 0, 0);
  const available = status === "done" && minutes != null && Date.now() + minutes * 60_000 < todayDeadline.getTime();

  return { minutes: status === "done" ? minutes : null, status, available };
}
