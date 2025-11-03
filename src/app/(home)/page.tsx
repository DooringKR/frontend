"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

import AddressIndicator, {
  AddressIndicatorProps,
} from "@/components/AddressIndicator/AddressIndicator";
import Banner from "@/components/Banner/Banner";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import HomeProductContainer from "@/components/HomeProductContaines/HomeProductContainer";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useAddressStore from "@/store/addressStore";
import useCartStore from "@/store/cartStore";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";

import Footer from "./_components/Footer";
import FactoryOwnershipCard from "./_components/FactoryOwnershipCard";
import useBizClientStore from "@/store/bizClientStore";
import { ReadBizClientUsecase } from "@/DDD/usecase/user/read_bizClient_usecase";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { BizClient } from "dooring-core-domain/dist/models/User/BizClient";
import { useOrderStore } from "@/store/orderStore";
import useCartItemStore from "@/store/cartItemStore";
import { KakaoAuthSupabaseRepository } from "@/DDD/data/service/kakao_auth_supabase_repository";
import { supabase } from "@/lib/supabase";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName } from "@/utils/screenName";
import HomeScreenPaymentNoticeCard from "@/components/PaymentNoticeCard/HomeScreenPaymentNoticeCard";
import ProductLiabilityInsuranceCard from "./_components/ProductLiabilityInsuranceCard";
import FaqCard from "./_components/FaqCard";
import ProductionCaseListCard from "./_components/ProductionCaseListCard";

