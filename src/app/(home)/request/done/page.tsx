"use client";

import { useRouter } from "next/navigation";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

/** 접수 완료 */
export default function RequestDonePage() {
  const router = useRouter();
  return (
    <div className="flex flex-col pt-[60px]">
      <TopNavigator />
      <Header title="주문이 접수됐어요" subtitle="담당자가 연락드려요" />
      <BottomButton
        type="2buttons"
        button1Text="주문 내역"
        button2Text="홈으로"
        button1Type="GrayLarge"
        className="fixed bottom-0 w-full max-w-[460px]"
        onButton1Click={() => router.replace("/order-history")}
        onButton2Click={() => router.replace("/")}
      />
    </div>
  );
}
