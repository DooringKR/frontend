"use client";

import { COLOR_LIST } from "@/constants/colorList";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import formatColor from "@/utils/formatColor";
import formatSize from "@/utils/formatSize";

function isPredefinedColor(color: string | null) {
  if (!color) return false;
  return COLOR_LIST.some(item => item.name === color);
}

function ConfirmPageContent() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const color = searchParams.get("color");
  const depth = searchParams.get("depth");
  const height = searchParams.get("height");
  const depthIncrease = searchParams.get("depthIncrease");
  const heightIncrease = searchParams.get("heightIncrease");
  const request = searchParams.get("request");
  const isPredefined = isPredefinedColor(color);
  const [quantity, setQuantity] = useState(1);
  return (
    <div>
      <TopNavigator />
      <Header size="Large" title={`마감재 주문 개수를 선택해주세요`} />
      <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
        <ShoppingCartCard
          type="door"
          title={"마감재"}
          color={formatColor(color)}
          depth={depth ? formatSize(String(Number(depth) + Number(depthIncrease ?? 0))) : ""}
          height={height ? formatSize(String(Number(height) + Number(heightIncrease ?? 0))) : ""}
          depthIncrease={depthIncrease ? formatSize(depthIncrease) : undefined}
          heightIncrease={heightIncrease ? formatSize(heightIncrease) : undefined}
          // 아래의 다른 컴포넌트로 전달할 예정이라 여기선 일단 0으로 전달
          quantity={0}
          trashable={false}
          showQuantitySelector={false}
          request={request ?? undefined}
          onOptionClick={() => {
            router.push(`/order/finish/?color=${color}`);
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
        onButton1Click={() => {}}
      />
    </div>
  );
}

function ConfirmPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ConfirmPageContent />
    </Suspense>
  );
}

export default ConfirmPage;
