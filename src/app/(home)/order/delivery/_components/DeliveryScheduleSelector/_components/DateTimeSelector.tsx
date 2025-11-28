import { useState } from "react";
import DeliveryDatePicker from "./DeliveryDatePicker";
import Modal from "@/components/Modal/Modal";
import TimePickerSimple from "@/components/TimePicker";
import TimePickerSwiper from "@/components/TimePickerSwiper";
import { useOrderStore } from "@/store/orderStore";

interface DateTimeSelectorProps {
    formatSelectedDate: (dateString: string) => string;
    isTodayDeliveryAvailable: boolean;
}

export default function DateTimeSelector({
    formatSelectedDate,
    isTodayDeliveryAvailable,
}: DateTimeSelectorProps) {
    const order = useOrderStore(state => state.order);
    const updateOrder = useOrderStore(state => state.updateOrder);
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);

    return (
        <div className="flex items-center gap-2">
            <div
                onClick={() => setIsDateModalOpen(true)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg cursor-pointer"
            >
                {order?.delivery_arrival_time
                    ? formatSelectedDate(order.delivery_arrival_time)
                    : "날짜"}
            </div>

            <div
                onClick={() => setIsTimeModalOpen(true)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg cursor-pointer"
            >
                {order?.delivery_arrival_time
                    ? order?.delivery_arrival_time.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
                    : "시간"}
            </div>

            <Modal isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)}>
                <DeliveryDatePicker
                    initialDate={
                        order?.delivery_arrival_time
                            ? order?.delivery_arrival_time
                            : (() => {
                                // 배송은 항상 내일부터 가능
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                tomorrow.setHours(0, 0, 0, 0);
                                return tomorrow;
                            })()
                    }
                    onConfirm={date => {
                        // 로컬 시간대로 날짜 생성 (UTC 변환 방지)
                        const [year, month, day] = date.split('-').map(Number);
                        const localDate = new Date(year, month - 1, day, 0, 0, 0, 0);
                        updateOrder({ delivery_arrival_time: localDate });
                        console.log('📅 날짜 선택 완료:', localDate.toISOString().split("T")[0]);
                        console.log('📅 로컬 날짜:', localDate.toLocaleDateString());
                        setIsDateModalOpen(false);
                    }}
                    onClose={() => setIsDateModalOpen(false)}
                />
            </Modal>
            <Modal isOpen={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)}>
                <TimePickerSwiper
                    initialHour={order?.delivery_arrival_time ? order?.delivery_arrival_time.getHours().toString().padStart(2, "0") : ""}
                    initialMinute={order?.delivery_arrival_time ? order?.delivery_arrival_time.getMinutes().toString().padStart(2, "0") : ""}
                    onConfirm={(h, m) => {
                        if (!order?.delivery_arrival_time) return;
                        const newDate = new Date(order?.delivery_arrival_time);
                        newDate.setHours(parseInt(h));
                        newDate.setMinutes(parseInt(m));
                        updateOrder({ delivery_arrival_time: newDate });
                        setIsTimeModalOpen(false);
                    }}
                    onClose={() => setIsTimeModalOpen(false)}
                />
            </Modal>
        </div>
    );
} 