"use client";

import { useEffect } from "react";

import AddressIndicator from "@/components/AddressIndicator/AddressIndicator";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import HomeProductContainer from "@/components/HomeProductContaines/HomeProductContainer";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useBizClientStore from "@/store/bizClientStore";
import useCartItemStore from "@/store/cartItemStore";

import Footer from "./_components/Footer";
import FactoryOwnershipCard from "./_components/FactoryOwnershipCard";
import HomeBanner from "./_components/HomeBanner";
import HomeScreenPaymentNoticeCard from "@/components/PaymentNoticeCard/HomeScreenPaymentNoticeCard";
import ProductLiabilityInsuranceCard from "./_components/ProductLiabilityInsuranceCard";
import FaqCard from "./_components/FaqCard";
import ProductionCaseListCard from "./_components/ProductionCaseListCard";
import FrequentlyUsedProductsSection from "./_components/FrequentlyUsedProductsSection";

import { useDeliveryInfo } from "./_hooks/useDeliveryInfo";
import { useSessionCheck } from "./_hooks/useSessionCheck";
import { useCartData } from "./_hooks/useCartData";
import { getAddressIndicatorProps } from "./_utils/getAddressIndicatorProps";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName } from "@/utils/screenName";

export default function Page() {
  const bizClient = useBizClientStore(state => state.bizClient);
  const cartItemCount = useCartItemStore(state => state.cartItems.length);

  // 커스텀 훅들
  const deliveryInfo = useDeliveryInfo(bizClient);
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
  if (!bizClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">로그인 확인 중...</div>
      </div>
    );
  }

  const addressIndicatorProps = getAddressIndicatorProps(bizClient, deliveryInfo);

  return (
    <div className="flex min-h-screen flex-col bg-white pt-[60px]">
      {/* Amplitude 초기화 (클라이언트 전용) */}
      <InitAmplitude />
      <TopNavigator page="/" cartItemCount={cartItemCount || 0} />
      <HomeBanner />

      <main className="mb-[40px] mt-10 flex flex-grow flex-col gap-7">
        <AddressIndicator {...addressIndicatorProps} />
        <FrequentlyUsedProductsSection />
        {/* <div className="w-full h-5 bg-gray-100"></div> */}
        <HomeProductContainer />
        <div className="px-5 pb-10">
          <HomeScreenPaymentNoticeCard
            className="w-full"
          />
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
      <BottomNavigation />
    </div>
  );
}
