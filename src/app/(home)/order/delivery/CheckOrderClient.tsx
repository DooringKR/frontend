"use client";

import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { OrderSupabaseRepository } from "@/DDD/data/db/CartNOrder/order_supabase_repository";
import { OrderItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/orderitem_supabase_repository";
import { EstimateExportEdgeFunctionAdapter } from "@/DDD/data/service/estimate_export_edge_function_adapter";
import { CreateOrderUsecase } from "@/DDD/usecase/create_order_usecase";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import { GenerateOrderEstimateUseCase } from "@/DDD/usecase/generate_order_estimate_usecase";
import { CHECK_ORDER_PAGE } from "@/constants/pageName";
import { DeliveryMethod, DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
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
  const [hasValidationFailed, setHasValidationFailed] = useState(false);

  // Cart 관련 상태
  const cart = useCartStore(state => state.cart);
  const cartItems = useCartItemStore(state => state.cartItems);
  const clearCartItems = useCartItemStore(state => state.clearCartItems);
  const removeCartItem = useCartItemStore(state => state.removeCartItem);
  const decrementCartCount = useCartStore(state => state.decrementCartCount);
  const getTotalPrice = useCartItemStore(state => state.getTotalPrice);

  // Store에서 필요한 데이터 가져오기
  const updateOrder = useOrderStore(state => state.updateOrder);
  const user = useBizClientStore(state => state.bizClient!);
  const order = useOrderStore(state => state.order);

  // 세트 상품과 개별 상품 분리
  const setProducts = cartItems.filter(item => item.detail_product_type === DetailProductType.LONGDOOR);
  const hasSetProducts = setProducts.length > 0;

  // 예상 주문금액: 세트상품이 있으면 세트상품만, 없으면 전체
  const getExpectedOrderPrice = () => {
    if (hasSetProducts) {
      return setProducts.reduce((sum, item) => sum + (item.unit_price ?? 0) * (item.item_count ?? 0), 0);
    }
    return getTotalPrice();
  };

  // 화면 진입 시 초기 DeliveryOrder 구성
  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      // 새로운 주문 시작 시 이전 주문 정보 삭제
      localStorage.removeItem("recentOrder");

      const totalPrice = getExpectedOrderPrice();
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
  }, [user, cartItems, updateOrder]);

  const handleOrderSubmit = async () => {
    trackClick({
      object_type: "button",
      object_name: "submit",
      current_page: getScreenName(),
      modal_name: null,
    });

    // 주소 입력 검증
    if (!order?.road_address?.trim()) {
      setHasValidationFailed(true);
      const addressElement = document.querySelector('[data-component="delivery-address"]');
      if (addressElement) {
        addressElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!order?.detail_address?.trim()) {
      setHasValidationFailed(true);
      const addressElement = document.querySelector('[data-component="delivery-address"]');
      if (addressElement) {
        addressElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 배송 요청사항 검증
    const isRequestInvalid = !order?.delivery_method ||
      (order?.delivery_method === DeliveryMethod.OPEN_GATE && !order?.gate_password?.trim()) ||
      (order?.delivery_method === DeliveryMethod.DIRECT_INPUT && !order?.delivery_method_direct_input?.trim());

    if (isRequestInvalid) {
      setHasValidationFailed(true);
      const requestElement = document.querySelector('[data-component="delivery-request"]');
      if (requestElement) {
        requestElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 배송 일정 검증
    if (order?.is_today_delivery === false && !order?.delivery_arrival_time) {
      setHasValidationFailed(true);
      const scheduleElement = document.querySelector('[data-component="delivery-schedule"]');
      if (scheduleElement) {
        scheduleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);
    setHasValidationFailed(false); // 로딩 시작과 동시에 검증 실패 상태 초기화

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

      // 2. DB에서 장바구니 아이템 삭제 (세트상품이 있으면 세트상품만 삭제)
      const itemsToDelete = hasSetProducts ? setProducts : cartItems;
      const deleteResults = await Promise.all(
        itemsToDelete.map(async item => {
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

      // 4. 주문 정보 저장 (스토어 + localStorage) -> confirm에서 스토어 우선 읽음
      const cartItemsToSave = hasSetProducts ? setProducts : cartItems;
      const payload = {
        order_id: response.data?.id,
        order,
        cartItems: cartItemsToSave,
      };
      localStorage.setItem("recentOrder", JSON.stringify(payload));
      useOrderStore.getState().setRecentOrderForConfirm(payload);

      // 5 Cart count 감소 (삭제된 아이템 수만큼만 감소)
      const deletedCount = itemsToDelete.reduce((sum, item) => sum + (item.item_count ?? 0), 0);
      if (cart && deletedCount > 0) {
        decrementCartCount(deletedCount);
      }

      // 6. 전역 상태 업데이트 (세트상품이 있으면 세트상품만 제거, 없으면 전체 초기화)
      if (hasSetProducts) {
        // 세트상품만 store에서 제거
        itemsToDelete.forEach(item => {
          if (item.id) {
            removeCartItem(item.id);
          }
        });
      } else {
        clearCartItems(); // CartItemStore 초기화
      }
      useOrderStore.getState().clearOrder(); // OrderStore 초기화

      // 7. 성공 페이지로 이동 (스토어에 이미 payload 저장됨 → confirm에서 스토어 우선 읽음)
      router.push("/order/delivery/confirm");
    } catch (error) {
      console.error("주문 처리 중 오류 발생:", error);
      alert("주문 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };


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
          <div data-component="delivery-address">
            <OrderProcessCard
              title="배송 주소"
              descriptionLine1={order?.road_address || "도로명 주소를 입력해주세요"}
              descriptionLine2={order?.detail_address || "상세 주소를 입력해주세요"}
              trailing="secondary"
              trailingColor="text-gray-400"
              showLeadingIcon={false}
              showSamedaydeliverySticker={false}
              showBottom={false}
              state={
                isLoading ? 'disabled' :
                  (!order?.road_address?.trim() || !order?.detail_address?.trim()) && hasValidationFailed
                    ? 'errored'
                    : (!order?.road_address?.trim() || !order?.detail_address?.trim())
                      ? 'emphasized'
                      : 'enabled'
              }
              onClick={() => !isLoading && router.push("/order/delivery/address")}
            />
          </div>
        </div>

        <div data-component="delivery-schedule">
          <DeliveryScheduleSelector hasValidationFailed={hasValidationFailed} isLoading={isLoading} />
        </div>

        <section className="flex flex-col gap-3 py-5">
          <h2 className="text-xl font-600 text-gray-800">배송정보 확인</h2>
          <RecipientPhoneNumber hasValidationFailed={hasValidationFailed} isLoading={isLoading} />
          <div data-component="delivery-request">
            <DeliveryRequestSelector hasValidationFailed={hasValidationFailed} isLoading={isLoading} />
          </div>
        </section>

        <div className="flex flex-col gap-1">
          <PriceSummaryCard
            getTotalPrice={getExpectedOrderPrice}
            page={CHECK_ORDER_PAGE}
            filteredCartItems={hasSetProducts ? setProducts : undefined}
          />
          {!hasSetProducts && <PaymentNoticeCard />}
        </div>
      </div>

      <div className="h-[150px]"></div>
      <div id="delivery-order-button">
        <BottomButton
          type={"1button"}
          button1Text={isLoading ? "주문 요청 중..." : "주문 접수하기"}
          className="fixed bottom-0 w-full max-w-[460px]"
          button1Disabled={isLoading}
          onButton1Click={handleOrderSubmit}
        />

      </div>

    </div>
  );
}

export default CheckOrderClientPage;
