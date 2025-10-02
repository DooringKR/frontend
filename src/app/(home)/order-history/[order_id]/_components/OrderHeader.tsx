import MapIcon from "public/icons/map";
import PickUpIcon from "public/icons/pick-up";
import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import { formatPrice } from "../../utils/formatters";

interface OrderHeaderProps {
  order: DeliveryOrder | PickUpOrder;
  isDelivery: boolean;
}

export default function OrderHeader({ order, isDelivery }: OrderHeaderProps) {
  return (
    <>
      <div className="flex flex-col gap-2 px-5 pb-[60px] pt-5">
        <div className="flex gap-2">
          {!isDelivery ? <PickUpIcon /> : <MapIcon />}
          {!isDelivery ? (
            <div className="text-[17px]/[24px] font-500 text-gray-500">픽업 주문</div>
          ) : (
            <div className="text-[17px]/[24px] font-500 text-gray-500">
              {(order as DeliveryOrder).road_address},{" "}
              {(order as DeliveryOrder).detail_address}
            </div>
          )}
        </div>
        <div className="text-[26px]/[36px] font-700 text-gray-900">
          {formatPrice(order.order_price)}원
        </div>
      </div>
      <div className="mx-5 h-[1px] bg-gray-200"></div>
    </>
  );
}
