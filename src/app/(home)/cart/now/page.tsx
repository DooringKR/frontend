"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";

import { useCurrentOrderStore } from "@/store/Items/currentOrderStore";
import { DeliverTime } from "@/utils/CheckDeliveryTime";
import { getCurrentItemByCategory } from "@/utils/getCurrentItemByCategory";

import Accessory from "./_components/Accessory";
import Cabinet from "./_components/Cabinet";
import Door from "./_components/Door";
import Finish from "./_components/Finish";
import Hardware from "./_components/Hardware";

export default function PurchasePage() {
  if (typeof window === "undefined") return null;

  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") as
    | "door"
    | "finish"
    | "cabinet"
    | "accessory"
    | "hardware";

  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryMessageColor, setDeliveryMessageColor] = useState("text-black");
  const { setCurrentItem } = useCurrentOrderStore();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("address-storage") || "{}");
    const address1 = saved.state?.address1 || "주소 없음";

    const fetchDeliveryTime = async () => {
      if (address1 !== "주소 없음") {
        const { expectedArrivalMinutes } = await DeliverTime(address1);
        const cutoff = 18 * 60;
        const hours = Math.floor(expectedArrivalMinutes / 60)
          .toString()
          .padStart(2, "0");
        const minutes = (expectedArrivalMinutes % 60).toString().padStart(2, "0");
        if (expectedArrivalMinutes <= cutoff) {
          setDeliveryMessage(`당일배송 가능 ${hours}:${minutes}`);
          setDeliveryMessageColor("bg-[#cbdcfb] text-[#215cff]");
        } else {
          setDeliveryMessage(`내일 배송되는 주소에요`);
          setDeliveryMessageColor("bg-gray-500 text-[#bf6a02]");
        }
      }
    };
    fetchDeliveryTime();
  }, []);

  const renderComponentByCategory = (category: string) => {
    switch (category) {
      case "door":
        return <Door />;
      case "finish":
        return <Finish />;
      case "cabinet":
        return <Cabinet />;
      case "accessory":
        return <Accessory />;
      case "hardware":
        return <Hardware />;
      default:
        return null;
    }
  };

  const handleOrder = () => {
    const item = getCurrentItemByCategory(category);
    console.log(item);
    setCurrentItem(item);
    router.push("/cart/checkorder?current=now");
  };

  return (
    <div className="flex flex-col p-5 pb-20">
      <h1 className="text- mb-4 text-xl font-bold">장바구니</h1>

      <div className={`mb-4 p-2 text-center font-medium ${deliveryMessageColor}`}>
        {deliveryMessage}
      </div>
      <div>
        {renderComponentByCategory(category)}
        <Button className="w-full bg-black text-white" onClick={handleOrder}>
          다음
        </Button>
      </div>
    </div>
  );
}
