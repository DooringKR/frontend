"use client";

import { addCartItem } from "@/api/cartItemApi";
import { HARDWARE_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { HardwareCart, useSingleCartStore } from "@/store/singleCartStore";
import { usePageView } from "@/services/hooks/usePageView";
import { useButtonClick } from "@/services/hooks/useButtonClick";

function HardwareConfirmPageContent() {
  const router = useRouter();
  const category = useSingleCartStore(state => (state.cart as HardwareCart).category);
  const hardware_madeby = useSingleCartStore(state => (state.cart as HardwareCart).hardware_madeby);
  const hardware_size = useSingleCartStore(state => (state.cart as HardwareCart).hardware_size);
  const request = useSingleCartStore(state => (state.cart as HardwareCart).request);

  const [quantity, setQuantity] = useState(1);

  // PV/BC 이벤트 네이밍을 위한 헬퍼
  function capitalize(str: string | null | undefined) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const capitalizedType = "Hardware";
  const capitalizedCategorySlug = capitalize(category);
  usePageView(`${capitalizedType}${capitalizedCategorySlug}Confirm`);
  const handleAddToCartClick = useButtonClick(
    `${capitalizedType}${capitalizedCategorySlug}Confirm`,
    "toCart"
  );

  return (
    <div>
      <TopNavigator />
      <Header
        size="Large"
        title={`${HARDWARE_CATEGORY_LIST.find(item => item.slug === category)?.header} 주문 개수를 선택해주세요`}
      />
      <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
        <ShoppingCartCard
          type="hardware"
          title={`${HARDWARE_CATEGORY_LIST.find(item => item.slug === category)?.header}`}
          showQuantitySelector={false}
          request={request ?? undefined}
          manufacturer={hardware_madeby ?? undefined}
          size={hardware_size ? `${hardware_size}mm` : undefined}
          onOptionClick={() => {
            router.push(`/order/hardware`);
          }}
          quantity={0}
          trashable={false}
        />
        <OrderSummaryCard
          quantity={quantity}
          unitPrice={0}
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
            try {
              const result = await addCartItem({
                product_type: "HARDWARE",
                unit_price: 0,
                item_count: quantity,
                item_options: {
                  hardware_type: category,
                  hardware_madeby: hardware_madeby,
                  hardware_size: hardware_size,
                  hardware_request: request,
                },
              });
              console.log(result);
              handleAddToCartClick();
              router.replace("/cart");
            } catch (error) {
              console.error("장바구니 담기 실패:", error);
            }
          }}
        />
      </div>
    </div>
  );
}

function HardwareConfirmPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <HardwareConfirmPageContent />
    </Suspense>
  );
}

export default HardwareConfirmPage;
