"use client";

import { HardwareMadeBy, HingeThickness, HingeAngle } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";

import { Suspense, useState } from "react";
import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import useItemStore from "@/store/Items/itemStore";

function ReportPageContent() {
  const router = useRouter();
  const { item } = useItemStore();
  const [quantity, setQuantity] = useState(1);

  // 빌드 시점에 cart가 비어있을 수 있으므로 안전한 처리
  if (!item || Object.keys(item).length === 0) {
    return <div>로딩 중...</div>;
  }

  // TODO: 단가 계산 함수 필요시 추가
  const unitPrice = 0; // 하드웨어 단가 계산 함수로 대체

  return (
    <div className="flex flex-col">
      <TopNavigator />
      <Header
        size="Large"
        title={(() => {
          const slug = item?.type?.slug;
          return `${item.type} 주문 개수를 선택해주세요`;
        })()}
      />
      <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
        <ShoppingCartCard
          type="hardware"
          title={item?.type ?? ""}
          manufacturer={item?.madeby ?? ""}
          thickness={item?.thickness ?? ""}
          angle={item?.angle ?? ""}
          railType={item?.railType ?? ""}
          railLength={item?.railLength ?? ""}
          color={item?.color ?? ""}
          size={item?.size ?? ""}
          request={item?.request ?? undefined}
          quantity={0}
          trashable={false}
          showQuantitySelector={false}
          onOptionClick={() => {
            router.push(`/hardware/${item?.type ?? "hinge"}`);
          }}
        />
        <OrderSummaryCard
          quantity={quantity}
          unitPrice={unitPrice}
          onIncrease={() => setQuantity(q => q + 1)}
          onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
        />
      </div>
      <div id="hardware-add-to-cart-button">
        <BottomButton
          type={"1button"}
          button1Text={"장바구니 담기"}
          className="fixed bottom-0 w-full max-w-[460px]"
          onButton1Click={async () => {
            // TODO: 하드웨어 객체 생성 및 저장 로직 구현
            // 예시: Supabase 저장, CartItem 생성 등
            useItemStore.setState({ item: undefined });
            router.replace("/cart");
          }}
        />
      </div>
    </div>
  );
}

function ReportPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ReportPageContent />
    </Suspense>
  );
}

export default ReportPage;
