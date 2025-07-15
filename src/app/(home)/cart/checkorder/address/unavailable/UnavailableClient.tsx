"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import CurrentTime from "@/components/DeliveryTimeCheck/CurrentTime";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { useOrderStore } from "@/store/orderStore";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";

import UnavailableDeliveryFooter from "../_components/UnavailableDeliveryFooter";

function UnavailableClientPage() {
  const router = useRouter();
  const { address } = useOrderStore();
  const [isClicked, setIsClicked] = useState(false);
  const [arrivalTimeFormatted, setArrivalTimeFormatted] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);

  const handleEstimatedTimeClick = () => {
    console.log("클릭");
    setIsClicked(prev => !prev);
  };

  // 최초 1회: remainingMinutes 받아오기
  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      if (!address.address1.trim()) return;
      try {
        setIsLoading(true);
        const { remainingMinutes } = await calculateDeliveryInfo(address.address1);
        setRemainingMinutes(remainingMinutes);
      } catch (err) {
        console.error("배송 시간 계산 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryInfo();
  }, [address.address1]);

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
    if (remainingMinutes === null) return "계산 중...";
    const h = Math.floor(remainingMinutes / 60);
    const m = remainingMinutes % 60;
    return `${h > 0 ? `${h}시간 ` : ""}${m}분`;
  };
  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator />
      <div className="mb- flex flex-grow flex-col justify-between p-5">
        <div className="flex flex-grow flex-col gap-5">
          <img src={"/icons/exclamation-mark.svg"} alt="느낌표 아이콘" className="h-12 w-12" />
          <div className="flex flex-col gap-2">
            <h1 className="text-[26px] font-700">
              입력한 주소는
              <br />
              오늘배송 어려워요
            </h1>
            <span className="text-[17px] font-400 text-gray-500">
              오늘배송 받으려면
              <br />
              예상 도착 시간이 오후 6시 전이어야 해요.
            </span>
          </div>
          <div>
            <div
              className={`flex justify-between border-gray-200 px-4 py-3 ${isClicked ? "rounded-t-xl border-l border-r border-t" : "rounded-xl border"}`}
              onClick={handleEstimatedTimeClick}
            >
              <span className="font-500 text-gray-500">예상 도착 시간</span>
              <div className="flex gap-1">
                <span className="text-[17px] font-600 text-blue-500">
                  {" "}
                  {isLoading ? "계산 중..." : arrivalTimeFormatted}
                </span>
                {isClicked ? (
                  <img src={"/icons/chevron-down-thick.svg"} alt="아래쪽 화살표" />
                ) : (
                  <img src={"/icons/chevron-right-thick.svg"} alt="오른쪽 화살표" />
                )}
              </div>
            </div>
            {/* 얘는 조건부 렌더 */}
            {isClicked ? (
              <>
                <div className="mx-4 h-[1px] rounded-full bg-gray-200"></div>
                <div className="rounded-b-xl border-b border-l border-r border-gray-200 px-4 py-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between font-500">
                      <div className="text-gray-500">현재 시각</div>
                      <div>
                        <CurrentTime textColor="text-gray-800" />
                      </div>
                    </div>
                    <div className="flex justify-between font-500">
                      <div className="text-gray-500">주문 접수 및 제작 시간</div>
                      <div>+ 30분</div>
                    </div>
                    <div className="flex justify-between font-500">
                      <div className="text-gray-500">예상 배송 시간</div>
                      {/* <div>+ {formatMinutes(remainingMinutes)}</div> */}
                      <div>+ {formatRemainingTime()}</div>
                    </div>
                  </div>
                  <div className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-gray-200 bg-gray-100 px-4 py-3">
                    {address.address1}
                    {address.address2 ? ` (${address.address2})` : ""}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <UnavailableDeliveryFooter />
        </div>
        <div className="pt-5">
          <Button type="Brand" text="확인했어요" onClick={() => router.back()} />
        </div>
      </div>
    </div>
  );
}

export default UnavailableClientPage;
