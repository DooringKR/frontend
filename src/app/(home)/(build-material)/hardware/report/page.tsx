"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { HardwareType, RailType, RailLength } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { HardwareMadeBy, HingeThickness, HingeAngle } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import { Hinge } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Hinge";
import { Rail } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Rail";
import { Piece } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Piece";
import useItemStore from "@/store/itemStore";
import useCartStore from "@/store/cartStore";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function createHardwareInstance(item: any) {
  switch (item.type) {
    case HardwareType.HINGE:
      // enum의 DIRECT_INPUT일 때는 enum 필드는 DIRECT_INPUT, *_direct_input만 값 전달
      const isMadebyDirect = item.madeby === HardwareMadeBy.DIRECT_INPUT;
      const isThicknessDirect = item.thickness === HingeThickness.DIRECT_INPUT;
      const isAngleDirect = item.angle === HingeAngle.DIRECT_INPUT;
      // 방어: "직접 입력" 같은 잘못된 값이 enum에 들어가지 않도록
      // finish 방식처럼: 직접입력이면 enum은 undefined, *_direct_input만 값 전달
      const isEmptyOrPlaceholder = (val: string | undefined) => !val || val === "직접 입력";
      return new Hinge({
        hardware_request: item.request,
        hinge_madeby: (Object.values(HardwareMadeBy).includes(item.madeby) ? item.madeby : undefined),
        hinge_thickness: (Object.values(HingeThickness).includes(item.thickness) ? item.thickness : undefined),
        hinge_angle: (Object.values(HingeAngle).includes(item.angle) ? item.angle : undefined),
        hinge_madeby_direct_input: isMadebyDirect && !isEmptyOrPlaceholder(item.madebyInput) ? item.madebyInput : undefined,
        hinge_thickness_direct_input: isThicknessDirect && !isEmptyOrPlaceholder(item.thicknessInput) ? item.thicknessInput : undefined,
        hinge_angle_direct_input: isAngleDirect && !isEmptyOrPlaceholder(item.angleInput) ? item.angleInput : undefined,
      });
    case HardwareType.RAIL: {
      // enum의 DIRECT_INPUT일 때는 enum 필드는 undefined, *_direct_input만 값 전달
      const isMadebyDirect = item.madeby === HardwareMadeBy.DIRECT_INPUT;
      const isTypeDirect = item.railType === RailType.DIRECT_INPUT;
      const isLengthDirect = item.railLength === RailLength.DIRECT_INPUT;
      const isEmptyOrPlaceholder = (val: string | undefined) => !val || val === "직접 입력";
      return new Rail({
        hardware_request: item.request,
        rail_madeby: (Object.values(HardwareMadeBy).includes(item.madeby) ? item.madeby : undefined),
        rail_type: (Object.values(RailType).includes(item.railType) ? item.railType : undefined),
        rail_length: (Object.values(RailLength).includes(item.railLength) ? item.railLength : undefined),
        rail_damping: item.railDamping,
        rail_madeby_direct_input: isMadebyDirect && !isEmptyOrPlaceholder(item.madebyInput) ? item.madebyInput : undefined,
        rail_type_direct_input: isTypeDirect && !isEmptyOrPlaceholder(item.railTypeInput) ? item.railTypeInput : undefined,
        rail_length_direct_input: isLengthDirect && !isEmptyOrPlaceholder(item.railLengthInput) ? item.railLengthInput : undefined,
      });
    }
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
  const { cart, incrementCartCount } = useCartStore();

  const [quantity, setQuantity] = useState(1);

  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
    // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
    setScreenName('hardware_report');
    const prev = getPreviousScreenName();
    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
      previous_screen: prev,
    });
  }, []);

  // 빌드 시점에 cart가 비어있을 수 있으므로 안전한 처리
  if (!item || Object.keys(item).length === 0) {
    return <div>로딩 중...</div>;
  }

  // TODO: 단가 계산 함수 필요시 추가
  const unitPrice = 0; // 하드웨어 단가 계산 함수로 대체

  return (
    <div className="flex flex-col">
      <InitAmplitude />
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
          manufacturer={(() => {
            if (item?.madeby === HardwareMadeBy.DIRECT_INPUT) return "(직접입력) " + (item?.madebyInput || "");
            return item?.madeby ?? "";
          })()}
          thickness={(() => {
            if (item?.thickness === HingeThickness.DIRECT_INPUT) return "(직접입력) " + (item?.thicknessInput || "");
            return item?.thickness ?? "";
          })()}
          angle={(() => {
            if (item?.angle === HingeAngle.DIRECT_INPUT) return "(직접입력) " + (item?.angleInput || "");
            return item?.angle ?? "";
          })()}
          railType={item?.railType === RailType.DIRECT_INPUT ? "(직접입력) " + (item?.railTypeInput || "") : item?.railType ?? ""}
          railLength={item?.railLength === RailLength.DIRECT_INPUT ? "(직접입력) " + (item?.railLengthInput || "") : item?.railLength ?? ""}
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
            trackClick({
                object_type: "button",
                object_name: "confirm",
                current_page: getScreenName(),
                modal_name: null,
            });
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

              // TODO: 전역변수에 추가
              incrementCartCount(1);

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
