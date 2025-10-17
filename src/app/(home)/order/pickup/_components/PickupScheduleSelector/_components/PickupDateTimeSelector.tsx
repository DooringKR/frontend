import { useState } from "react";
import DatePicker from "@/components/DatePicker";
import Modal from "@/components/Modal/Modal";
import TimePickerSimple from "@/components/TimePicker";
import { useOrderStore } from "@/store/orderStore";

interface PickupDateTimeSelectorProps {
    formatSelectedDate: (dateString: string) => string;
}

export default function PickupDateTimeSelector({
    formatSelectedDate,
}: PickupDateTimeSelectorProps) {
    const order = useOrderStore(state => state.order);
    const updateOrder = useOrderStore(state => state.updateOrder);
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            <div className="mt-3 flex items-center">
                <span className="text-sm font-400 text-gray-800">
                    {order?.pickup_time ? formatSelectedDate(order.pickup_time) : "날짜 미선택"}{" "}
                    <span className="text-sm font-400 text-gray-600">희망픽업시간</span>
                </span>
            </div>

            <div
                onClick={() => setIsDateModalOpen(true)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg cursor-pointer"
            >
                {order?.pickup_time
                    ? formatSelectedDate(order.pickup_time)
                    : "날짜를 선택해주세요"}
            </div>

            <div
                onClick={() => setIsTimeModalOpen(true)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg cursor-pointer"
            >
                {order?.pickup_time
                    ? order?.pickup_time.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
                    : "-- : --"}
            </div>

            <Modal isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)}>
                <DatePicker
                    initialDate={
                        order?.pickup_time
                            ? order?.pickup_time
                            : (() => {
                                // 픽업은 현재 시간부터 가능
                                const now = new Date();
                                return now;
                            })()
                    }
                    onConfirm={date => {
                        // 현재 시간 유지하면서 날짜만 변경
                        if (order?.pickup_time) {
                            const newDate = new Date(date);
                            newDate.setHours(order.pickup_time.getHours());
                            newDate.setMinutes(order.pickup_time.getMinutes());
                            updateOrder({ pickup_time: newDate });
                        } else {
                            // 현재 시간으로 설정
                            const now = new Date();
                            updateOrder({ pickup_time: now });
                        }
                        setIsDateModalOpen(false);
                    }}
                    onClose={() => setIsDateModalOpen(false)}
                />
            </Modal>
            <Modal isOpen={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)}>
                <TimePickerSimple
                    initialHour={order?.pickup_time ? order?.pickup_time.getHours().toString().padStart(2, "0") : ""}
                    initialMinute={order?.pickup_time ? order?.pickup_time.getMinutes().toString().padStart(2, "0") : ""}
                    onConfirm={(h, m) => {
                        if (!order?.pickup_time) return;
                        const newDate = new Date(order?.pickup_time);
                        newDate.setHours(parseInt(h));
                        newDate.setMinutes(parseInt(m));
                        updateOrder({ pickup_time: newDate });
                        setIsTimeModalOpen(false);
                    }}
                    onClose={() => setIsTimeModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

