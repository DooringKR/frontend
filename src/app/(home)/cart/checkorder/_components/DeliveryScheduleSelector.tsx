// "use client";

// import { useEffect, useState } from "react";

// import DatePicker from "@/components/DatePicker";
// import Modal from "@/components/Modal/Modal";
// import TimePickerSimple from "@/components/TimePicker";

// import { useOrderStore } from "@/store/orderStore";
// import { formatDeliveryTimeRange, formatRemainingTimeRange } from "@/utils/caculateDeliveryInfo";

// interface DeliveryScheduleSelectorProps {
//   expectedArrivalMinutes: number | null;
// }

// export default function DeliveryScheduleSelector({
//   expectedArrivalMinutes,
// }: DeliveryScheduleSelectorProps) {
//   const deliveryType = useOrderStore(state => state.deliveryType);
//   const setDeliveryType = useOrderStore(state => state.setDeliveryType);
//   const setDeliveryDate = useOrderStore(state => state.setDeliveryDate);
//   const hour = useOrderStore(state => state.deliveryHour);
//   const setHour = useOrderStore(state => state.setDeliveryHour);
//   const minute = useOrderStore(state => state.deliveryMinute);
//   const setMinute = useOrderStore(state => state.setDeliveryMinute);
//   const selectedDeliveryDate = useOrderStore(state => state.selectedDeliveryDate);
//   const setSelectedDeliveryDate = useOrderStore(state => state.setSelectedDeliveryDate);

//   const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
//   const [isDateModalOpen, setIsDateModalOpen] = useState(false);
//   const [isTodayDeliveryAvailable, setIsTodayDeliveryAvailable] = useState(true);
//   const userSelectedDeliveryType = useOrderStore(state => state.userSelectedDeliveryType);
//   const setUserSelectedDeliveryType = useOrderStore(state => state.setUserSelectedDeliveryType);
//   // 날짜 포맷팅 함수
//   const formatSelectedDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
//     const weekDay = weekDays[date.getDay()];

//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     if (dateString === today.toISOString().split("T")[0]) {
//       return `오늘 (${month}/${day} ${weekDay})`;
//     } else if (dateString === tomorrow.toISOString().split("T")[0]) {
//       return `내일 (${month}/${day} ${weekDay})`;
//     } else {
//       return `${month}/${day} (${weekDay})`;
//     }
//   };

//   useEffect(() => {
//     if (expectedArrivalMinutes === null) return;

//     const deliveryDateObj = new Date();

//     if (deliveryType === "custom") {
//       if (!selectedDeliveryDate || hour === "--" || minute === "--") return;
//       const [year, month, day] = selectedDeliveryDate.split("-").map(Number);
//       deliveryDateObj.setFullYear(year, month - 1, day);
//       deliveryDateObj.setHours(parseInt(hour));
//       deliveryDateObj.setMinutes(parseInt(minute));
//       deliveryDateObj.setSeconds(0);
//     } else {
//       deliveryDateObj.setMinutes(deliveryDateObj.getMinutes() + expectedArrivalMinutes);
//     }

//     const kstString = deliveryDateObj
//       .toLocaleString("sv-SE", { timeZone: "Asia/Seoul" })
//       .replace(" ", "T");
//     setDeliveryDate(kstString);
//   }, [deliveryType, selectedDeliveryDate, hour, minute, expectedArrivalMinutes, setDeliveryDate]);

//   useEffect(() => {
//     if (expectedArrivalMinutes === null) return;

//     const now = new Date();
//     const arrivalDate = new Date(now);
//     arrivalDate.setMinutes(now.getMinutes() + expectedArrivalMinutes);

//     // if (arrivalDate.getHours() >= 18) {
//     //   setIsTodayDeliveryAvailable(false);
//     //   setDeliveryType("notToday");
//     //   setHour("--");
//     //   setMinute("--");
//     // } else {
//     //   setIsTodayDeliveryAvailable(true);
//     // }

//     // const isTodayAvailable = arrivalDate.getHours() < 18;
//     // setIsTodayDeliveryAvailable(isTodayAvailable);
//     const todayDeadline = new Date();
//     todayDeadline.setHours(18, 0, 0, 0); // 오늘 18:00:00

//     const isTodayAvailable = arrivalDate.getTime() < todayDeadline.getTime();
//     console.log("🚚 예상 도착시간:", arrivalDate.toLocaleTimeString());
//     console.log("🚫 오늘배송 가능 여부:", isTodayAvailable);
//     setIsTodayDeliveryAvailable(isTodayAvailable);

//     // // ✅ 오늘 배송이 안 되는데 today로 설정되어 있으면 tomorrow로 강제 변경
//     // if (!isTodayAvailable && deliveryType === "today") {
//     //   setDeliveryType("tomorrow");
//     //   if (hour === "--" && minute === "--") {
//     //     setHour("--");
//     //     setMinute("--");
//     //   }
//     // }

