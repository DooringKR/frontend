"use client";

import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { HardwareType, RailType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { Hinge } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Hinge";
import { Rail } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Rail";
import { Piece } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Piece";
import useItemStore from "@/store/Items/itemStore";
import useCartStore from "@/store/cartStore";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";

function createHardwareInstance(item: any) {
  switch (item.type) {
    case HardwareType.HINGE:
      // Hinge 네임드 파라미터(객체 리터럴) 생성 방식
      return new Hinge({
        hardware_request: item.request,
        hinge_madeby: item.madeby,
        hinge_thickness: item.thickness,
        hinge_angle: item.angle,
        hinge_madeby_direct_input: item.madeby === "직접 입력" ? item.madebyInput : undefined,
        hinge_thickness_direct_input: item.thickness === "직접 입력" ? item.thicknessInput : undefined,
        hinge_angle_direct_input: item.angle === "직접 입력" ? item.angleInput : undefined,
      });
    case HardwareType.RAIL:
      // Rail 네임드 파라미터(객체 리터럴) 생성 방식
      return new Rail({
        hardware_request: item.request,
        rail_madeby: item.madeby,
        rail_type: item.railType,
        rail_length: item.railLength,
        rail_damping: item.railDamping,
      });
    case HardwareType.PIECE:
      // Piece 네임드 파라미터(객체 리터럴) 생성 방식
      return new Piece({
        hardware_request: item.request,
        piece_color: item.color,
        piece_size: item.size,
      });
    default:
      throw new Error("Unknown hardware type");
  }
}

function ReportPageContent() {
  const router = useRouter();
  const { item } = useItemStore();
  const { cart, setCartItems, cartItems } = useCartStore();
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
          railDamping={item?.railType === RailType.BALL ? item?.railDamping ?? "" : undefined}
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
            console.log(item!);
            try {
              // 하드웨어 객체 생성
              const hardware = createHardwareInstance(item);

              // Supabase에 저장
              const createdHardware = await new CrudInteriorMaterialsUsecase(
                new InteriorMaterialsSupabaseRepository<typeof hardware>(hardware.constructor.name)
              ).create(hardware);

              // cart, cartItems, setCartItems는 useCartStore에서 가져옴
              if (!cart) throw new Error("장바구니 정보가 없습니다.");

              // CartItem 생성
              // id 접근: protected라면 createdHardware["id"]로 접근
              // detail_product_type은 HINGE, RAIL, PIECE 중 하나여야 함
              let detailProductType;
              switch (item.type) {
                case HardwareType.HINGE:
                  detailProductType = DetailProductType.HINGE;
                  break;
                case HardwareType.RAIL:
                  detailProductType = DetailProductType.RAIL;
                  break;
                case HardwareType.PIECE:
                  detailProductType = DetailProductType.PIECE;
                  break;
                default:
                  throw new Error("Unknown hardware type for cart item");
              }
              const cartItem = new CartItem({
                cart_id: cart!.id!,
                item_detail: createdHardware["id"]!,
                detail_product_type: detailProductType,
                item_count: quantity,
                unit_price: unitPrice,
              });
              const createdCartItem = await new CrudCartItemUsecase(
                new CartItemSupabaseRepository()
              ).create(cartItem);

              // cart_count 증가
              const cartCountResponse = await new CrudCartUsecase(
                new CartSupabaseRepository()
              ).incrementCartCount(cart.id!, quantity);

              // 전역변수에 추가
              setCartItems([...cartItems, createdCartItem]);

              // 장바구니 페이지로 이동
              useItemStore.setState({ item: undefined });
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

function ReportPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ReportPageContent />
    </Suspense>
  );
}

export default ReportPage;
