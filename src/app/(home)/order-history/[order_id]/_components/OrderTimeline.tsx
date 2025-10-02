import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import { formatDate } from "../../utils/formatters";

interface OrderTimelineProps {
  order: DeliveryOrder | PickUpOrder;
  isDelivery: boolean;
}

export default function OrderTimeline({ order, isDelivery }: OrderTimelineProps) {
  return (
    <>
      <div className="gap-1 px-5 py-4">
        <div className="text-[17px]/[24px] font-600 text-gray-800">주문 일시</div>
        <div className="text-[15px]/[22px] font-400 text-gray-500">
          {formatDate(order.created_at?.toString() ?? "", true)}
        </div>
      </div>
      {isDelivery && (
        <>
          <div className="mx-5 h-[1px] bg-gray-200"></div>
          <div className="gap-1 px-5 py-4">
            <div className="text-[17px]/[24px] font-600 text-gray-800">배송 일시</div>
            <div className="text-[15px]/[22px] font-400 text-gray-500">
              {formatDate((order as DeliveryOrder).delivery_arrival_time?.toString() ?? "", true)}
            </div>
          </div>
        </>
      )}
      <div className="mx-5 h-[1px] bg-gray-200"></div>
    </>
  );
}
