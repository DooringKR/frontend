"use client";

import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { OrderSupabaseRepository } from "@/DDD/data/db/CartNOrder/order_supabase_repository";
import { OrderItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/orderitem_supabase_repository";
import { EstimateExportEdgeFunctionAdapter } from "@/DDD/data/service/estimate_export_edge_function_adapter";
import { CreateOrderUsecase } from "@/DDD/usecase/create_order_usecase";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import { GenerateOrderEstimateUseCase } from "@/DDD/usecase/generate_order_estimate_usecase";
import { CHECK_ORDER_PAGE } from "@/constants/pageName";
import { DeliveryMethod } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/BeforeEditByKi/Button/Button";
import PriceSummaryCard from "@/components/PriceCheckCard/PriceSummaryCard";
import ReceiveOptionBar from "@/components/ReceiveOptionBar/ReceiveOptionBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useAddressStore from "@/store/addressStore";
import useBizClientStore from "@/store/bizClientStore";
import useCartItemStore from "@/store/cartItemStore";
import useCartStore from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { calculateDeliveryInfo } from "@/utils/caculateDeliveryInfo";

import DeliveryAddressCard from "./_components/DeliveryAddressCard";
import DeliveryRequestSelector from "./_components/DeliveryRequestSelector";
import DeliveryScheduleSelector from "./_components/DeliveryScheduleSelector/DeliveryScheduleSelector";
import RecipientPhoneNumber from "./_components/RecipientPhoneNumber";
import { trackClick, trackPurchase } from "@/services/analytics/amplitude";
import { getScreenName } from "@/utils/screenName";
import BottomButton from "@/components/BottomButton/BottomButton";
import PaymentNoticeCard from "@/components/PaymentNoticeCard";
import { 
  getProductTypesFromCartItems, 
  getDetailProductTypesFromCartItems,
  getTotalQuantityFromCartItems,
  getTotalValueFromCartItems 
} from "@/utils/getCartProductTypes";
import { sortProductTypes, sortDetailProductTypes } from "@/utils/formatCartProductTypes";
import OrderProcessCard from "@/components/OrderProcessCard";

const CATEGORY_MAP: Record<string, string> = {
  door: "문짝",
  finish: "마감재",
  accessory: "부속품",
  hardware: "하드웨어",
  cabinet: "부분장",
};

function CheckOrderClientPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // Cart 관련 상태
  const cart = useCartStore(state => state.cart);
  const cartItems = useCartItemStore(state => state.cartItems);
  const clearCartItems = useCartItemStore(state => state.clearCartItems);
  const decrementCartCount = useCartStore(state => state.decrementCartCount);
  const getTotalPrice = useCartItemStore(state => state.getTotalPrice);

  // Store에서 필요한 데이터 가져오기
  const updateOrder = useOrderStore(state => state.updateOrder);
  const user = useBizClientStore(state => state.bizClient!);
  const order = useOrderStore(state => state.order);

  // 화면 진입 시 초기 DeliveryOrder 구성
  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      // 새로운 주문 시작 시 이전 주문 정보 삭제
      localStorage.removeItem("recentOrder");

      const totalPrice = getTotalPrice();
      const deliveryOrderData: Partial<DeliveryOrder> = {
        user_id: user.id!,
        recipient_phone: useOrderStore.getState().order?.recipient_phone || user.phone_number!,
        order_price: totalPrice,
        road_address: useOrderStore.getState().order?.road_address || user?.road_address || "",
        detail_address: useOrderStore.getState().order?.detail_address || user.detail_address,
        // 오늘 배송이 아닌 원하는 날짜 배송인 경우를 기본값으로 설정
        is_today_delivery: useOrderStore.getState().order?.is_today_delivery || false,
        // 오늘 배송이 아니면 '내일 자정'이 기본값,
        //2025-10-01T15:00:00.000Z 이런 형식으로 저장되어 있음, z는 UTC(+0) 시간임, 저장은 이렇게 해두고 보여줄 때만 한국시간으로 변환
        delivery_arrival_time:
          useOrderStore.getState().order?.delivery_arrival_time ||
          (() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            return tomorrow;
          })(),
      };

      // setOrder 대신 updateOrder 사용 (Order는 초기화되면 안되기 때문)
      updateOrder(deliveryOrderData);
    };
    fetchDeliveryInfo();
  }, [user, getTotalPrice, updateOrder]);

  const handleOrderSubmit = async () => {
    trackClick({
      object_type: "button",
      object_name: "submit",
      current_page: getScreenName(),
      modal_name: null,
    });

    // 주소 입력 검증
    if (!order?.road_address?.trim()) {
      alert("배송 주소를 입력해주세요.");
      return;
    }

    if (!order?.detail_address?.trim()) {
      alert("상세 주소를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. 주문 생성 (CreateOrderUsecase 사용)
      // Reuse a single repo instance for order so export usecase uses same implementation
      const orderRepo = new OrderSupabaseRepository();
      const exportAdapter = new EstimateExportEdgeFunctionAdapter();
      const generateEstimateUC = new GenerateOrderEstimateUseCase(orderRepo, exportAdapter);
      const createOrderUsecase = new CreateOrderUsecase(
        orderRepo,
        new OrderItemSupabaseRepository(),
        new CartItemSupabaseRepository(),
        generateEstimateUC,
      );
      console.log("[OrderSubmit] Export usecase injected");

      const response = await createOrderUsecase.execute(order!, cart!.id!);

      if (!response.success) {
        alert(response.message);
        setIsLoading(false);
        return;
      }

      // 2. DB에서 장바구니 아이템 삭제
      const deleteResults = await Promise.all(
        cartItems.map(async item => {
          if (!item.id) return true;

          try {
            await new CrudCartItemUsecase(new CartItemSupabaseRepository()).delete(item.id);
            return true;
          } catch (err) {
            console.error(`❌ CartItem 삭제 실패: ${item.id}`, err);
            return false;
          }
        }),
      );

      const allDeleted = deleteResults.every(result => result === true);
      if (allDeleted) {
        console.log("✅ 모든 장바구니 항목이 성공적으로 삭제되었습니다.");
      } else {
        console.warn("⚠ 일부 장바구니 항목 삭제에 실패했습니다.");
      }

      // 3. Purchase 이벤트 전송 (주문 생성 성공 후)
      try {
        const productTypes = getProductTypesFromCartItems(cartItems);
        const detailProductTypes = await getDetailProductTypesFromCartItems(cartItems);
        const quantityTotal = getTotalQuantityFromCartItems(cartItems);
        const quantityType = cartItems.length;
        const revenueProduct = getTotalValueFromCartItems(cartItems);
        const revenueShipping = 0; // 현재는 0으로 하드코딩
        const discountTotal = 0; // 현재는 0
        const revenueTotal = revenueProduct + revenueShipping - discountTotal;
        
        // delivery_arrival_time에서 날짜/시간 추출
        const deliveryTime = order?.delivery_arrival_time ? new Date(order.delivery_arrival_time) : new Date();
        const shippingYear = deliveryTime.getFullYear();
        const shippingMonth = deliveryTime.getMonth() + 1; // 0-based이므로 +1
        const shippingDay = deliveryTime.getDate();
        // is_today_delivery가 true면 18시 0분 고정, 아니면 실제 시간
        const shippingHour = order?.is_today_delivery ? 18 : deliveryTime.getHours();
        const shippingMinute = order?.is_today_delivery ? 0 : deliveryTime.getMinutes();

        await trackPurchase({
          product_type: sortProductTypes(productTypes),
          detail_product_type: sortDetailProductTypes(detailProductTypes),
          quantity_total: quantityTotal,
          quantity_type: quantityType,
          revenue_total: revenueTotal,
          revenue_product: revenueProduct,
          revenue_shipping: revenueShipping,
          coupon: false, // 현재는 false로 하드코딩
          discount_total: discountTotal,
          reward_point: 0, // 현재는 0
          shipping_method: "배송",
          shipping_year: shippingYear,
          shipping_month: shippingMonth,
          shipping_day: shippingDay,
          shipping_hour: shippingHour,
          shipping_minute: shippingMinute,
        });
      } catch (error) {
        console.error("Purchase 이벤트 전송 실패:", error);
        // 이벤트 전송 실패는 주문 처리에 영향을 주지 않음
      }

      // 4. 주문 정보 로컬스토리지에 저장 -> 직후 confirm 페이지에서 사용
      // response.data.order_id, order, cartItems를 올바르게 객체로 저장
      localStorage.setItem(
        "recentOrder",
        JSON.stringify({
          order_id: response.data?.id,
          order,
          cartItems,
        }),
      ); // 자동 덮어쓰기

      // 5 Cart count 초기화 (cartItems 수만큼 감소시켜 0으로 만듦)
      if (cart && cart.cart_count > 0) {
        decrementCartCount(cart.cart_count);
      }

      // 6. 전역 상태 초기화
      clearCartItems(); // CartItemStore 초기화
      useOrderStore.getState().clearOrder(); // OrderStore 초기화

      // 7. 성공 페이지로 이동
      router.push("/order/delivery/confirm");
    } catch (error) {
      console.error("주문 처리 중 오류 발생:", error);
      alert("주문 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const isRequestInvalid =
    !order?.delivery_method ||
    (order?.delivery_method === DeliveryMethod.OPEN_GATE && !order?.gate_password?.trim()) ||
    (order?.delivery_method === DeliveryMethod.DIRECT_INPUT &&
      !order?.delivery_method_direct_input?.trim()) ||
    (order?.is_today_delivery === false && !order?.delivery_arrival_time);
  return (
    <div className="flex min-h-screen flex-col justify-between pt-[60px]">
      <TopNavigator title="주문하기" />
      <ReceiveOptionBar
        icon={"/icons/truck.svg"}
        alt={"트럭 아이콘"}
        title={"배송"}
        bottomBarClassName="mt-4 mb-8"
      />
      <div className="flex-grow px-5">
        <div className="flex flex-col gap-3 py-5">
          <h2 className="text-xl font-600 text-gray-800">주소 확인</h2>
          {/* <DeliveryAddressCard
            address={{ address1: order?.road_address!, address2: order?.detail_address! }}
            setAddress={(address: { address1: string; address2: string }) => {
              updateOrder({
                road_address: address.address1,
                detail_address: address.address2,
              });
            }}
          /> */}
          
          {/* OrderProcessCard로 표현한 주소 입력 예시 */}
          <OrderProcessCard
            title="배송 주소"
            descriptionLine1={order?.road_address || "도로명 주소를 입력해주세요"}
            descriptionLine2={order?.detail_address || "상세 주소를 입력해주세요"}
            trailing="secondary"
            showLeadingIcon={false}
            showSamedaydeliverySticker={false}
            showBottom={false}
            state="enabled"
            onClick={() => router.push("/order/delivery/address")}
          />
        </div>

        <DeliveryScheduleSelector />

        <section className="flex flex-col gap-3 py-5">
          <h2 className="text-xl font-600 text-gray-800">배송정보 확인</h2>
          <RecipientPhoneNumber />
          <DeliveryRequestSelector />
        </section>

        <div className="flex flex-col gap-1">
          <PriceSummaryCard getTotalPrice={getTotalPrice} />
          <PaymentNoticeCard />
        </div>
      </div>
      <div className="h-[150px]"></div>
      <div id="delivery-order-button" className="fixed bottom-0 w-full max-w-[460px] p-5">
        <BottomButton
          type={"1button"}
          button1Text={isLoading ? "주문 요청 중..." : "주문 접수하기"}
          className="w-full"
          button1Disabled={isRequestInvalid || isLoading}
          onButton1Click={handleOrderSubmit}
        >
        </BottomButton>
      </div>
    </div>
  );
}

export default CheckOrderClientPage;
