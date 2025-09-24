"use client";

import { getCartItems } from "@/api/cartApi";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
import useBizClientStore from "@/store/bizClientStore";
import { ReadBizClientUsecase } from "@/DDD/usecase/user/read_bizClient_usecase";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { BizClient } from "dooring-core-domain/dist/models/User/BizClient";

export default function Page() {
  const router = useRouter();
  const bizClient = useBizClientStore(state => state.bizClient);
  // const resetCart = useSingleCartStore(state => state.reset);
  const { address1, address2, setAddress } = useAddressStore();

  // 모든 Hook을 먼저 호출
  const [deliverySchedule, setDeliverySchedule] = useState<"today" | "tomorrow" | "other" | "">("");
  const [timeLimit, setTimeLimit] = useState<string | undefined>(undefined);
  const [arrivalDate, setArrivalDate] = useState<string | undefined>(undefined);
  const cartItemCount = useCartStore(state => state.cart?.cart_count);
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);

  // 로그인 상태 체크
  useEffect(() => {
    // localStorage에서 데이터를 복원하는 동안 잠시 대기
    const timer = setTimeout(async () => {
      if (!bizClient) {
        // router.replace("https://landing.baro.dooring.kr/");
        // router.replace("/kako-login");
        router.replace("/login");
      } else {
        try {
          // console.log('11112222211');
          // console.log(bizClient);
          // console.log('12312312312312312');
          // const readBizClientUsecase = new ReadBizClientUsecase(new BizClientSupabaseRepository());
          // BizClient의 id를 올바르게 가져와야 합니다. 예시로 localStorage에서 가져오는 방식 사용
          // const bizClientId = localStorage.getItem('bizClientId');
          // if (!bizClientId) {
          //   throw new Error('bizClientId가 존재하지 않습니다.');
          // }
          // const bizClient = await readBizClientUsecase.execute(bizClient.id);
          const readCartUsecase = new CrudCartUsecase(new CartSupabaseRepository());
          const cart = await readCartUsecase.findById(bizClient.id!);

          useBizClientStore.setState({ bizClient: bizClient });
          useCartStore.setState({ cart: cart! });
          await checkDelivery();
          return;
        } catch (err) {
          console.error("Error checking user:", err);
        }
      }
    }, 100); // 100ms 대기

    return () => clearTimeout(timer);
  }, [router, bizClient]);

  const checkDelivery = async () => {
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
          // const timeLimitMessage = calculateOrderDeadline(info.expectedArrivalMinutes);
          setDeliverySchedule("today");
          setTimeLimit(timeLimitMessage);
          // setTimeLimit(`${formatOrderDeadline(info.remainingMinutes)}`);
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
  };

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
    <div className="flex min-h-screen flex-col bg-white">
      <TopNavigator page="/" cartItemCount={cartItemCount || 0} />
      <Banner />

      <main className="mb-[100px] mt-10 flex flex-grow flex-col gap-7">
        <AddressIndicator {...addressIndicatorProps} />
        <HomeProductContainer />
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
