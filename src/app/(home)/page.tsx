"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AddressIndicator from "@/components/AddressIndicator/AddressIndicator";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useBizClientStore from "@/store/bizClientStore";
import useCartItemStore from "@/store/cartItemStore";

import Footer from "./_components/Footer";
import FactoryOwnershipCard from "./_components/FactoryOwnershipCard";
import HomeBanner from "./_components/HomeBanner";
import PaymentNoticeCard from "@/components/PaymentNoticeCard";
import ProductLiabilityInsuranceCard from "./_components/ProductLiabilityInsuranceCard";
import FaqCard from "./_components/FaqCard";
import ProductionCaseListCard from "./_components/ProductionCaseListCard";

import { useDeliveryInfo } from "./_hooks/useDeliveryInfo";
import { useSessionCheck } from "./_hooks/useSessionCheck";
import { useCartData } from "./_hooks/useCartData";
import { getAddressIndicatorProps } from "./_utils/getAddressIndicatorProps";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName } from "@/utils/screenName";
import { Button } from "@/components/ui/button";
import BottomBar from "@/components/overlay/BottomBar";

import SituationPicker from "./request/_components/SituationPicker";
import { useRequestStore } from "./request/_lib/requestStore";
import { URGENT_NAME, URGENT_WHEN } from "./request/_lib/situations";
import Notice from "@/components/state/Notice";

export default function Page() {
  const router = useRouter();
  const bizClient = useBizClientStore(state => state.bizClient);
  const cartItemCount = useCartItemStore(state => state.cartItems.length);

  // 커스텀 훅들

  //bizClient 없을 때 훅에서 처리 로직 존재함.
  const deliveryInfo = useDeliveryInfo(bizClient);

  //bizClient 있을 때 훅에서 처리 로직 존재함.
  useSessionCheck();


  useCartData(bizClient, deliveryInfo.checkDelivery);

  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
    setScreenName('home');
    const prev = getPreviousScreenName();
    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
      previous_screen: prev,
    });
  }, []);

  // 로그인되지 않은 경우 로딩 화면 표시
  // if (!bizClient) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="text-gray-500">로그인 확인 중...</div>
  //     </div>
  //   );
  // }

  const addressIndicatorProps = getAddressIndicatorProps(bizClient, deliveryInfo);

  // 홈에서 고른 상황이 있으면 주문하기(가운데·아래 둘 다)는 고른 그대로 상황 입력으로 — 「이어서 할까요」는 묻지 않는다
  const picked = useRequestStore(s => s.urgent || s.situations.length > 0);
  // 바로배송 없이 상황만 골랐으면 첫 장과 같이 바로배송을 한 번 더 권한다(QA 「바로배송 강조」 — 홈은 첫 장을 그대로 가져온 화면)
  const nudgeUrgent = useRequestStore(s => !s.urgent && s.situations.length > 0);
  // 상황 고르기 값은 기기에 둔 것 — request/layout 처럼 화면을 그린 뒤 읽는다(서버가 그린 빈 화면과 어긋나지 않게)
  useEffect(() => {
    void useRequestStore.persist.rehydrate();
  }, []);
  const toOrder = () => router.push(picked ? "/request?from=home" : "/request");
  // 상황 밑 주문하기 — 이 버튼이 아래 고정 주문하기 자리에 닿으면 고정 칸이 비켜 준다(둘이 겹쳐 보이지 않게, 2026-11-17)
  const [inlineOrder, setInlineOrder] = useState<HTMLButtonElement | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-white pt-[60px]">
      {/* Amplitude 초기화 (클라이언트 전용) */}
      <InitAmplitude />
      <TopNavigator page="/" cartItemCount={cartItemCount || 0} isLoggedIn={!!bizClient} />
      <HomeBanner />

      <main className="mb-[40px] mt-10 flex flex-grow flex-col gap-7">
        {bizClient && <AddressIndicator {...addressIndicatorProps} />}
        {/* 품목 메뉴는 상황 주문 화면 1의 DIY 로 옮겼다(/diy, 2026-11-13) */}
        {/* 상황 고르기를 홈에 바로(QA 「랜딩페이지단계에서 첫 화면(상황입력)이 나오게」 2026-11-15) — 하나라도 고르면 밑에 주문하기.
            제목 모양·제목과 내용 간격은 홈의 다른 칸(실제 제작 사례)과 같게 */}
        <section className="flex flex-col gap-3 px-5">
          <h2 className="text-[20px]/[28px] font-700 text-gray-800">어떤 상황인가요?</h2>
          <div className="flex flex-col gap-5">
            <SituationPicker />
            {nudgeUrgent && (
              <Notice title="혹시 오늘 안에 급하게 필요하세요?">
                {URGENT_WHEN} 배송이 필요하다면 {URGENT_NAME}을 선택해주세요
              </Notice>
            )}
            {picked && (
              <Button ref={setInlineOrder} onClick={toOrder}>
                주문하기
              </Button>
            )}
          </div>
        </section>
        <div className="px-5 pb-10">
          <PaymentNoticeCard />
        </div>
        <div className="w-full h-5 bg-gray-100"></div>
        <ProductionCaseListCard />
        <div className="px-5">
          <ProductLiabilityInsuranceCard />
        </div>
        {/* <div>주문 가이드 영상</div> */}
        <div className="px-5">
          <FactoryOwnershipCard />
        </div>
        <FaqCard />
      </main>

      <Footer />
      {/* 주문하기는 아래 고정 — 로그인하면 탭바(63px) 위에 뜬다(2026-11-13 QA). 아래 여백은 버튼·탭바에 가리지 않게 */}
      <div className={bizClient ? "h-[153px]" : "h-[90px]"} />
      <BottomBar className={bizClient ? "bottom-[63px]" : undefined} yieldTo={inlineOrder}>
        <Button onClick={toOrder}>주문하기</Button>
      </BottomBar>
      {bizClient && <BottomNavigation />}
    </div>
  );
}
