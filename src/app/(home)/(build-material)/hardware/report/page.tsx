"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCardNew from "@/components/Card/ShoppingCartCardNew";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { transformHardwareToNewCardProps } from "@/utils/transformers/transformHardwareToNewCardProps";

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
import { trackClick, trackView, trackAddToCart } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";
import PaymentNoticeCard from "@/components/PaymentNoticeCard";
import useCartItemStore from "@/store/cartItemStore";
import { sortProductTypes, sortDetailProductTypes } from "@/utils/formatCartProductTypes";
import {
  getProductTypesFromCartItems,
  getDetailProductTypesFromCartItems,
  getTotalQuantityFromCartItems,
  getTotalValueFromCartItems
} from "@/utils/getCartProductTypes";

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
  const cartItems = useCartItemStore((state) => state.cartItems);

  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="flex flex-col pt-[90px]">
      <InitAmplitude />
      <TopNavigator />
      <ProgressBar progress={100} />
      <Header
        size="Large"
        title={(() => {
          const slug = item?.type?.slug;
          return `${item.type} 주문 개수를 선택해주세요`;
        })()}
      />
      <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">

        <ShoppingCartCardNew {...transformHardwareToNewCardProps(item)} />

        <OrderSummaryCard
          quantity={quantity}
          unitPrice={unitPrice}
          onIncrease={() => setQuantity(q => q + 1)}
          onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
        />
        <PaymentNoticeCard />
      </div>
      <div id="hardware-add-to-cart-button">
        <BottomButton
          type={"1button"}
          button1Text={isLoading ? "처리 중..." : "장바구니 담기"}
          className="fixed bottom-0 w-full max-w-[460px]"
          button1Disabled={isLoading}
          onButton1Click={async () => {
            // 이미 로딩 중이면 중복 클릭 방지
            if (isLoading) return;

            setIsLoading(true);
            trackClick({
              object_type: "button",
              object_name: "add_to_cart",
              current_page: getScreenName(),
              modal_name: null,
            });
            console.log(item!);
            try {
              // 하드웨어 객체 생성
              const hardware = createHardwareInstance(item);

              // 테이블명 명시적 매핑 (constructor.name은 배포환경에서 변경될 수 있음)
              const tableName = (() => {
                switch (item.type) {
                  case HardwareType.HINGE:
                    return "Hinge";
                  case HardwareType.RAIL:
                    return "Rail";
                  case HardwareType.PIECE:
                    return "Piece";
                  default:
                    throw new Error("Unknown hardware type for table mapping");
                }
              })();

              // Supabase에 저장
              const createdHardware = await new CrudInteriorMaterialsUsecase(
                new InteriorMaterialsSupabaseRepository<typeof hardware>(tableName)
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

              // Add to Cart 이벤트 전송 (CartItem 생성 성공 후)
              const cartQuantityTotalBefore = getTotalQuantityFromCartItems(cartItems);
              const cartQuantityTypeBefore = cartItems.length;
              const cartValueBefore = getTotalValueFromCartItems(cartItems);

              // 추가 후 상태 계산 (새 아이템 포함)
              const productTypesAfter = getProductTypesFromCartItems(cartItems, detailProductType);
              const detailProductTypesAfter = await getDetailProductTypesFromCartItems(cartItems, detailProductType, item);

              await trackAddToCart({
                product_type: sortProductTypes(productTypesAfter),
                detail_product_type: sortDetailProductTypes(detailProductTypesAfter),
                quantity: quantity,
                price_unit: unitPrice,
                cart_quantity_total_before: cartQuantityTotalBefore,
                cart_quantity_type_before: cartQuantityTypeBefore,
                cart_value_before: cartValueBefore,
              });

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
              setIsLoading(false);
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
