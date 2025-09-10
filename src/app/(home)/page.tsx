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
import { useSingleCartStore } from "@/store/singleCartStore";
import useUserStore from "@/store/userStore";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";

import Footer from "./_components/Footer";

export default function Page() {
  const router = useRouter();
  const resetCart = useSingleCartStore(state => state.reset);
  const { address1, address2, setAddress } = useAddressStore();
  const fullAddress = address1 || "";

  // 모든 Hook을 먼저 호출
  const [deliverySchedule, setDeliverySchedule] = useState<"today" | "tomorrow" | "other" | "">("");
  const [timeLimit, setTimeLimit] = useState<string | undefined>(undefined);
  const [arrivalDate, setArrivalDate] = useState<string | undefined>(undefined);

  const userId = useUserStore(state => state.id);
  const userAddress1 = useUserStore(state => state.user_road_address);
  const userAddress2 = useUserStore(state => state.user_detail_address);
  const setCartItems = useCartStore(state => state.setCartItems);
  const cartItems = useCartStore(state => state.cartItems);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);
  // useEffect(() => {
  //   if (userAddress1 && userAddress2) {
  //     setAddress(userAddress1, userAddress2);
  //   }
  // }, [userAddress1, userAddress2]);
  const hasInitializedAddress = useRef(false);

  useEffect(() => {
    if (!hasInitializedAddress.current && userAddress1 && userAddress2) {
      setAddress(userAddress1, userAddress2);
      hasInitializedAddress.current = true;
    }
  }, [userAddress1, userAddress2]);

  // 로그인 상태 체크
  useEffect(() => {
    // localStorage에서 데이터를 복원하는 동안 잠시 대기
    const timer = setTimeout(() => {
      if (!userId) {
        router.replace("https://landing.baro.dooring.kr/");
      }
    }, 100); // 100ms 대기

    return () => clearTimeout(timer);
  }, [userId, router]);

  useEffect(() => {
    useSingleCartStore.persist.clearStorage();
    resetCart();
  }, []);

  useEffect(() => {
    // const totalCount = cartItems.reduce((acc, item) => acc + (item.item_count ?? 1), 0);
    // setCartItemCount(totalCount);
    setCartItemCount(cartItems.length);
  }, [cartItems]);

  // const formatOrderDeadline = (remainingMinutes: number): string => {
  //   const hours = Math.floor(remainingMinutes / 60);
  //   const minutes = remainingMinutes % 60;

  //   if (remainingMinutes <= 0) return "주문 마감";

  //   return `${hours > 0 ? `${hours}시간 ` : ""}${minutes}분 내 주문 시`;
  // };

  useEffect(() => {
    const checkDelivery = async () => {
      if (address1) {
        setIsCheckingDelivery(true);
        try {
          const info = await calculateDeliveryInfo(address1);

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

    checkDelivery();
  }, [address1]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const cartData = await getCartItems(userId);
        setCartItems(cartData.items);
      } catch (err) {
        console.error("장바구니 불러오기 실패", err);
      }
    };

    fetchCart();
  }, [userId]);

  // 로그인되지 않은 경우 로딩 화면 표시
  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">로그인 확인 중...</div>
      </div>
    );
  }

  let addressIndicatorProps: AddressIndicatorProps;
  if (isCheckingDelivery) {
    addressIndicatorProps = {
      address: fullAddress,
      deliverySchedule: "",
      timeLimit: "배송 정보 계산 중...",
      isLoading: true,
    };
  } else if (!address1) {
    addressIndicatorProps = {
      deliverySchedule: "",
    };
  } else if (deliverySchedule === "today" && timeLimit) {
    addressIndicatorProps = {
      address: fullAddress,
      deliverySchedule: "today",
      timeLimit,
    };
  } else if (deliverySchedule === "tomorrow" && timeLimit) {
    addressIndicatorProps = {
      address: fullAddress,
      deliverySchedule: "tomorrow",
      timeLimit,
    };
  } else {
    addressIndicatorProps = {
      address: fullAddress,
      deliverySchedule: "other",
      timeLimit,
      arrivalDate,
    };
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TopNavigator page="/" cartItemCount={cartItemCount} />
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
