"use client";

import { addCartItem } from "@/api/cartItemApi";
import { ACCESSORY_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { AccessoryCart, useSingleCartStore } from "@/store/singleCartStore";

function ConfirmPageContent() {
  const router = useRouter();
  const category = useSingleCartStore(state => (state.cart as AccessoryCart).category);
  const accessory_madeby = useSingleCartStore(
    state => (state.cart as AccessoryCart).accessory_madeby,
  );
  const accessory_model = useSingleCartStore(
    state => (state.cart as AccessoryCart).accessory_model,
  );
  const request = useSingleCartStore(state => (state.cart as AccessoryCart).request);

  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <TopNavigator />
      <Header
        size="Large"
        title={`${ACCESSORY_CATEGORY_LIST.find(item => item.slug === category)?.header} 주문 개수를 선택해주세요`}
      />
      <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
        <ShoppingCartCard
          type="accessory"
          title={`${ACCESSORY_CATEGORY_LIST.find(item => item.slug === category)?.header}`}
          showQuantitySelector={false}
          request={request ?? undefined}
          manufacturer={accessory_madeby ?? undefined}
          modelName={accessory_model ?? undefined}
          onOptionClick={() => {
            router.push(`/order/accessory`);
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
        onButton1Click={async () => {
          try {
            const result = await addCartItem({
              product_type: "ACCESSORY",
              unit_price: 9000,
              item_count: quantity,
              item_options: {
                accessory_type: category,
                accessory_madeby: accessory_madeby,
                accessory_model: accessory_model,
                accessory_request: request,
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
