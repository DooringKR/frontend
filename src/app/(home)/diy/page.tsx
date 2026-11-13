"use client";

import HomeProductContainer from "@/components/HomeProductContaines/HomeProductContainer";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import FrequentlyUsedProductsSection from "../_components/FrequentlyUsedProductsSection";

/**
 * DIY(셀프 주문) — 상황 주문 화면 1에서 DIY 를 누르면 오는 곳. 예전 홈의 품목 메뉴를 그대로 옮겼다(2026-11-13 사용자).
 * 여기서부터는 품목 입력 → 장바구니 → 주문이 예전과 같다.
 */
export default function DiyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white pt-[60px]">
      <TopNavigator title="DIY(셀프 주문)" />
      <main className="mb-[40px] mt-5 flex flex-grow flex-col gap-7">
        <FrequentlyUsedProductsSection />
        <HomeProductContainer />
      </main>
    </div>
  );
}
