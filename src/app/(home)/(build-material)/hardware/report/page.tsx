"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BottomBar from "@/components/overlay/BottomBar";
import { EmptyState, Loading } from "@/components/state/StateViews";
import { Button } from "@/components/ui/button";
import { ActionError, useAction } from "@/components/ui/use-action";
import { goAfterSubmit } from "@/lib/nav/go";
import { setAfterLogin } from "@/utils/afterLogin";
import { toast } from "sonner";
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
import useBizClientStore from "@/store/bizClientStore";
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

export default function ReportPage() {
  const router = useRouter();
  const { item } = useItemStore();
  const bizClient = useBizClientStore(state => state.bizClient);
  const { cart, incrementCartCount } = useCartStore();
  const cartItems = useCartItemStore((state) => state.cartItems);

  const [quantity, setQuantity] = useState(1);
  // 담으면 장바구니로 넘어가는 동안 계속 막아 둔다(두 번 담기 방지)
  const add = useAction({ holdOnSuccess: true });
  // 서버 미리 그리기 때는 저장된 item 이 아직 없다 — 그린 뒤에 「없음」을 가린다
  const [mounted, setMounted] = useState(false);

  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
    setMounted(true);
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

  if (!item || Object.keys(item).length === 0) {
    // 담기에 성공해 item 을 비운 뒤 넘어가는 동안에도 Loading
    if (!mounted || add.busy) return <Loading />;
    return <EmptyState text="담을 하드웨어가 없어요" action={{ label: "하드웨어 고르기", onClick: () => router.replace("/hardware") }} />;
  }

  // TODO: 단가 계산 함수 필요시 추가
  const unitPrice = 0; // 하드웨어 단가 계산 함수로 대체

  const addToCart = () =>
    add.run(async () => {
      if (!bizClient) {
        trackClick({
          object_type: "button",
          object_name: "login_from_hardware_report",
          current_page: getScreenName(),
          modal_name: null,
        });
        // 로그인 뒤 이 화면으로 돌아온다(item 은 저장돼 있다)
        setAfterLogin("/hardware/report");
        router.push("/start");
        return;
      }
      trackClick({
        object_type: "button",
        object_name: "add_to_cart",
        current_page: getScreenName(),
        modal_name: null,
      });
      if (!cart?.id) throw new Error("장바구니 정보를 불러오지 못했어요. 새로고침 뒤 다시 눌러 주세요");
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

        const maxNickName = cartItems.reduce((max, item) => {
          const num = parseInt(item.nick_name || "0");
          return num > max ? num : max;
        }, 0);
        const cartItem = new CartItem({
          cart_id: cart.id,
          item_detail: createdHardware["id"]!,
          detail_product_type: detailProductType,
          item_count: quantity,
          unit_price: unitPrice,
          nick_name: (maxNickName + 1).toString(),
        });
        await new CrudCartItemUsecase(new CartItemSupabaseRepository()).create(cartItem);

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

        // cart_count 증가 — 담은 줄 하나당 1(마감재·부속·화면 쪽 incrementCartCount 와 같게. 예전엔 여기만 수량만큼 올렸다)
        await new CrudCartUsecase(new CartSupabaseRepository()).incrementCartCount(cart.id, 1);
        incrementCartCount(1);
      } catch (error) {
        console.error("장바구니 담기 실패:", error);
        throw new Error("장바구니에 담지 못했어요. 다시 눌러 주세요");
      }
      toast.success("장바구니에 담았어요");
      useItemStore.setState({ item: undefined });
      goAfterSubmit(router, "/cart");
    });

  return (
    <div className="flex flex-col pt-[90px]">
      <InitAmplitude />
      <TopNavigator />
      <ProgressBar progress={100} />
      <Header size="Large" title={`${item.type} 주문 개수를 선택해주세요`} />
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
      <BottomBar top={<ActionError error={add.error} className="mb-3" />}>
        <Button busy={add.busy} onClick={addToCart}>
          {bizClient ? "장바구니 담기" : "로그인하고 장바구니 담기"}
        </Button>
      </BottomBar>
    </div>
  );
}
