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

export default function DeliveryTimer({ user }: { user: null | object }) {
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

    update();
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, []);

  if (remaining === null) return null;

  return (
    <section className="flex w-full flex-col items-center justify-center gap-6 rounded-lg border border-[#d9d9d9] py-[23px]">
      <div className="flex flex-col gap-6">
        {!user && (
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold leading-[22px] text-[#8a226f]"
          >
            도어링 A/S 자재 배송 설명서
          </a>
        )}
        <div className="flex h-[50px] flex-col gap-2">
          <p className="text-base font-normal leading-[1.4] text-[#757575]">
            <span className="font-semibold text-[#EC221F]">{formatTime(remaining)}</span> 안에
            주문하면 오늘 안에 배송돼요.
          </p>
          <p className="text-sm font-semibold text-[#b3b3b3]">일부 지역은 더 빨리 주문해야 해요.</p>
        </div>
      </div>
    </section>
  );
}
