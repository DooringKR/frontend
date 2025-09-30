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

import { useOrderStore } from "@/store/orderStore";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import useBizClientStore from "@/store/bizClientStore";
import useCartItemStore from "@/store/cartItemStore";
import { CreateOrderUsecase } from "@/DDD/usecase/create_order_usecase";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";


export default function PickUpClientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Store에서 필요한 데이터 가져오기
  const updateOrder = useOrderStore(state => state.updateOrder);
  const user = useBizClientStore(state => state.bizClient!);
  const order = useOrderStore(state => state.order);
  const cartItems = useCartItemStore(state => state.cartItems);
  // 화면 진입 시 초기 PickUpOrder 구성, 나머지 속성은 각 컴포넌트에서 업데이트
  useEffect(() => {
    const pickupOrderData: Partial<PickUpOrder> = {
      user_id: user.id!,
      recipient_phone: useOrderStore.getState().order?.recipient_phone || user.phone_number!,
      order_price: 0, // 실제 가격으로 교체 필요
    };
    //setOrder 대신 updateOrder 사용(Order는 초기화 되면 안되기 때문)
    updateOrder(pickupOrderData);
  }, [user, updateOrder]);

  const getTotalPrice = () => {
    return cartItems.reduce((sum, cartItem) => sum + (cartItem.unit_price ?? 0) * (cartItem.item_count ?? 0), 0);
  };
  const isDisabled = !order?.recipient_phone || !order?.vehicle_type;

  const handleSubmit = async () => {
    setIsLoading(true);
    const createOrderUsecase = new CreateOrderUsecase(
      new OrderSupabaseRepository(),
      new OrderItemSupabaseRepository(),
      new CartItemSupabaseRepository()
    );
    const response = await createOrderUsecase.execute(order);
    if (response.isSuccess) {
      // router.push("/order/pickup/success");
    } else {
      alert(response.errorMessage);
    }
    useOrderStore.setState({ order: null });
    setIsLoading(false);
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
