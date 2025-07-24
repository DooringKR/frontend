"use client";

import { addCartItem } from "@/api/cartItemApi";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { DoorCart, useSingleCartStore } from "@/store/singleCartStore";
import formatColor from "@/utils/formatColor";
import formatSize from "@/utils/formatSize";

function getCategoryLabel(category: string | null) {
  if (category === "normal") return "일반문";
  if (category === "flap") return "플랩문";
  if (category === "drawer") return "서랍";
  return "문짝";
}

function formatBoring(boringSize: (number | null)[], category?: string | null) {
  if (!boringSize || !Array.isArray(boringSize)) return "";

  const arr = boringSize;

  // category에 따라 다른 라벨 사용
  let labelMap: string[][];
  if (category === "flap") {
    labelMap = [
      ["좌", "우"],
      ["좌", "중", "우"],
      ["좌", "중좌", "중우", "우"],
    ];
  } else {
    labelMap = [
      ["상", "하"],
      ["상", "중", "하"],
      ["상", "중상", "중하", "하"],
    ];
  }

  const label = labelMap[arr.length - 2];
  if (!label) return arr.join(", ");
  return arr
    .map((v, i) => (v !== null && v !== undefined ? `${label[i]}${v}` : null))
    .filter(Boolean)
    .join(", ");
}

function formatBoringDirection(dir: string | null) {
  if (dir === "left") return "좌경";
  if (dir === "right") return "우경";
  return dir ?? "";
}

function DoorConfirmPageContent() {
  const router = useRouter();

  const category = useSingleCartStore(state => (state.cart as DoorCart).category);
  const color = useSingleCartStore(state => (state.cart as DoorCart).color);
  const width = useSingleCartStore(state => (state.cart as DoorCart).width);
  const height = useSingleCartStore(state => (state.cart as DoorCart).height);
  const boringDirection = useSingleCartStore(state => (state.cart as DoorCart).boringDirection);
  const boringSize = useSingleCartStore(state => (state.cart as DoorCart).boringSize);
  const request = useSingleCartStore(state => (state.cart as DoorCart).request);
  const [quantity, setQuantity] = useState(1);
  return (
    <div>
      <TopNavigator />
      <Header
        size="Large"
        title={`${getCategoryLabel(category ?? null)} 주문 개수를 선택해주세요`}
      />
      <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
        <ShoppingCartCard
          type="door"
          title={getCategoryLabel(category ?? null)}
          color={formatColor(color ?? null)}
          width={formatSize(width?.toString() ?? null)}
          height={formatSize(height?.toString() ?? null)}
          hingeDirection={formatBoringDirection(boringDirection ?? null)}
          hingeCount={boringSize ? boringSize.length : undefined}
          boring={formatBoring(boringSize || [], category)}
          // 아래의 다른 컴포넌트로 전달할 예정이라 여기선 일단 0으로 전달
          quantity={0}
          trashable={false}
          showQuantitySelector={false}
          request={request ?? undefined}
          onOptionClick={() => {
            router.push(`/order/door`);
          }}
        />
        <OrderSummaryCard
          quantity={quantity}
          unitPrice={9000}
          onIncrease={() => setQuantity(q => q + 1)}
          onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
        />
      </div>
      <BottomButton
        type={"1button"}
        button1Text={"장바구니 담기"}
        className="fixed bottom-0 w-full max-w-[500px] bg-white px-5 pb-5"
        onButton1Click={async () => {
          try {
            const result = await addCartItem({
              product_type: "DOOR",
              unit_price: 9000,
              item_count: quantity,
              item_options: {
                door_type:
                  category === "normal" ? "STANDARD" : category === "flap" ? "FLAP" : "DRAWER",
                door_color: color,
                door_width: width,
                door_height: height,
                ...(category === "normal" || category === "flap"
                  ? {
                      hinge_count: boringSize!.length,
                      hinge_direction: boringDirection,
                      first_hinge_size: boringSize![0] ?? undefined,
                      second_hinge_size: boringSize![1] ?? undefined,
                      third_hinge_size: boringSize![2] ?? undefined,
                      fourth_hinge_size: boringSize![3] ?? undefined,
                    }
                  : {}),
                door_request: request,
              },
            });
            console.log(result);
            router.replace("/cart");
          } catch (error) {
            console.error("장바구니 담기 실패:", error);
          }
        }}
      />
    </div>
  );
}

function DoorConfirmPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <DoorConfirmPageContent />
    </Suspense>
  );
}

export default DoorConfirmPage;
