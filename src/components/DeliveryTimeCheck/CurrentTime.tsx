"use client";

import { useEffect, useState } from "react";

interface CurrentTimeProps {
  textColor?: string;
}

function getFormattedTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0"); // 항상 2자리

  return `${hours}시 ${minutes}분`;
}

export default function CurrentTime({ textColor }: CurrentTimeProps) {
  const [time, setTime] = useState(getFormattedTime());

  useEffect(() => {
    setTime(getFormattedTime());

    const interval = setInterval(() => {
      setTime(getFormattedTime());
    }, 60000); // 60초마다 갱신

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`text-[17px] font-600 ${textColor ? textColor : `text-blue-500`}`}>{time}</div>
  );
}
