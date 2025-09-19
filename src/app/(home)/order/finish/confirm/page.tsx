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
import { FINISH_COLOR_LIST } from "@/constants/colorList";
import { Finish } from "dooring-core-domain/dist/models/InteriorMaterials/Finish";
import { FinishType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { FinishEdgeCount, Location } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import useCartStore from "@/store/cartStore";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";

function ConfirmPageContent() {
  const router = useRouter();

  const singleCart = useSingleCartStore(state => state.cart);
  const cart = useCartStore(state => state.cart);
  const color = (singleCart as FinishCart)?.color;
  const category = (singleCart as FinishCart)?.category;
  const edgeCount = (singleCart as FinishCart)?.edge_count;
  const depth = (singleCart as FinishCart)?.depth;
  const height = (singleCart as FinishCart)?.height;
  const depthIncrease = (singleCart as FinishCart)?.depthIncrease;
  const heightIncrease = (singleCart as FinishCart)?.heightIncrease;
  const request = (singleCart as FinishCart)?.request;
  const finish_location = (singleCart as FinishCart)?.finish_location;
  const [quantity, setQuantity] = useState(1);

  // color 문자열을 color.id로 변환하는 함수
  const getColorId = (colorName: string) => {
    const colorItem = FINISH_COLOR_LIST.find(item => item.name === colorName);
    return colorItem?.id;
  };

  // 빌드 시점에 cart가 비어있을 수 있으므로 안전한 처리
  if (!singleCart || Object.keys(singleCart).length === 0) {
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
          edgeCount={edgeCount ?? undefined}
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
      <div id="finish-add-to-cart-button">
        <BottomButton
          type={"1button"}
          button1Text={"장바구니 담기"}
          className="fixed bottom-0 w-full max-w-[460px]"
          onButton1Click={async () => {
            console.log(
              cart!
            );
            try {
              // color 문자열을 id로 변환
              const colorId = getColorId(color ?? "");
              // dooring-core-domain의 Finish 클래스를 사용하여 finish 객체 생성
              const finish = new Finish({
                //TODO: category에 맞는 FinishType 사용
                finish_type: FinishType.EP,
                finish_color: colorId, // color.id로 변경 (없으면 undefined)
                finish_edge_count: edgeCount!,
                finish_base_depth: depth!,
                finish_base_height: height!,
                finish_additional_depth: depthIncrease ?? undefined,
                finish_additional_height: heightIncrease ?? undefined,
                finish_location: finish_location ?? undefined,
                finish_color_direct_input: colorId ? undefined : color!, // colorId가 없으면 원본 색상 문자열 사용
                finish_request: request ?? undefined,
              });

              // Finish 객체를 Supabase에 저장
              const createdFinish = await new CrudInteriorMaterialsUsecase(
                new InteriorMaterialsSupabaseRepository<Finish>("Finish")
              ).create(finish);

              // cartitem 생성
              console.log(createdFinish);

              console.log(
                cart!.getId()
              );

              // const cartItem = new CartItem({
              //   id: undefined, // id
              //   created_at: new Date(), // created_at
              //   cart_id: cart!.getId(), // 
              //   item_detail: createdFinish["id"], // interior_material_id (Finish 객체의 id 프로퍼티가 private이므로, 인덱싱으로 접근)
              //   detail_product_type: DetailProductType.FINISH, // quantity
              //   item_count: quantity, // quantity
              //   unit_price: unitPrice, // unit_price (필요하다면 값 할당)
              //   last_updated_at: undefined  // last_updated_at (필요하다면 값 할당)
              // });
              // const createdCartItem = await new CrudCartItemUsecase(
              //   new CartItemSupabaseRepository()
              // ).create(cartItem);

              // console.log(createdCartItem);

              // cart_count 증가 (전체 카트 객체 전달 없이)
              // const cartCountResponse = await new CrudCartUsecase(
              //   new CartSupabaseRepository()
              // ).incrementCartCount(cart!.getId(), quantity);

              // console.log(cartCountResponse);

              // TODO: 전역변수에 추가
              // cart!.increaseCount(quantity);

              // 장바구니 페이지로 이동
              router.replace("/cart");
            } catch (error: any) {
              console.error("장바구니 담기 실패:", error);
            }
          }}
        />
      </div>
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
