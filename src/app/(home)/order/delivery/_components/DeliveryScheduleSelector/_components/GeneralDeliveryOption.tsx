import OrderProcessCard from "@/components/OrderProcessCard";
import { useOrderStore } from "@/store/orderStore";

function getDefaultGeneralDeliveryTime() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
}

export default function GeneralDeliveryOption({ isLoading }: { isLoading?: boolean }) {
    const order = useOrderStore(state => state.order);
    const updateOrder = useOrderStore(state => state.updateOrder);

    const isSelected = order?.is_today_delivery === false && (order as any)?.is_date_free === true;

    return (
        <OrderProcessCard
            title="일반 배송"
            descriptionLine1={isSelected ? "배송일은 접수 후 순차적으로 안내해드려요." : "배송일 지정 없이 가장 빠른 일정으로 도와드려요."}
            trailing="primary"
            trailingText=""
            showLeadingIcon={false}
            showSamedaydeliverySticker={false}
            showDescriptionLine2={false}
            showTrailing={false}
            showBottom={false}
            state={isLoading ? "disabled" : isSelected ? "activated" : "enabled"}
            onClick={() => {
                if (isLoading) return;
                updateOrder({
                    is_today_delivery: false,
                    is_date_free: true,
                    delivery_arrival_time: getDefaultGeneralDeliveryTime(),
                } as any);
            }}
            className="mt-3"
        />
    );
}