"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import CurrentTime from "@/components/DeliveryTimeCheck/CurrentTime";

import useAddressStore from "@/store/addressStore";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";

export default function UnavailableDeliveryPage() {
  const router = useRouter();

  // const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);
  const [arrivalTimeFormatted, setArrivalTimeFormatted] = useState("");
  const [productionTimeFormatted, setProductionTimeFormatted] = useState("");
  const { address1 } = useAddressStore();

  // useEffect(() => {
  //   const fetchDeliveryInfo = async () => {
  //     try {
  //       if (address1.trim() === "") return;
  //       const { arrivalTimeFormatted } = await calculateDeliveryInfo(address1);
  //       setArrivalTimeFormatted(arrivalTimeFormatted);
  //       setRemainingMinutes(remainingMinutes);
  //     } catch (error) {
  //       console.error("도착 시간 계산 실패:", error);
  //     }
  //   };

  //   fetchDeliveryInfo();
  // }, [address1]);

  useEffect(() => {
    const fetchOnce = async () => {
      try {
        const { remainingMinutes } = await calculateDeliveryInfo(address1);
        setRemainingMinutes(remainingMinutes);
      } catch (err) {
        console.error("배송 시간 계산 실패:", err);
      }
    };
    fetchOnce();
  }, [address1]);

  useEffect(() => {
    if (remainingMinutes === null) return;

    const updateTimes = () => {
      const now = new Date();
      const arrival = new Date(now.getTime() + remainingMinutes * 60 * 1000);
      const production = new Date(now.getTime() + 30 * 60 * 1000);

      const format = (date: Date) =>
        `${String(date.getHours()).padStart(2, "0")}시 ${String(date.getMinutes()).padStart(2, "0")}분`;

      setArrivalTimeFormatted(format(arrival));
      setProductionTimeFormatted(format(production));
    };

    updateTimes(); // 초기 1회
    const interval = setInterval(updateTimes, 60000); // 1분마다
    return () => clearInterval(interval);
  }, [remainingMinutes]);

  const formatRemainingTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes}분`;
    if (minutes === 0) return `${hours}시간`;
    return `${hours}시간 ${minutes}분`;
  };

  const handleClickConfirmButton = () => {
    router.back();
  };

  const handleClickCustomerServiceButton = () => {
    router.push("/customer-service");
  };

  // const getProductionTime = (): string => {
  //   const now = new Date();
  //   now.setMinutes(now.getMinutes() + 30);

  //   const hours = now.getHours().toString().padStart(2, "0");
  //   const minutes = now.getMinutes().toString().padStart(2, "0");

  //   return `${hours}시 ${minutes}분`;
  // };

  return (
    <div className="relative mx-auto flex min-h-screen max-w-[500px] flex-col justify-center">
      <div className="flex flex-grow flex-col">
        <div className="p-5">
          <div>
            <img
              src="/icons/exclamation-mark.svg"
              alt="경고 아이콘"
              className="h-[60px] w-[60px]"
            />
            <div className="mt-5 flex-col gap-2">
              <h1 className="text-[23px] font-700">입력한 주소는 오늘배송 불가해요</h1>
              <p className="text-[17px] font-400 text-gray-500">
                예상 도착시간이 18시보다 늦으면 오늘배송 불가해요
              </p>
            </div>
            <div className="my-10">
              <div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <img src="/icons/truck.svg" alt="트럭" className="mr-3" />
                    <span className="text-[17px] font-600">예상 도착시간</span>
                  </div>
                  <span className="text-[17px] font-600 text-blue-500">
                    {arrivalTimeFormatted ? arrivalTimeFormatted : "계산 중..."}
                  </span>
                </div>
                <div className="flex gap-3 py-2">
                  <div className="mx-[14.5px] w-[3px] bg-gray-200"></div>
                  {remainingMinutes !== null && (
                    <span className="mb-7 w-full text-base font-400 text-gray-500">
                      {remainingMinutes !== null
                        ? `${address1}까지 ${formatRemainingTime(remainingMinutes)} 걸려요`
                        : "계산 중이에요..."}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <img src="/icons/tool.svg" alt="렌치" className="mr-3" />
                    <span className="text-[17px] font-600">주문 확인 및 제작</span>
                  </div>
                  <span className="text-[17px] font-600 text-blue-500">
                    {productionTimeFormatted ? productionTimeFormatted : "계산 중..."}
                  </span>
                </div>
                <div className="flex gap-3 py-2">
                  <div className="mx-[14.5px] w-[3px] bg-gray-200"></div>
                  <span className="mb-7 w-full text-base font-400 text-gray-500">
                    주문 확인하고 제작까지 30분 걸려요
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <img src="/icons/watch.svg" alt="시계" className="mr-3" />
                    <span className="text-[17px] font-600">현재 시각</span>
                  </div>
                  <CurrentTime />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow justify-end bg-gray-50">
        <div className="px-5 py-10 font-400 text-gray-500">
          {arrivalTimeFormatted
            ? `${arrivalTimeFormatted} 이후 도착해도 괜찮다면 고객센터에 직접 전화해주세요.`
            : "계산 중..."}
        </div>
      </div>
      <div className="h-[100px]"></div>
      <div>
        <BottomButton
          className="fixed bottom-0 w-full max-w-[500px] px-5 pb-5"
          type="2buttons"
          button1Text="확인했어요"
          button2Text="고객센터 전화"
          button1Type="BrandInverse"
          onButton1Click={handleClickConfirmButton}
          onButton2Click={handleClickCustomerServiceButton}
        />
      </div>
    </div>
  );
}
