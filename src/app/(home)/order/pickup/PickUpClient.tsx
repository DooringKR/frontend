"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import PriceSummaryCard from "@/components/PriceCheckCard/PriceSummaryCard";
import ReceiveOptionBar from "@/components/ReceiveOptionBar/ReceiveOptionBar";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import PickUpVehicleSelector from "./_components/PickUpVehicleSelector";
import RecipientPhoneNumber from "./_components/RecipientPhoneNumber";
import PickUpAddressCard from "./_components/PickUpAddressCard";
import PickupScheduleSelector from "./_components/PickupScheduleSelector/PickupScheduleSelector";

import { useOrderStore } from "@/store/orderStore";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import useBizClientStore from "@/store/bizClientStore";
import useCartItemStore from "@/store/cartItemStore";
import { CreateOrderUsecase } from "@/DDD/usecase/create_order_usecase";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { OrderSupabaseRepository } from "@/DDD/data/db/CartNOrder/order_supabase_repository";
import { OrderItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/orderitem_supabase_repository";
import useCartStore from "@/store/cartStore";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import { GenerateOrderEstimateUseCase } from "@/DDD/usecase/generate_order_estimate_usecase";
import { EstimateExportEdgeFunctionAdapter } from "@/DDD/data/service/estimate_export_edge_function_adapter";
import { getScreenName } from "@/utils/screenName";
import { trackClick, trackPurchase } from "@/services/analytics/amplitude";
import PaymentNoticeCard from "@/components/PaymentNoticeCard";
import { 
  getProductTypesFromCartItems, 
  getDetailProductTypesFromCartItems,
  getTotalQuantityFromCartItems,
  getTotalValueFromCartItems 
} from "@/utils/getCartProductTypes";
import { sortProductTypes, sortDetailProductTypes } from "@/utils/formatCartProductTypes";


export default function PickUpClientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasValidationFailed, setHasValidationFailed] = useState(false);

  // Store에서 필요한 데이터 가져오기
  const updateOrder = useOrderStore(state => state.updateOrder);
  const user = useBizClientStore(state => state.bizClient!);
  const order = useOrderStore(state => state.order);
  const cartItems = useCartItemStore(state => state.cartItems);
  const cart = useCartStore(state => state.cart);
  const clearCartItems = useCartItemStore(state => state.clearCartItems);
  const decrementCartCount = useCartStore(state => state.decrementCartCount);
  const getTotalPrice = useCartItemStore(state => state.getTotalPrice);

  // 화면 진입 시 초기 PickUpOrder 구성, 나머지 속성은 각 컴포넌트에서 업데이트
  useEffect(() => {
    // 새로운 주문 시작 시 이전 주문 정보 삭제
    localStorage.removeItem("recentOrder");

    const totalPrice = getTotalPrice();
    const pickupOrderData: Partial<PickUpOrder> = {
      user_id: user.id!,
      recipient_phone: useOrderStore.getState().order?.recipient_phone || user.phone_number!,
      order_price: totalPrice,
    };
    //setOrder 대신 updateOrder 사용(Order는 초기화 되면 안되기 때문)
    updateOrder(pickupOrderData);
  }, []);

  const handleSubmit = async () => {
    trackClick({
      object_type: "button",
      object_name: "submit",
      current_page: getScreenName(),
      modal_name: null,
    });

    // 휴대폰 번호 검증
    if (!order?.recipient_phone?.trim()) {
      setHasValidationFailed(true);
      const phoneElement = document.querySelector('[data-component="recipient-phone"]');
      if (phoneElement) {
        phoneElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 차량 유형 검증
    if (!order?.vehicle_type) {
      setHasValidationFailed(true);
      const vehicleElement = document.querySelector('[data-component="pickup-vehicle"]');
      if (vehicleElement) {
        vehicleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 픽업 시간 검증
    if (!order?.pickup_time) {
      setHasValidationFailed(true);
      const scheduleElement = document.querySelector('[data-component="pickup-schedule"]');
      if (scheduleElement) {
        scheduleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);
    setHasValidationFailed(false);

    try {
      // 1. 주문 생성
      const orderRepo = new OrderSupabaseRepository();
      const exportAdapter = new EstimateExportEdgeFunctionAdapter();
      const generateEstimateUC = new GenerateOrderEstimateUseCase(orderRepo, exportAdapter);
      const createOrderUsecase = new CreateOrderUsecase(
        orderRepo,
        new OrderItemSupabaseRepository(),
        new CartItemSupabaseRepository(),
        generateEstimateUC
      );
      console.log('[PickUpOrderSubmit] Export usecase injected');
      const response = await createOrderUsecase.execute(order, cart!.id!);

      if (!response.success) {
        alert(response.message);
        setIsLoading(false);
        return;
      }

      // 2. DB에서 장바구니 아이템 삭제
      const deleteResults = await Promise.all(
        cartItems.map(async (item) => {
          if (!item.id) return true;

          try {
            await new CrudCartItemUsecase(
              new CartItemSupabaseRepository()
            ).delete(item.id);
            return true;
          } catch (err) {
            console.error(`❌ CartItem 삭제 실패: ${item.id}`, err);
            return false;
          }
        })
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
        
        // pickup_time에서 날짜/시간 추출
        const pickupTime = order?.pickup_time ? new Date(order.pickup_time) : new Date();
        const shippingYear = pickupTime.getFullYear();
        const shippingMonth = pickupTime.getMonth() + 1; // 0-based이므로 +1
        const shippingDay = pickupTime.getDate();
        const shippingHour = pickupTime.getHours();
        const shippingMinute = pickupTime.getMinutes();

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
          shipping_method: "픽업",
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
      localStorage.setItem("recentOrder", JSON.stringify({ order_id: response.data?.id, order, cartItems })); // 자동 덮어쓰기



      // 5 Cart count 초기화 (cartItems 수만큼 감소시켜 0으로 만듦)
      if (cart && cart.cart_count > 0) {
        decrementCartCount(cart.cart_count);
      }

      // 6. 전역 상태 초기화
      clearCartItems(); // CartItemStore 초기화
      useOrderStore.getState().clearOrder(); // OrderStore 초기화


      // 7. 성공 페이지로 이동
      router.push("/order/pickup/confirm");
      // router.replace("/");


    } catch (error) {
      console.error("주문 처리 중 오류 발생:", error);
      alert("주문 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-[60px]">
      <TopNavigator title="주문하기" />
      <div>
        <ReceiveOptionBar
          icon={"/icons/parcel.svg"}
          alt={"소포 아이콘"}
          title={"직접 픽업"}
          children={<PickUpAddressCard />}
          bottomBarClassName="my-8"
        />
        <div className="flex flex-col gap-3 p-5">
          <h1 className="text-xl font-600">픽업정보 확인</h1>
          <div data-component="recipient-phone">
            <RecipientPhoneNumber hasValidationFailed={hasValidationFailed} isLoading={isLoading} />
          </div>
          <div data-component="pickup-vehicle">
            <PickUpVehicleSelector hasValidationFailed={hasValidationFailed} isLoading={isLoading} />
          </div>
        </div>
        <div className="px-5">
          <div data-component="pickup-schedule">
            <PickupScheduleSelector hasValidationFailed={hasValidationFailed} isLoading={isLoading} />
          </div>
        </div>
        <div className="px-5">
          <div className="flex flex-col gap-1">
            <PriceSummaryCard
              getTotalPrice={getTotalPrice}
            />
            <PaymentNoticeCard />
          </div>
        </div>
      </div>
      <div className="h-[150px]"></div>
      <div id="pickup-order-button">
        <BottomButton
          type={"1button"}
          button1Text={isLoading ? "주문 요청 중..." : "주문 접수하기"}
          className={`fixed bottom-0 w-full max-w-[460px] `}
          button1Disabled={isLoading}
          onButton1Click={handleSubmit}
        />
      </div>
    </div>
  );
}
