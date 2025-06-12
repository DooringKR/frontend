"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";

import { AccessoryItem } from "@/store/Items/accessoryStore";
import { CabinetItem } from "@/store/Items/cabinetStore";
import { DoorItem } from "@/store/Items/doorStore";
import { FinishItem } from "@/store/Items/finishStore";
import { HardwareItem } from "@/store/Items/hardwareStore";
import { DeliverTime } from "@/utils/CheckDeliveryTime";

import CartItemDetail from "./_components/CartItemDetail";

const CATEGORY_MAP: Record<string, string> = {
  door: "문짝",
  finish: "마감재",
  accessory: "부속품",
  hardware: "하드웨어",
  cabinet: "부분장",
};

type OrderItem = DoorItem | FinishItem | CabinetItem | AccessoryItem | HardwareItem | null;

export default function CartPage() {
  const router = useRouter();

  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryMessageColor, setDeliveryMessageColor] = useState("text-black");
  const [cartGroups, setCartGroups] = useState<Record<string, OrderItem[]>>({});
  const [hasItems, setHasItems] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("address-storage") || "{}");
    const cartItems: OrderItem[] = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const address1 = saved.state?.address1 || "주소 없음";

    const grouped: Record<string, OrderItem[]> = {};
    cartItems.forEach(item => {
      if (!item) return;
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    setCartGroups(grouped);
    setHasItems(cartItems.length > 0);

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

  const handleOrder = () => {
    router.push("/cart/checkorder");
  };

  const handleAddProduct = () => {
    router.push("/");
  };

  const getTotalPrice = () => {
    return Object.values(cartGroups)
      .flat()
      .reduce((sum, item) => {
        if (!item) return sum;
        return sum + (item.price ?? 0) * (item.count ?? 1);
      }, 0);
  };

  const handleCountChange = (category: string, index: number, newCount: number) => {
    setCartGroups(prev => {
      const newGroups = { ...prev };
      const updatedItems = [...(newGroups[category] || [])];

      if (updatedItems[index]) {
        updatedItems[index] = {
          ...updatedItems[index],
          count: newCount,
        };
      }

      newGroups[category] = updatedItems;
      return newGroups;
    });
  };

  if (!hasItems) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-5">
        <h1 className="mb-4 text-xl font-bold">장바구니</h1>
        <p className="mb-6 text-center text-lg font-semibold">
          상품이 하나도 없어요.
          <br />
          상품을 담아볼까요?
        </p>
        <Button className="w-full bg-gray-200 text-black" onClick={handleAddProduct}>
          상품 추가
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-5 pb-20">
      <h1 className="mb-4 text-center text-xl font-bold">장바구니</h1>

      <div className={`mb-4 p-2 text-center font-medium ${deliveryMessageColor}`}>
        {deliveryMessage}
      </div>

      {Object.entries(cartGroups).map(([category, items], groupIdx) => (
        <div key={category + groupIdx} className="mb-4 flex flex-col gap-3">
          {items.map((item, i) => {
            if (!item) return null;
            return (
              <CartItemDetail
                key={`${category}-${i}`}
                item={item}
                onCountChange={newCount => handleCountChange(category, i, newCount)}
              />
            );
          })}
        </div>
      ))}

      <Button selected={true} className="mb-3" onClick={handleAddProduct}>
        상품 추가
      </Button>

      <div className="my-6">
        <p className="mb-2 text-lg font-semibold">결제금액을 확인해주세요</p>

        <div className="w-full bg-gray-300 p-4">
          <div className="mb-2 flex justify-between">
            <span className="font-bold">총 금액</span>
            <span className="font-bold">{getTotalPrice().toLocaleString()}원</span>
          </div>
          {Object.entries(cartGroups).map(([category, items]) => {
            const categoryTotal = items.reduce((sum, item) => {
              if (!item) return sum;
              return sum + (item.price ?? 0) * (item.count ?? 1);
            }, 0);

            return (
              <div key={category} className="mb-1 flex justify-between">
                <span>{CATEGORY_MAP[category] || category}</span>
                <span>{categoryTotal.toLocaleString()}원</span>
              </div>
            );
          })}

          <hr className="my-2 border-black" />

          <div className="flex justify-between">
            <span className="font-bold">결제예정금액</span>
            <span className="font-bold">{getTotalPrice().toLocaleString()}원</span>
          </div>
        </div>
      </div>
      <Button selected={true} onClick={handleOrder}>
        다음
      </Button>
    </div>
  );
}
