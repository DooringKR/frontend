"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Button from "@/components/Button/Button";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import PriceSummaryCard from "@/components/PriceCheckCard/PriceSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { AccessoryItem } from "@/store/Items/accessoryStore";
import { CabinetItem } from "@/store/Items/cabinetStore";
import { DoorItem } from "@/store/Items/doorStore";
import { FinishItem } from "@/store/Items/finishStore";
import { HardwareItem } from "@/store/Items/hardwareStore";

const DOOR_TYPE_KR_MAP: Record<string, string> = {
  normal: "일반문",
  flap: "플랩문",
  drawer: "서랍",
};

const CATEGORY_MAP: Record<string, string> = {
  door: "문짝",
  finish: "마감재",
  accessory: "부속품",
  hardware: "하드웨어",
  cabinet: "부분장",
};

type OrderItem = DoorItem | FinishItem | CabinetItem | AccessoryItem | HardwareItem | null;

function ShoppingCart() {
  const router = useRouter();

  const [cartGroups, setCartGroups] = useState<Record<string, OrderItem[]>>({});
  const [hasItems, setHasItems] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("address-storage") || "{}");
    const cartItems: OrderItem[] = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const address1 = saved.state?.address1 || "주소 없음";

    const grouped: Record<string, OrderItem[]> = {};
    cartItems.forEach(item => {
      if (!item) return;
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    setCartGroups(grouped);
    setHasItems(cartItems.length > 0);
  }, []);

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

      const allItems = Object.values(newGroups).flat().filter(Boolean);
      localStorage.setItem("cartItems", JSON.stringify(allItems));

      return newGroups;
    });
  };

  const handleGoToReceiveOption = () => {
    router.push("/cart/receive-option");
  };

  const handleAddProduct = () => {
    router.push("/");
  };

  if (!hasItems) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopNavigator title="장바구니" />
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <img src="/icons/paper.svg" alt="빈 용지 아이콘" className="mb-3" />
          <p className="mb-5 text-center text-[17px] font-500 text-gray-500">장바구니가 비었어요</p>
          <div>
            <Button text="상품추가" type="Brand" onClick={handleAddProduct}></Button>
          </div>
        </div>
      </div>
    );
  }

  const getTotalItemCount = () => {
    return Object.values(cartGroups)
      .flat()
      .reduce((sum, item) => sum + (item?.count ?? 0), 0);
  };
  const sanitizedCartGroups = Object.fromEntries(
    Object.entries(cartGroups).map(([key, items]) => [key, items.filter(Boolean)]),
  );
  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator title="장바구니" />
      <div className="flex-1 overflow-y-auto pb-[150px]">
        <div className="p-5">
          <div className="pb-3 text-xl font-600">상품 {getTotalItemCount()}개</div>
          {Object.entries(cartGroups).map(([category, items], groupIdx) => (
            <div key={category + groupIdx} className="mb-4 flex flex-col gap-3">
              {items.map((item, i) => {
                if (!item) return null;

                const key = `${category}-${i}`;
                const commonProps = {
                  trashable: true,
                  onIncrease: () => handleCountChange(category, i, (item.count ?? 0) + 1),
                  onDecrease: () => handleCountChange(category, i, (item.count ?? 0) - 1),
                };

                if (category === "door") {
                  const doorItem = item as DoorItem;

                  return (
                    <ShoppingCartCard
                      key={key}
                      title={DOOR_TYPE_KR_MAP[doorItem.slug ?? "normal"]}
                      color={doorItem.color ?? ""}
                      width={String(doorItem.width ?? "")}
                      height={String(doorItem.height ?? "")}
                      hingeCount={doorItem.hinge?.hingeCount ?? 0}
                      hingeDirection={doorItem.hinge?.hingePosition === "left" ? "좌경" : "우경"}
                      boring={`상 ${doorItem.hinge?.topHinge} 중 ${doorItem.hinge?.middleHinge} 하 ${doorItem.hinge?.bottomHinge}`}
                      quantity={doorItem.count ?? 0}
                      trashable={true}
                      onIncrease={() => handleCountChange(category, i, (doorItem.count ?? 0) + 1)}
                      onDecrease={() => handleCountChange(category, i, (doorItem.count ?? 0) - 1)}
                    />
                  );
                }

                if (category === "finish") {
                  const finishItem = item as FinishItem;
                  return (
                    <ShoppingCartCard
                      key={key}
                      title={"마감재"}
                      color={finishItem.color ?? ""}
                      width={""}
                      height={String(finishItem.height ?? "")}
                      hingeCount={0}
                      hingeDirection={"없음"}
                      boring={"-"}
                      quantity={finishItem.count ?? 0}
                      {...commonProps}
                    />
                  );
                }

                if (category === "cabinet") {
                  const cabinetItem = item as CabinetItem;
                  return (
                    <ShoppingCartCard
                      key={key}
                      title={cabinetItem.slug ?? "부분장"}
                      color={cabinetItem.color ?? ""}
                      width={String(cabinetItem.width ?? "")}
                      height={String(cabinetItem.height ?? "")}
                      hingeCount={0}
                      hingeDirection={"없음"}
                      boring={"-"}
                      quantity={cabinetItem.count ?? 0}
                      {...commonProps}
                    />
                  );
                }

                if (category === "accessory") {
                  const accessoryItem = item as AccessoryItem;
                  return (
                    <ShoppingCartCard
                      key={key}
                      title={accessoryItem.slug ?? "부속품"}
                      color={"-"}
                      width={"-"}
                      height={"-"}
                      hingeCount={0}
                      hingeDirection={"없음"}
                      boring={"-"}
                      quantity={accessoryItem.count ?? 0}
                      {...commonProps}
                    />
                  );
                }

                if (category === "hardware") {
                  const hardwareItem = item as HardwareItem;
                  return (
                    <ShoppingCartCard
                      key={key}
                      title={hardwareItem.slug ?? "하드웨어"}
                      color={"-"}
                      width={"-"}
                      height={"-"}
                      hingeCount={0}
                      hingeDirection={"없음"}
                      boring={"-"}
                      quantity={hardwareItem.count ?? 0}
                      {...commonProps}
                    />
                  );
                }

                return null;
              })}
            </div>
          ))}
          <BottomButton
            type="1button"
            button1Text="상품 추가"
            button1Type="BrandInverse"
            className="w-full pt-0"
            onButton1Click={handleAddProduct}
          />
        </div>
        <div className="px-5">
          <PriceSummaryCard
            cartGroups={sanitizedCartGroups}
            getTotalPrice={getTotalPrice}
            categoryMap={CATEGORY_MAP}
          />
        </div>
      </div>

      <div className="w-full max-w-[500px] bg-white">
        <BottomButton
          type="textcombo+button"
          textComboText={{
            title: `${getTotalPrice().toLocaleString()}원`,
            subtitle: "주문금액",
          }}
          button1Text="다음"
          button1Type="Brand"
          onButton1Click={handleGoToReceiveOption}
        />
      </div>
    </div>
  );
}

export default ShoppingCart;
