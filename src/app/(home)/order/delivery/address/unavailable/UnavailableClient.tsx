"use client";

import { useRouter } from "next/navigation";
import ClockIcon from "public/icons/clock";
import TruckIcon from "public/icons/truck";
import WrenchIcon from "public/icons/wrench";
import { useEffect, useState } from "react";

import CurrentTime from "@/components/DeliveryTimeCheck/CurrentTime";
import GrayVerticalLine from "@/components/GrayVerticalLine/GrayVerticalLine";
import BottomBar from "@/components/overlay/BottomBar";
import { Loading } from "@/components/state/StateViews";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { goBack } from "@/lib/nav/go";

import { useOrderStore } from "@/store/orderStore";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";


function UnavailableClientPage() {
  const router = useRouter();
  const { order } = useOrderStore();
  const [arrivalTimeFormatted, setArrivalTimeFormatted] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);

  // 최초 1회: remainingMinutes 받아오기
  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      if (!order?.road_address?.trim()) return;
      try {
        setIsLoading(true);
        const { remainingMinutes } = await calculateDeliveryInfo(order.road_address);
        setRemainingMinutes(remainingMinutes);
      } catch (err) {
        console.error("배송 시간 계산 실패:", err);
        setFailed(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryInfo();
  }, [order?.road_address]);

  // 현재 시각 + remainingMinutes 로 도착 시간 계산 (1분마다)
  useEffect(() => {
    if (remainingMinutes === null) return;

    const updateArrivalTime = () => {
      const now = new Date();
      const arrival = new Date(now.getTime() + remainingMinutes * 60 * 1000);
      const hours = String(arrival.getHours()).padStart(2, "0");
      const minutes = String(arrival.getMinutes()).padStart(2, "0");
      setArrivalTimeFormatted(`${hours}시 ${minutes}분`);
    };

    updateArrivalTime();
    const interval = setInterval(updateArrivalTime, 60000);
    return () => clearInterval(interval);
  }, [remainingMinutes]);

  // 예상 배송 시간 텍스트
  const formatRemainingTime = () => {
    if (remainingMinutes === null) return "";
    const h = Math.floor(remainingMinutes / 60);
    const m = remainingMinutes % 60;
    return `${h > 0 ? `${h}시간 ` : ""}${m}분`;
  };

  // 현재 시간에 30분을 더한 시간을 포맷팅
  const formatCurrentTimePlus30 = () => {
    const now = new Date();
    const plus30 = new Date(now.getTime() + 30 * 60 * 1000); // 30분 추가
    const hours = String(plus30.getHours()).padStart(2, "0");
    const minutes = String(plus30.getMinutes()).padStart(2, "0");
    return `${hours}시 ${minutes}분`;
  };
  return (
    <div className="flex min-h-screen flex-col pt-[60px]">
      <TopNavigator backTo="/order/delivery/address" />
      <div className="mb- flex flex-grow flex-col justify-between p-5">
        <div className="flex flex-grow flex-col gap-5">
          <img src={"/icons/exclamation-mark.svg"} alt="느낌표 아이콘" className="h-12 w-12" />
          <div className="flex flex-col gap-2">
            <h1 className="text-[26px] font-700">입력한 주소는 오늘배송 불가해요.</h1>
            <span className="text-[17px] font-400 text-gray-500">
              예상 도착시간이 18시보다 늦으면 오늘배송 불가해요
            </span>
          </div>
          <div className="flex flex-col px-5 py-[40px]">
            {/* 예상 도착 시간 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TruckIcon width={32} height={32} />
                <span className="text-[17px]/[24px] font-600 text-gray-800">예상 도착 시간</span>
              </div>
              <span className="text-[17px]/[24px] font-600 text-blue-500">
                {isLoading ? <Loading variant="inline" label="계산 중" /> : failed ? "계산하지 못했어요" : arrivalTimeFormatted}
              </span>
            </div>
            {/* 소요시간 계산 */}
            <div className="flex gap-3 py-2">
              <GrayVerticalLine
                isExpanded={true}
                expandedMinHeight="72px"
                marginX="mx-[14.5px]"
                width="w-[3px]"
              />
              <span className="text-[16px]/[22px] font-400 text-gray-500">
                {remainingMinutes === null
                  ? failed
                    ? "걸리는 시간을 계산하지 못했어요"
                    : <Loading variant="inline" label="계산 중" />
                  : `${order?.road_address}까지 ${formatRemainingTime()} 걸려요`}
              </span>
            </div>
            {/* 주문 접수 및 제작 시간 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WrenchIcon width={32} height={32} />
                <span className="text-[17px]/[24px] font-600 text-gray-800">주문 확인 및 제작</span>
              </div>
              <span className="text-[17px]/[24px] font-600 text-blue-500">
                {formatCurrentTimePlus30()}
              </span>
            </div>
            {/* 주문 접수 및 제작 시간 */}
            <div className="flex gap-3 py-2">
              <GrayVerticalLine
                isExpanded={true}
                expandedMinHeight="72px"
                marginX="mx-[14.5px]"
                width="w-[3px]"
              />
              <span className="text-[16px]/[22px] font-400 text-gray-500">
                주문 확인하고 제작까지 30분 걸려요
              </span>
            </div>
            {/* 현재 시각*/}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClockIcon width={32} height={32} />
                <span className="text-[17px]/[24px] font-600 text-gray-800">현재 시각</span>
              </div>
              <CurrentTime textColor="text-blue-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[100px]"></div>
      <BottomBar>
        <Button variant="inverse" onClick={() => goBack(router, "/order/delivery/address")}>
          확인했어요
        </Button>
      </BottomBar>
    </div>
  );
}

export default UnavailableClientPage;