export default function Page() {
  const router = useRouter();
  const bizClient = useBizClientStore(state => state.bizClient);


  // 모든 Hook을 먼저 호출
  const [deliverySchedule, setDeliverySchedule] = useState<"today" | "tomorrow" | "other" | "">("");
  const [timeLimit, setTimeLimit] = useState<string | undefined>(undefined);
  const [arrivalDate, setArrivalDate] = useState<string | undefined>(undefined);
  const cartItemCount = useCartItemStore(state => state.cartItems.length);
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);



  const checkDelivery = useCallback(async () => {
    if (bizClient && bizClient.road_address) {
      setIsCheckingDelivery(true);
      try {
        const info = await calculateDeliveryInfo(bizClient.road_address);
        console.log('info', info);

        if (info.isToday) {
          const cutoffMinutes = 18 * 60;
          const remainingMinutes = cutoffMinutes - info.expectedArrivalMinutes;
          const hours = Math.floor(remainingMinutes / 60);
          const minutes = remainingMinutes % 60;
          const timeLimitMessage =
            remainingMinutes <= 0
              ? "주문 마감"
              : `${hours > 0 ? `${hours}시간 ` : ""}${minutes}분 내 주문 시`;
          setDeliverySchedule("today");
          setTimeLimit(timeLimitMessage);
          setArrivalDate(undefined);
        } else {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          const isTomorrow = info.expectedArrivalMinutes <= (24 + 24) * 60; // 내일 이내 도착이면 tomorrow로 취급

          if (isTomorrow) {
            setDeliverySchedule("tomorrow");
            setTimeLimit("밤 12시 전 주문 시");
            setArrivalDate(undefined);
          } else {
            setDeliverySchedule("other");

            const futureDate = new Date();
            futureDate.setMinutes(futureDate.getMinutes() + info.remainingMinutes);
            const formatted = format(futureDate, "M/dd(E)", { locale: ko }); // 예: 7/18(목)

            setArrivalDate(formatted);
            setTimeLimit(`${formatted} 밤 12시 전 주문 시`);
          }
        }
      } catch (err) {
        console.error("배송 정보 계산 실패", err);
        setDeliverySchedule("other");
        setTimeLimit(undefined);
        setArrivalDate(undefined);
      } finally {
        setIsCheckingDelivery(false);
      }
    } else {
      setDeliverySchedule("");
      setTimeLimit(undefined);
      setArrivalDate(undefined);
    }
  }, [bizClient]);

  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
    // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
    setScreenName('home');
    const prev = getPreviousScreenName();
    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
      previous_screen: prev,
    });
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error checking session:", error);
        return;
      }
      if (!session) {
        console.log('❌ 세션이 없음, /start로 이동');
        router.replace("/start");
        return;
      }

      // 세션은 있지만 BizClient가 DB에 존재하는지 확인
      console.log('✅ 세션 존재, BizClient DB 존재 여부 확인 시작');
      try {
        const readBizClientUsecase = new ReadBizClientUsecase(new BizClientSupabaseRepository());
        const bizClientResponse = await readBizClientUsecase.execute(session.user.id);

        if (!bizClientResponse.success || !bizClientResponse.data) {
          console.log('❌ BizClient가 DB에 존재하지 않음, 로그아웃 후 /start로 이동');
          const kakaoAuthSupabaseRepository = new KakaoAuthSupabaseRepository();
          await kakaoAuthSupabaseRepository.logout();
          useBizClientStore.setState({ bizClient: null });
          useCartStore.setState({ cart: null });
          useOrderStore.setState({ order: null });
          router.replace("/start");
          return;
        }

        console.log('✅ BizClient가 DB에 존재함:', bizClientResponse.data.id);
      } catch (error) {
        console.error('BizClient DB 확인 중 에러:', error);
        // 에러 발생 시에도 로그아웃 처리
        const kakaoAuthSupabaseRepository = new KakaoAuthSupabaseRepository();
        await kakaoAuthSupabaseRepository.logout();
        useBizClientStore.setState({ bizClient: null });
        useCartStore.setState({ cart: null });
        useOrderStore.setState({ order: null });
        router.replace("/start");
      }
    };
    checkSession();
  }, []);

  // BizClient가 있을 때 데이터 로딩 및 배송 정보 확인
  useEffect(() => {
    if (bizClient) {
      console.log('✅ bizClient 존재, 데이터 로딩 시작:', bizClient.id);
      const loadData = async () => {
        try {
          const readCartUsecase = new CrudCartUsecase(new CartSupabaseRepository());
          const cart = await readCartUsecase.findById(bizClient.id!);

          useCartStore.setState({ cart: cart! });
          useOrderStore.setState({ order: null });

          console.log('✅ 데이터 로딩 완료, 배송 정보 확인 시작');
          await checkDelivery();
          console.log('✅ 배송 정보 확인 완료');
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      };

      loadData();
    }
  }, [bizClient]);

  // 로그인되지 않은 경우 로딩 화면 표시
  if (!bizClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">로그인 확인 중...</div>
      </div>
    );
  }

  let addressIndicatorProps: AddressIndicatorProps;
  if (isCheckingDelivery) {
    addressIndicatorProps = {
      address: bizClient.road_address,
      deliverySchedule: "",
      timeLimit: "배송 정보 계산 중...",
      isLoading: true,
    };
  } else if (!bizClient || !bizClient.road_address) {
    addressIndicatorProps = {
      deliverySchedule: "",
    };
  } else if (deliverySchedule === "today" && timeLimit) {
    addressIndicatorProps = {
      address: bizClient.road_address,
      deliverySchedule: "today",
      timeLimit,
    };
  } else if (deliverySchedule === "tomorrow" && timeLimit) {
    addressIndicatorProps = {
      address: bizClient.road_address,
      deliverySchedule: "tomorrow",
      timeLimit,
    };
  } else {
    addressIndicatorProps = {
      address: bizClient.road_address,
      deliverySchedule: "other",
      timeLimit,
      arrivalDate,
    };
  }

  return (
    <div className="flex min-h-screen flex-col bg-white pt-[60px]">
      {/* Amplitude 초기화 (클라이언트 전용) */}
      <InitAmplitude />
      <TopNavigator page="/" cartItemCount={cartItemCount || 0} />
      <Banner />

      <main className="mb-[40px] mt-10 flex flex-grow flex-col gap-7">
        <AddressIndicator {...addressIndicatorProps} />
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
