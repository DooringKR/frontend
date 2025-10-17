import { useState } from "react";
import DatePicker from "@/components/DatePicker";
import Modal from "@/components/Modal/Modal";
import TimePickerSimple from "@/components/TimePicker";
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
        <div className="flex flex-col gap-2">
            <div className="mt-3 flex items-center">
                <span className="text-sm font-400 text-gray-800">
                    {order?.delivery_arrival_time ? formatSelectedDate(order.delivery_arrival_time.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })) : "날짜 미선택"}{" "}
                    <span className="text-sm font-400 text-gray-600">희망배송시간</span>
                </span>
            </div>

            <div
                onClick={() => setIsDateModalOpen(true)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg"
            >
                {order?.delivery_arrival_time
                    ? formatSelectedDate(order.delivery_arrival_time.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }))
                    : "날짜를 선택해주세요"}
            </div>

            <div
                onClick={() => setIsTimeModalOpen(true)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg"
            >
                {order?.delivery_arrival_time
                    ? order?.delivery_arrival_time.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
                    : "-- : --"}
            </div>

            <Modal isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)}>
                <DatePicker
                    initialDate={
                        order?.delivery_arrival_time
                            ? order?.delivery_arrival_time
                            : isTodayDeliveryAvailable
                                ? null
                                : (() => {
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
                <TimePickerSimple
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