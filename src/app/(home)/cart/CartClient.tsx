"use client";

import { deleteCartItem, getCartItems, updateCartItem } from "@/api/cartApi";
import {
  ACCESSORY_CATEGORY_LIST,
  CABINET_CATEGORY_LIST,
  DOOR_CATEGORY_LIST,
  FINISH_CATEGORY_LIST,
  HARDWARE_CATEGORY_LIST,
} from "@/constants/category";
import { CART_PAGE } from "@/constants/pageName";
import {
  AccessoryItem,
  CabinetItem,
  DoorItem,
  FinishItem,
  HardwareItem,
} from "@/types/newItemTypes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Button from "@/components/Button/Button";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import PriceSummaryCard from "@/components/PriceCheckCard/PriceSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useCartStore from "@/store/cartStore";
import { formatBoringDirection } from "@/utils/formatBoring";
import formatColor from "@/utils/formatColor";
import { getCategoryLabel } from "@/utils/getCategoryLabel";

const DOOR_TYPE_SLUG_MAP: Record<string, string> = {
  standard: "STANDARD",
  flap: "FLAP",
  drawer: "DRAWER",
};

const CATEGORY_MAP: Record<string, string> = {
  door: "문짝",
  finish: "마감재",
  cabinet: "부분장",
  hardware: "하드웨어",
  accessory: "부속",
};

export const PRODUCT_TYPE_KR_MAP: Record<string, string> = {
  DOOR: "일반문",
  FINISH: "마감재",
  CABINET: "부분장",
  HARDWARE: "하드웨어",
  ACCESSORY: "부속",
};

type OrderItem = DoorItem | FinishItem | CabinetItem | AccessoryItem | HardwareItem | null;
export type AnyCartItem = DoorItem | CabinetItem | AccessoryItem | FinishItem | HardwareItem;

