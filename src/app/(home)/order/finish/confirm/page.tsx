"use client";

import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import formatColor from "@/utils/formatColor";
import { FinishCart } from "@/store/singleCartStore";
import { useSingleCartStore } from "@/store/singleCartStore";

function ConfirmPageContent() {
  const router = useRouter();

  const color = useSingleCartStore(state => (state.cart as FinishCart).color);
  const depth = useSingleCartStore(state => (state.cart as FinishCart).depth);
  const height = useSingleCartStore(state => (state.cart as FinishCart).height);
  const depthIncrease = useSingleCartStore(state => (state.cart as FinishCart).depthIncrease);
  const heightIncrease = useSingleCartStore(state => (state.cart as FinishCart).heightIncrease);
  const request = useSingleCartStore(state => (state.cart as FinishCart).request);
  const [quantity, setQuantity] = useState(1);
  return (
    <div>
      <TopNavigator />
      <Header size="Large" title={`마감재 주문 개수를 선택해주세요`} />
      <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
        <ShoppingCartCard
          type="door"
          title={"마감재"}
          color={formatColor(color ?? "")}
          depth={depth ?? undefined}
          height={height ?? undefined}
          depthIncrease={depthIncrease ?? undefined}
          heightIncrease={heightIncrease ?? undefined}
          // 아래의 다른 컴포넌트로 전달할 예정이라 여기선 일단 0으로 전달
          quantity={0}
          trashable={false}
          showQuantitySelector={false}
          request={request ?? undefined}
          onOptionClick={() => {
            router.push(`/order/finish`);
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
        onButton1Click={() => { }}
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
