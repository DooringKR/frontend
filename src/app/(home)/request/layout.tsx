"use client";

import { useEffect } from "react";

import { useRequestStore } from "./_lib/requestStore";

/** 상황 주문 화면들 — 기기에 둔 입력값은 화면을 그린 뒤 읽는다(서버가 그린 빈 화면과 어긋나지 않게) */
export default function RequestLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useRequestStore.persist.rehydrate();
  }, []);
  return children;
}
