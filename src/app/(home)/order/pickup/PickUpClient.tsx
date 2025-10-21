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
import { trackClick } from "@/services/analytics/amplitude";


export default function PickUpClientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  const isDisabled = !order?.recipient_phone || !order?.vehicle_type || !order?.pickup_time;

  const handleSubmit = async () => {
    trackClick({
      object_type: "button",
      object_name: "submit",
      current_page: getScreenName(),
      modal_name: null,
    });
    setIsLoading(true);

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


      // 3. 주문 정보 로컬스토리지에 저장 -> 직후 confirm 페이지에서 사용
      localStorage.setItem("recentOrder", JSON.stringify({ order_id: response.data?.id, order, cartItems })); // 자동 덮어쓰기



      // 4 Cart count 초기화 (cartItems 수만큼 감소시켜 0으로 만듦)
      if (cart && cart.cart_count > 0) {
        decrementCartCount(cart.cart_count);
      }

      // 5. 전역 상태 초기화
      clearCartItems(); // CartItemStore 초기화
      useOrderStore.getState().clearOrder(); // OrderStore 초기화


      // 6. 성공 페이지로 이동
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
    <div>
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
          <RecipientPhoneNumber />
          <PickUpVehicleSelector />
        </div>
        <div className="px-5">
          <PickupScheduleSelector />
        </div>
        <div className="px-5">
          <PriceSummaryCard
            getTotalPrice={getTotalPrice}
          />
        </div>
      </div>
      <div className="h-[100px]"></div>
      <div id="pickup-order-button">
        <BottomButton
          type={"1button"}
          button1Text={isLoading ? "주문 요청 중..." : "주문 접수하기"}
          className={`fixed bottom-0 w-full max-w-[460px] ${isDisabled ? "pointer-events-none opacity-50" : ""}`}
          onButton1Click={handleSubmit}
        />
      </div>
    </div>
  );
}
