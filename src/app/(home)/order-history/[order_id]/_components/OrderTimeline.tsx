import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import { formatDate } from "../../utils/formatters";

interface OrderTimelineProps {
  order: DeliveryOrder | PickUpOrder;
  isDelivery: boolean;
}

export default function OrderTimeline({ order, isDelivery }: OrderTimelineProps) {
  const isTodayDelivery = Boolean((order as DeliveryOrder).is_today_delivery);
  const isDateFree = Boolean((order as any)?.is_date_free);
  const deliveryScheduleLabel = isTodayDelivery ? "오늘배송" : isDateFree ? "일반 배송" : "예약 배송";
  const pickupTime = (order as PickUpOrder).pickup_time ? new Date((order as PickUpOrder).pickup_time as any) : null;
  const pickupScheduleLabel = Boolean((order as any)?.is_date_free) ? "일반 픽업" : "예약 픽업";

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
            <div className="text-[15px]/[22px] font-400 text-gray-500">{deliveryScheduleLabel}</div>
            <div className="text-[15px]/[22px] font-400 text-gray-500">
              {isTodayDelivery
                ? "오늘 중 도착 예정"
                : isDateFree
                  ? "일정 협의 후 배송"
                  : formatDate((order as DeliveryOrder).delivery_arrival_time?.toString() ?? "", true)}
            </div>
          </div>
        </>
      )}
      {!isDelivery && (order as PickUpOrder).pickup_time !== undefined && (order as PickUpOrder).pickup_time !== null && (
        <>
          <div className="mx-5 h-[1px] bg-gray-200"></div>
          <div className="gap-1 px-5 py-4">
            <div className="text-[17px]/[24px] font-600 text-gray-800">픽업 일시</div>
            <div className="text-[15px]/[22px] font-400 text-gray-500">{pickupScheduleLabel}</div>
            <div className="text-[15px]/[22px] font-400 text-gray-500">
              {Boolean((order as any)?.is_date_free)
                ? "가장 빠른 일정으로 준비"
                : formatDate((order as PickUpOrder).pickup_time?.toString() ?? "", true)}
            </div>
          </div>
        </>
      )}
      <div className="mx-5 h-[1px] bg-gray-200"></div>
    </>
  );
}
