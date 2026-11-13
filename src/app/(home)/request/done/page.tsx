"use client";

import { useRouter } from "next/navigation";

import BottomBar from "@/components/overlay/BottomBar";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";

/** 접수 완료 */
export default function RequestDonePage() {
  const router = useRouter();
  return (
    <div className="flex flex-col pt-[60px]">
      <TopNavigator />
      <Header title="주문이 접수됐어요" subtitle="담당자가 연락드려요" />
      <BottomBar>
        <Button variant="secondary" onClick={() => router.replace("/order-history")}>
          주문 내역
        </Button>
        <Button onClick={() => router.replace("/")}>홈으로</Button>
      </BottomBar>
    </div>
  );
}
