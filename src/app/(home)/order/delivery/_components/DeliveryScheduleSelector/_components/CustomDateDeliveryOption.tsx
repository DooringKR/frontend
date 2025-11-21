import { useOrderStore } from "@/store/orderStore";
import DateTimeSelector from "./DateTimeSelector";
import OrderProcessCard from "@/components/OrderProcessCard";

interface CustomDateDeliveryOptionProps {
    formatSelectedDate: (dateString: string) => string;
    isTodayDeliveryAvailable: boolean;
}

export default function CustomDateDeliveryOption({
    formatSelectedDate,
    isTodayDeliveryAvailable,
}: CustomDateDeliveryOptionProps) {
    const order = useOrderStore(state => state.order);
    const updateOrder = useOrderStore(state => state.updateOrder);

    const handleClick = () => {
        updateOrder({ is_today_delivery: false, delivery_arrival_time: new Date(Date.now() + 24 * 60 * 60 * 1000) });
    };

    // OrderProcessCard용 텍스트 계산
    const getTrailingText = () => {
        return order?.is_today_delivery === false ? "" : "날짜 선택";
    };

    const getDescriptionLine1 = () => {
        if (order?.is_today_delivery === false) {
            return order?.delivery_arrival_time
                ? `${formatSelectedDate(order.delivery_arrival_time)} 원하는 시간 도착`
                : "날짜를 선택해주세요 원하는 시간 도착";
        }
        return "원하는 날짜와 시간에 배송돼요.";
    };

    const getState = () => {
        return order?.is_today_delivery === false ? 'activated' : 'enabled';
    };

    return (
        <>
            {/* 기존 구현 */}
            <div
                onClick={handleClick}
                className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-5 py-4 ${order?.is_today_delivery === false ? "border-2 border-gray-800" : "border-gray-300"
                    }`}
            >
            <div className="flex justify-between">
                <span className="text-[17px] font-600">원하는 날짜 배송</span>
                {order?.is_today_delivery === false ? (
                    //커스텀 포커스 경우
                    ""
                ) : (
                    //커스텀 포커스 아닌 경우
                    <span className="text-sm text-blue-500">날짜 선택</span>
                )}
            </div>
            {order?.is_today_delivery === false ? (
                //오늘 배송이 아니면 날짜 선택 버튼 노출
                <span className="text-[15px] font-500">
                    {order?.delivery_arrival_time
                        ? formatSelectedDate(order.delivery_arrival_time)
                        : "날짜를 선택해주세요"}
                    {" "}
                    원하는 시간 도착
                </span>
            ) : (
                <p className="text-base font-400 text-gray-500">원하는 날짜와 시간에 배송돼요.</p>
            )}

            {order?.is_today_delivery === false && (
                <DateTimeSelector
                    formatSelectedDate={formatSelectedDate}
                    isTodayDeliveryAvailable={isTodayDeliveryAvailable}
                />
            )}
        </div>

        {/* OrderProcessCard 구현 */}
        <OrderProcessCard
            title="원하는 날짜 배송"
            descriptionLine1={getDescriptionLine1()}
            trailing="primary"
            trailingText={getTrailingText()}
            showLeadingIcon={false}
            showSamedaydeliverySticker={false}
            showDescriptionLine2={false}
            showTrailing={order?.is_today_delivery !== false}
            showBottom={order?.is_today_delivery === false}
            state={getState()}
            onClick={handleClick}
            className="mt-3"
            bottomLabel="희망 배송 일정"
            dateValue=""
            timeValue=""
        />
        </>
    );
} 