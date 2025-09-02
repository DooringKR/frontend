"use client";

import { addCartItem } from "@/api/cartItemApi";
import { calculateUnitFinishPrice } from "@/services/pricing/finishPricing";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { FinishCart } from "@/store/singleCartStore";
import { useSingleCartStore } from "@/store/singleCartStore";
import formatColor from "@/utils/formatColor";
import { FINISH_CATEGORY_LIST } from "@/constants/category";

function ConfirmPageContent() {
  const router = useRouter();

  const cart = useSingleCartStore(state => state.cart);
  const color = (cart as FinishCart)?.color;
  const category = (cart as FinishCart)?.category;
  const edgeCount = (cart as FinishCart)?.edge_count;
  const depth = (cart as FinishCart)?.depth;
  const height = (cart as FinishCart)?.height;
  const depthIncrease = (cart as FinishCart)?.depthIncrease;
  const heightIncrease = (cart as FinishCart)?.heightIncrease;
  const request = (cart as FinishCart)?.request;
  const finish_location = (cart as FinishCart)?.finish_location;
  const [quantity, setQuantity] = useState(1);

  // 빌드 시점에 cart가 비어있을 수 있으므로 안전한 처리
  if (!cart || Object.keys(cart).length === 0) {
    return <div>로딩 중...</div>;
  }

  const unitPrice = calculateUnitFinishPrice(
    color!,
    depth!,
    depthIncrease ?? 0,
    height!,
    heightIncrease ?? 0,
  );

  return (
    <div className="flex flex-col">
      <TopNavigator />
      <Header size="Large" title={`마감재 주문 개수를 선택해주세요`} />
      <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
        <ShoppingCartCard
          type="finish"
          title={FINISH_CATEGORY_LIST.find(item => item.slug === category)?.header ?? ""}
          color={formatColor(color ?? "")}
          edgeCount={edgeCount ? Number(edgeCount) : undefined}
          depth={depth ? Number(depth) : undefined}
          height={height ? Number(height) : undefined}
          depthIncrease={depthIncrease ? Number(depthIncrease) : undefined}
          heightIncrease={heightIncrease ? Number(heightIncrease) : undefined}
          // 아래의 OrderSummaryCard 컴포넌트로 전달함. 여기선 0으로 전달
          location={finish_location ?? undefined}
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
          unitPrice={unitPrice}
          onIncrease={() => {
            setQuantity(q => q + 1);
          }}
          onDecrease={() => {
            setQuantity(q => Math.max(1, q - 1));
          }}
        />
      </div>
      <BottomButton
        type={"1button"}
        button1Text={"장바구니 담기"}
        className="fixed bottom-0 w-full max-w-[460px]"
        onButton1Click={async () => {
          try {
            const result = await addCartItem({
              product_type: "FINISH",
              unit_price: unitPrice,
              item_count: quantity,
              item_options: {
                finish_color: color,
                finish_category: category?.toUpperCase(),
                finish_edge_count: edgeCount,
                finish_base_depth: depth,
                finish_additional_depth: depthIncrease,
                finish_base_height: height,
                finish_additional_height: heightIncrease,
                finish_request: request,
                finish_location: finish_location,
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

function ConfirmPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ConfirmPageContent />
    </Suspense>
  );
}

export default ConfirmPage;