//     // 사용자가 일부러 선택하지 않았을 때만 자동으로 custom으로 전환
//     // ✅ 자동 전환은 "직접 선택 안한 경우"에만
//     if (!isTodayAvailable && userSelectedDeliveryType !== "today") {
//       setDeliveryType("custom");
//       if (hour === "--" && minute === "--") {
//         setHour("--");
//         setMinute("--");
//       }
//     }
//     console.log("🌐 deliveryType:", deliveryType);
//     console.log("👆 userSelectedDeliveryType:", userSelectedDeliveryType);
//   }, [expectedArrivalMinutes, userSelectedDeliveryType]);

//   return (
//     <section className="flex flex-col gap-3 py-5">
//       <h2 className="text-xl font-600">배송일정 선택</h2>

//       <div
//         onClick={() => {
//           if (!isTodayDeliveryAvailable) return; // ✅ 오늘배송 불가 시 클릭 막기
//           setDeliveryType("today");
//           setUserSelectedDeliveryType("today");
//         }}
//         className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-5 py-4 ${deliveryType === "today" ? "border-2 border-gray-800" : "border-gray-300"} ${!isTodayDeliveryAvailable ? "cursor-not-allowed opacity-50" : ""}`}
//       >
//         {/* {!isTodayDeliveryAvailable && (
//           <p className="text-sm text-red-500">현재 시간에는 오늘배송이 불가능해요.</p>
//         )} */}
//         <div className="flex justify-between">
//           <span className="text-[17px] font-600">오늘배송</span>
//           {deliveryType !== "today" && (
//             <span className="text-blue-500">
//               {expectedArrivalMinutes !== null
//                 ? `${expectedArrivalMinutes}~${expectedArrivalMinutes + 10}분 후 도착`
//                 : "계산 중..."}
//             </span>
//           )}
//         </div>
//         <p
//           className={`text-base font-400 ${
//             isTodayDeliveryAvailable && expectedArrivalMinutes !== null && deliveryType === "today"
//               ? "text-gray-800"
//               : "text-gray-500"
//           }`}
//         >
//           {isTodayDeliveryAvailable && expectedArrivalMinutes !== null
//             ? deliveryType === "today"
//               ? formatRemainingTimeRange(expectedArrivalMinutes)
//               : `오늘 ${formatDeliveryTimeRange(expectedArrivalMinutes)} 도착 예정`
//             : "오늘 배송이 불가능해요."}
//         </p>
//       </div>

//       <div
//         onClick={() => {
//           setDeliveryType("custom");
//           setUserSelectedDeliveryType("custom"); // 사용자가 'custom'을 선택했다고 기록
//         }}
//         className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-5 py-4 ${deliveryType === "custom" ? "border-2 border-gray-800" : "border-gray-300"}`}
//       >
//         <div className="flex justify-between">
//           <span className="text-[17px] font-600">원하는 날짜 배송</span>
//           {deliveryType === "custom" ? (
//             ""
//           ) : (
//             <span className="text-sm text-blue-500">날짜 선택</span>
//           )}
//         </div>
//         {deliveryType === "custom" ? (
//           <span className="text-[15px] font-500">
//             {selectedDeliveryDate
//               ? formatSelectedDate(selectedDeliveryDate)
//               : "날짜를 선택해주세요"}{" "}
//             원하는 시간 도착
//           </span>
//         ) : (
//           <p className="text-base font-400 text-gray-500">원하는 날짜와 시간에 배송돼요.</p>
//         )}

//         {deliveryType === "custom" && (
//           <div className="flex flex-col gap-2">
//             <div className="mt-3 flex items-center">
//               <span className="text-sm font-400 text-gray-800">
//                 {selectedDeliveryDate ? formatSelectedDate(selectedDeliveryDate) : "날짜 미선택"}{" "}
//                 <span className="text-sm font-400 text-gray-600">희망배송시간</span>
//               </span>
//             </div>

//             <div
//               onClick={() => setIsDateModalOpen(true)}
//               className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg"
//             >
//               {selectedDeliveryDate
//                 ? formatSelectedDate(selectedDeliveryDate)
//                 : "날짜를 선택해주세요"}
//             </div>

//             <div
//               onClick={() => setIsTimeModalOpen(true)}
//               className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg"
//             >
//               {hour === "--" || minute === "--" ? "-- : --" : `${hour}:${minute}`}
//             </div>

//             <Modal isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)}>
//               <DatePicker
//                 initialDate={selectedDeliveryDate}
//                 onConfirm={date => {
//                   setSelectedDeliveryDate(date);
//                   setIsDateModalOpen(false);
//                 }}
//                 onClose={() => setIsDateModalOpen(false)}
//               />
//             </Modal>

//             <Modal isOpen={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)}>
//               <TimePickerSimple
//                 initialHour={hour}
//                 initialMinute={minute}
//                 onConfirm={(h, m) => {
//                   setHour(h);
//                   setMinute(m);
//                   setIsTimeModalOpen(false);
//                 }}
//                 onClose={() => setIsTimeModalOpen(false)}
//               />
//             </Modal>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
