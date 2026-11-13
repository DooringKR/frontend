"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useRequestStore } from "../_lib/requestStore";
import { recordRepairInquiry } from "../_lib/submit";

/** 자재 필요없는 수리 — 지금은 서비스하지 않는다. 눌린 횟수만 수요로 남긴다 */
export default function NotServedPage() {
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    recordRepairInquiry(useRequestStore.getState().urgent).catch(() => undefined);
  }, []);

  return (
    <div className="flex flex-col pt-[60px]">
      <TopNavigator />
      <Header title="지금은 서비스하지 않아요" />
      <BottomButton
        type="1button"
        button1Text="홈으로"
        className="fixed bottom-0 w-full max-w-[460px]"
        onButton1Click={() => router.replace("/")}
      />
    </div>
  );
}
