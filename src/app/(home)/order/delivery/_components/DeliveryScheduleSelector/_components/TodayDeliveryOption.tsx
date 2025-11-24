import { useOrderStore } from "@/store/orderStore";
import { formatDeliveryTimeRange, formatRemainingTimeRange } from "@/utils/caculateDeliveryInfo";
import OrderProcessCard from "@/components/OrderProcessCard";

interface TodayDeliveryOptionProps {
    expectedArrivalMinutes: number | null;
    isTodayDeliveryAvailable: boolean;
}

export default function TodayDeliveryOption({
    expectedArrivalMinutes,
    isTodayDeliveryAvailable,
}: TodayDeliveryOptionProps) {
    const order = useOrderStore(state => state.order);
    const updateOrder = useOrderStore(state => state.updateOrder);

    const handleClick = () => {
        if (expectedArrivalMinutes && !isTodayDeliveryAvailable) return; // 오늘배송 불가 시 클릭 막기

        // 예상 도착 시간 계산
        const now = new Date();
        const arrivalDate = new Date(now);
        arrivalDate.setMinutes(now.getMinutes() + (expectedArrivalMinutes || 0));

        updateOrder({ is_today_delivery: true, delivery_arrival_time: arrivalDate });
    };

    // OrderProcessCard용 텍스트 계산
    const getTrailingText = () => {
        if (expectedArrivalMinutes === null) return "계산 중...";
        if (!isTodayDeliveryAvailable) return "";
        return `${expectedArrivalMinutes}~${expectedArrivalMinutes + 10}분 후 도착`;
    };

    const getDescriptionLine1 = () => {
        if (!isTodayDeliveryAvailable || expectedArrivalMinutes === null) {
            return "오늘 배송이 불가능해요.";
        }
        if (order?.is_today_delivery === true) {
            return formatRemainingTimeRange(expectedArrivalMinutes);
        }
        return `오늘 ${formatDeliveryTimeRange(expectedArrivalMinutes)} 도착 예정`;
    };

    const getState = () => {
        if (!isTodayDeliveryAvailable) return 'disabled';
        if (order?.is_today_delivery === true) return 'activated';
        return 'enabled';
    };

    return (
        <>
            {/* 기존 구현 */}
            {/* <div
                onClick={handleClick}
                className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-5 py-4 
                ${order?.is_today_delivery === true ? "border-2 border-gray-800" : "border-gray-300"}
                ${!isTodayDeliveryAvailable ? "cursor-not-allowed opacity-50" : ""}`}
            >
                <div className="flex justify-between">
                    <span className="text-[17px] font-600">오늘배송</span>
                    {expectedArrivalMinutes !== null ? (
                        isTodayDeliveryAvailable && <span className="text-blue-500">
                            {`${expectedArrivalMinutes}~${expectedArrivalMinutes + 10}분 후 도착`}
                        </span>
                    ) : (
                        <span className="text-blue-500">
                            계산 중...
                        </span>
                    )}
                </div>
                <p
                    className={`text-base font-400 ${isTodayDeliveryAvailable && expectedArrivalMinutes !== null && order?.is_today_delivery === true
                        ? "text-gray-800"
                        : "text-gray-500"
                        }`}
                >
                    {isTodayDeliveryAvailable && expectedArrivalMinutes !== null
                        ? order?.is_today_delivery === true
                            ? formatRemainingTimeRange(expectedArrivalMinutes)
                            : `오늘 ${formatDeliveryTimeRange(expectedArrivalMinutes)} 도착 예정`
                        : "오늘 배송이 불가능해요."}
                </p>
            </div> */}

            {/* OrderProcessCard 구현 */}
            <OrderProcessCard
                title="오늘배송"
                descriptionLine1={getDescriptionLine1()}
                trailing="primary"
                trailingText={getTrailingText()}
                showLeadingIcon={false}
                showSamedaydeliverySticker={isTodayDeliveryAvailable}
                showDescriptionLine2={false}
                showTrailing={isTodayDeliveryAvailable && expectedArrivalMinutes !== null}
                showBottom={false}
                state={getState()}
                onClick={isTodayDeliveryAvailable ? handleClick : undefined}
                className="mt-3"
            />
        </>
    );
} 