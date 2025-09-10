"use client";

import { addCartItem } from "@/api/cartItemApi";
import { calculateUnitCabinetPrice } from "@/services/pricing/cabinetPricing";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { CabinetCart, useSingleCartStore } from "@/store/singleCartStore";
import { getCategoryLabel } from "@/utils/categoryLabel";
import formatColor from "@/utils/formatColor";

function CabinetConfirmPageContent() {
  const router = useRouter();

  const cart = useSingleCartStore(state => state.cart);
  const setCart = useSingleCartStore(state => state.setCart);
  const type = cart?.type;
  const category = (cart as CabinetCart)?.category;
  const bodyMaterial = (cart as CabinetCart)?.bodyMaterial;
  const color = (cart as CabinetCart)?.color;
  const width = (cart as CabinetCart)?.width;
  const height = (cart as CabinetCart)?.height;
  const depth = (cart as CabinetCart)?.depth;
  const request = (cart as CabinetCart)?.request;
  const handleType = (cart as CabinetCart)?.handleType;
  const finishType = (cart as CabinetCart)?.finishType;
  const showBar = (cart as CabinetCart)?.showBar;
  const drawerType = (cart as CabinetCart)?.drawerType;
  const railType = (cart as CabinetCart)?.railType;
  const riceRail = (cart as CabinetCart)?.riceRail;
  const lowerDrawer = (cart as CabinetCart)?.lowerDrawer;
  const cabinet_location = (cart as CabinetCart)?.cabinet_location;
  const addOn_construction = (cart as CabinetCart)?.addOn_construction;
  const legType = (cart as CabinetCart)?.legType;
  const [quantity, setQuantity] = useState(1);

  // 빌드 시점에 cart가 비어있을 수 있으므로 안전한 처리
  if (!cart || Object.keys(cart).length === 0) {
    return <div>로딩 중...</div>;
  }


  const unitPrice = calculateUnitCabinetPrice(category!, color!, width!, bodyMaterial!, handleType!, depth!);


  return (
    <div>
      <TopNavigator />
      <Header
        size="Large"
        title={`${getCategoryLabel(category ?? null)} 주문 개수를 선택해주세요`}
      />
      <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
        <ShoppingCartCard
          type="cabinet"
          title={`${getCategoryLabel(category ?? null)}`}
          totalPrice={unitPrice * quantity}
          color={formatColor(color ?? null) ?? ""}
          bodyMaterial={bodyMaterial ?? ""}
          width={width ?? undefined}
          height={height ?? undefined}
          depth={depth ?? undefined}
          handleType={handleType ?? ""}
          finishType={finishType ?? ""}
          showBar={showBar ?? ""}
          drawerType={drawerType ?? ""}
          railType={railType ?? ""}
          riceRail={riceRail ?? ""}
          lowerDrawer={lowerDrawer ?? ""}
          showQuantitySelector={false}
          request={request ?? undefined}
          location={cabinet_location ?? ""}
          addOn_construction={addOn_construction ?? undefined}
          legType={legType ?? undefined}
          onOptionClick={() => {
            router.push(`/order/cabinet/?category=${category}&color=${color}`);
          }}
          quantity={0}
          trashable={false}
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
              product_type: "CABINET",
              unit_price: unitPrice,
              item_count: quantity,
              item_options: {
                cabinet_type: category!.toUpperCase(),
                cabinet_color: color,
                cabinet_width: width,
                cabinet_height: height,
                cabinet_depth: depth,
                cabinet_request: request,
                body_type:
                  bodyMaterial === "헤링본 PP 15T"
                    ? "HERRINGBONE_PP_15T"
                    : bodyMaterial === "헤링본 PP 18T"
                      ? "HERRINGBONE_PP_18T"
                      : bodyMaterial === "파타고니아 크림 LPM 18T"
                        ? "PATAGONIA_CREAM_LPM_18T"
                        : "DIRECT_INPUT",
                ...(bodyMaterial !== "헤링본 PP 15T" &&
                  bodyMaterial !== "헤링본 PP 18T" &&
                  bodyMaterial !== "파타고니아 크림 LPM 18T"
                  ? { body_type_direct_input: bodyMaterial }
                  : {}),
                ...(category === "upper" || category === "lower" || category === "flap" || category === "drawer"
                  ? {
                    handle_type:
                      handleType === "찬넬"
                        ? "CHANNEL"
                        : handleType === "겉손잡이"
                          ? "OUTER"
                          : handleType === "내리기"
                            ? "PULL_DOWN"
                            : "PUSH",
                  }
                  : {}),
                finish_type: finishType === "막우라" ? "MAK_URA" : "URAHOME",
                // showBar 값: ‘NONE’, ‘MOONJU_AVENTOS’, ‘BLUM_AVENTOS’, ‘GAS’, ‘FOLDABLE’, ‘DIRECT_INPUT’)
                ...(category === "flap"
                  ? {
                    absorber_type:
                      showBar === "쇼바 없음"
                        ? "NONE"
                        : showBar === "문주 아벤토스 쇼바"
                          ? "MOONJU_AVENTOS"
                          : showBar === "블룸 아벤토스 쇼바"
                            ? "BLUM_AVENTOS"
                            : showBar === "가스 쇼바"
                              ? "GAS"
                              : showBar === "접이식 쇼바"
                                ? "FOLDABLE"
                                : "DIRECT_INPUT",
                    ...(showBar !== "쇼바 없음" &&
                      showBar !== "문주 아벤토스 쇼바" &&
                      showBar !== "블룸 아벤토스 쇼바" &&
                      showBar !== "가스 쇼바" &&
                      showBar !== "접이식 쇼바"
                      ? { absorber_type_direct_input: showBar }
                      : {}),
                  }
                  : {}),
                ...(category === "drawer"
                  ? {
                    drawer_type: drawerType,
                    rail_type: railType,
                  }
                  : {}),
                ...(category === "open"
                  ? { add_rice_cooker_rail: riceRail === "추가" ? true : false }
                  : {}),
                ...(category === "open"
                  ? { add_bottom_drawer: lowerDrawer === "추가" ? true : false }
                  : {}),
                cabinet_location: cabinet_location,
                addOn_construction: addOn_construction,
                leg_type: legType,
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

function CabinetConfirmPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <CabinetConfirmPageContent />
    </Suspense>
  );
}

export default CabinetConfirmPage;
