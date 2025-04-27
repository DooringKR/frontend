"use client";

import { useState } from "react";
import DaumPostcodePopup from "@/components/SearchAddress/DaumPostcode";
import { DeliverTime } from "@/utils/CheckDeliveryTime";

export default function SearchAddress() {
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);

  const handleComplete = async (data: any) => {
    try {
      const address = data.roadAddress || data.address;

      const { expectedArrivalMinutes, travelTime } = await DeliverTime(address);

      const cutoff = 18 * 60;

      if (expectedArrivalMinutes <= cutoff) {
        const hours = Math.floor(travelTime / 60);
        const minutes = Math.round(travelTime % 60);
        setDeliveryMessage(`당일 배송 가능   ${hours}시간 ${minutes}분 예상`);
      } else {
        setDeliveryMessage(
          `지금 주문하면 내일 배송되는 주소에요`
        );
      }
    } catch (e) {
      console.error(e);
      setDeliveryMessage("❗ 배송 가능 여부 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <DaumPostcodePopup onComplete={handleComplete} />
      {deliveryMessage && (
        <p className="text-lg font-semibold">{deliveryMessage}</p>
      )}
    </div>
  );
}

