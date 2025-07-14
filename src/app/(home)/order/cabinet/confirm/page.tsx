"use client";

import { CABINET_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import formatColor from "@/utils/formatColor";
import formatSize from "@/utils/formatSize";
import { CabinetCart, useSingleCartStore } from "@/store/singleCartStore";

function CabinetConfirmPageContent() {
  const router = useRouter();

  const setCart = useSingleCartStore(state => state.setCart);
  const type = useSingleCartStore(state => state.cart.type);
  const category = useSingleCartStore(state => (state.cart as CabinetCart).category);
  const bodyMaterial = useSingleCartStore(state => (state.cart as CabinetCart).bodyMaterial);
  const color = useSingleCartStore(state => (state.cart as CabinetCart).color);
  const width = useSingleCartStore(state => (state.cart as CabinetCart).width);
  const height = useSingleCartStore(state => (state.cart as CabinetCart).height);
  const depth = useSingleCartStore(state => (state.cart as CabinetCart).depth);
  const request = useSingleCartStore(state => (state.cart as CabinetCart).request);
  const handleType = useSingleCartStore(state => (state.cart as CabinetCart).handleType);
  const finishType = useSingleCartStore(state => (state.cart as CabinetCart).finishType);
  const showBar = useSingleCartStore(state => (state.cart as CabinetCart).showBar);
  const drawerType = useSingleCartStore(state => (state.cart as CabinetCart).drawerType);
  const railType = useSingleCartStore(state => (state.cart as CabinetCart).railType);
  const riceRail = useSingleCartStore(state => (state.cart as CabinetCart).riceRail);
  const lowerDrawer = useSingleCartStore(state => (state.cart as CabinetCart).lowerDrawer);


  const [quantity, setQuantity] = useState(1);
  return (
    <div>
      <TopNavigator />
      <Header size="Large" title={`${getCategoryLabel(category ?? null)} 주문 개수를 선택해주세요`} />
      <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
        <ShoppingCartCard
          type="cabinet"
          title={`${getCategoryLabel(category ?? null)}`}
          color={formatColor(color ?? null) ?? ""}
          bodyMaterial={bodyMaterial ?? ""}
          width={formatSize(width != null ? String(width) : null) ?? ""}
          height={formatSize(height != null ? String(height) : null) ?? ""}
          depth={formatSize(depth != null ? String(depth) : null) ?? ""}
          handleType={handleType ?? ""}
          finishType={finishType ?? ""}
          showBar={showBar ?? ""}
          drawerType={drawerType ?? ""}
          railType={railType ?? ""}
          riceRail={riceRail ?? ""}
          lowerDrawer={lowerDrawer ?? ""}
          showQuantitySelector={false}
          request={request ?? undefined}
          onOptionClick={() => {
            router.push(`/order/cabinet/?category=${category}&color=${color}`);
          }}
          quantity={0}
          trashable={false}
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

function CabinetConfirmPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <CabinetConfirmPageContent />
    </Suspense>
  );
}

export default CabinetConfirmPage;

function getCategoryLabel(category: string | null) {
  if (!category) return "부분장";
  const found = CABINET_CATEGORY_LIST.find(item => item.slug === category);
  return found ? found.header : "부분장";
}