export default function CartClient() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const setCartId = useCartStore(state => state.setCartId);
  const userId = useCartStore(state => state.cart?.user_id);
  const cartItems = [] as AnyCartItem[];



  const handleGoToReceiveOption = async () => {
    try {
      router.push("/cart/receive-option");
    } catch (err) {
      console.error("❌ 수량 반영 실패:", err);
      alert("수량 반영 중 문제가 발생했어요.");
    }
  };

  const handleAddProduct = () => {
    router.push("/");
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-gray-500">
        <TopNavigator title="장바구니" page={CART_PAGE} />
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <p className="text-[17px] font-500">장바구니 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 장바구니 비었을 때
  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopNavigator title="장바구니" page={CART_PAGE} />
        <div className="flex flex-1 flex-col items-center justify-center px-5">
          <img src="/icons/paper.svg" alt="빈 용지 아이콘" className="mb-3" />
          <p className="mb-5 text-center text-[17px] font-500 text-gray-500">장바구니가 비었어요</p>
          <Button text="상품추가" type="Brand" onClick={handleAddProduct} />
        </div>
      </div>
    );
  }

  const getTotalItemCount = () => {
    return cartItems.reduce((sum, item) => {
      if (!item) return sum;
      return sum + (item.count ?? 0);
    }, 0);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigator title="장바구니" page={CART_PAGE} />
      <div className="flex-1 overflow-y-auto pb-[150px]">
        <div className="p-5">
          <div className="pb-3 text-xl font-600">상품 {getTotalItemCount()}개</div>

          <div className="mb-4 flex flex-col gap-3">
            {cartItems.map((item, i) => {
              if (!item) return null;

              const category = item.category;
              const key = `${category}-${i}`;
              const commonProps = {
                trashable: true,
                onIncrease: () => handleCountChange(category, i, (item.count ?? 0) + 1),
                onDecrease: () => handleCountChange(category, i, (item.count ?? 0) - 1),
              };

              if (category === "door") {
                const doorItem = item as DoorItem;

                // hinge_count에 따라 boring 배열 동적 생성
                const boringArray = [];
                for (let i = 0; i < doorItem.hinge_count; i++) {
                  switch (i) {
                    case 0:
                      boringArray.push(doorItem.first_hinge ?? null);
                      break;
                    case 1:
                      boringArray.push(doorItem.second_hinge ?? null);
                      break;
                    case 2:
                      boringArray.push(doorItem.third_hinge ?? null);
                      break;
                    case 3:
                      boringArray.push(doorItem.fourth_hinge ?? null);
                      break;
                    default:
                      boringArray.push(null);
                  }
                }

                return (
                  <ShoppingCartCard
                    key={key}
                    type="door"
                    totalPrice={doorItem.price * doorItem.count} // 총 금액
                    title={getCategoryLabel(doorItem.door_type, DOOR_CATEGORY_LIST, "문짝")}
                    color={formatColor(doorItem.door_color)}
                    width={Number(doorItem.door_width)}
                    height={Number(doorItem.door_height)}
                    hingeCount={doorItem.hinge_count > 0 ? doorItem.hinge_count : undefined}
                    hingeDirection={formatBoringDirection(doorItem.hinge_direction)}
                    boring={boringArray}
                    location={doorItem.door_location ?? ""}
                    // boringCategory={doorItem.boringCategory}
                    quantity={doorItem.count}
                    trashable={true}
                    onIncrease={() => handleCountChange(category, i, doorItem.count + 1)}
                    onDecrease={() => handleCountChange(category, i, doorItem.count - 1)}
                    addOn_hinge={doorItem.addOn_hinge ?? undefined}
                  />
                );
              }

              if (category === "finish") {
                const finishItem = item as FinishItem;

                return (
                  <ShoppingCartCard
                    key={key}
                    type="finish"
                    totalPrice={finishItem.price * finishItem.count} // 총 금액
                    title={FINISH_CATEGORY_LIST.find(item => item.slug === finishItem.finish_category.toLowerCase())?.header ?? ""}
                    color={formatColor(finishItem.finish_color)}
                    edgeCount={finishItem.finish_edge_count ?? undefined}
                    depth={finishItem.finish_base_depth}
                    depthIncrease={finishItem.finish_additional_depth ?? undefined}
                    height={finishItem.finish_base_height}
                    heightIncrease={finishItem.finish_additional_height ?? undefined}
                    request={finishItem.finish_request ?? undefined}
                    location={finishItem.finish_location ?? ""}
                    quantity={finishItem.count}
                    showQuantitySelector={true}
                    {...commonProps}
                  />
                );
              }

              if (category === "cabinet") {
                const cabinetItem = item as CabinetItem;

                return (
                  <ShoppingCartCard
                    key={key}
                    type="cabinet"
                    totalPrice={cabinetItem.price * cabinetItem.count} // 총 금액
                    title={getCategoryLabel(
                      cabinetItem.cabinet_type,
                      CABINET_CATEGORY_LIST,
                      "부분장",
                    )}
                    color={formatColor(cabinetItem.cabinet_color ?? "")}
                    width={Number(cabinetItem.cabinet_width ?? 0)}
                    height={Number(cabinetItem.cabinet_height ?? 0)}
                    depth={Number(cabinetItem.cabinet_depth ?? 0)}
                    bodyMaterial={cabinetItem.body_type ?? ""}
                    handleType={cabinetItem.handle_type ?? ""}
                    finishType={cabinetItem.finish_type ?? ""}
                    showBar={cabinetItem.absorber_type ?? ""}
                    drawerType={cabinetItem.drawer_type ?? ""}
                    railType={cabinetItem.rail_type ?? ""}
                    request={cabinetItem.cabinet_request ?? ""}
                    location={cabinetItem.cabinet_location ?? ""}
                    quantity={cabinetItem.count ?? 0}
                    showQuantitySelector={true}
                    addOn_construction={cabinetItem.addOn_construction ?? undefined}
                    legType={cabinetItem.leg_type ?? undefined}
                    {...commonProps}
                  />
                );
              }

              if (category === "accessory") {
                const accessoryItem = item as AccessoryItem;

                return (
                  <ShoppingCartCard
                    key={key}
                    type="accessory"
                    title={getCategoryLabel(
                      accessoryItem.accessory_type,
                      ACCESSORY_CATEGORY_LIST,
                      "부속",
                    )}
                    manufacturer={accessoryItem.accessory_madeby}
                    modelName={accessoryItem.accessory_model}
                    quantity={accessoryItem.count}
                    request={accessoryItem.accessory_request ?? undefined}
                    showQuantitySelector={true}
                    {...commonProps}
                  />
                );
              }

              if (category === "hardware") {
                const hardwareItem = item as HardwareItem;
                return (
                  <ShoppingCartCard
                    key={key}
                    type="hardware"
                    title={getCategoryLabel(
                      hardwareItem.hardware_type,
                      HARDWARE_CATEGORY_LIST,
                      "하드웨어",
                    )}
                    manufacturer={hardwareItem.hardware_madeby}
                    size={hardwareItem.hardware_size ? `${hardwareItem.hardware_size}mm` : ""}
                    request={hardwareItem.hardware_request ?? ""}
                    quantity={hardwareItem.count}
                    showQuantitySelector={true}
                    {...commonProps}
                  />
                );
              }

              return null;
            })}
          </div>

          <BottomButton
            type="1button"
            button1Text="상품 추가"
            button1Type="BrandInverse"
            className="w-full pt-0"
            onButton1Click={handleAddProduct}
          />
        </div>
        <div className="px-5">
          <PriceSummaryCard getTotalPrice={getTotalPrice} categoryMap={CATEGORY_MAP} />
        </div>
      </div>
      <div className="h-[100px]"></div>
      <div id="cart-next-button" className="fixed bottom-0 w-full max-w-[460px]">
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
