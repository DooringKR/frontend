"use client";

import { useEffect, useState } from "react";

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    return `${pad(minutes)}:${pad(seconds)}`;
  }
}

export default function DeliveryTimer() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date();
    target.setHours(16, 0, 0, 0);

    const update = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff > 0) {
        setRemaining(diff);
      } else {
        setRemaining(null);
      }
    };

    update(); // 첫 실행
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, []);

  if (remaining === null) return null;

  return (
    <section className="rounded-xl border bg-[#F9F9F9] px-4 py-3 text-sm">
      <p>
        <span className="font-semibold text-[#FF5757]">{formatTime(remaining)}</span> 안에 주문하면
        오늘 안에 배송돼요.
      </p>
      <p className="text-xs text-gray-500">
        일부 <span className="text-[#FF5757]">지역은</span> 더 빨리 주문해야 해요.
      </p>
    </section>
  );
}
