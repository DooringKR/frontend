import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import { Separator } from "@/components/ui/separator";

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
          <Separator className="mx-5 w-auto" />
          <div className="gap-1 px-5 py-4">
            <div className="text-[17px]/[24px] font-600 text-gray-800">배송 일시</div>
            <div className="text-[15px]/[22px] font-400 text-gray-500">
              {formatDate((order as DeliveryOrder).delivery_arrival_time?.toString() ?? "", true)}
            </div>
          </div>
        </>
      )}
      {!isDelivery && (order as PickUpOrder).pickup_time !== undefined && (order as PickUpOrder).pickup_time !== null && (
        <>
          <Separator className="mx-5 w-auto" />
          <div className="gap-1 px-5 py-4">
            <div className="text-[17px]/[24px] font-600 text-gray-800">픽업 일시</div>
            <div className="text-[15px]/[22px] font-400 text-gray-500">
              {formatDate((order as PickUpOrder).pickup_time?.toString() ?? "", true)}
            </div>
          </div>
        </>
      )}
      <Separator className="mx-5 w-auto" />
    </>
  );
}
