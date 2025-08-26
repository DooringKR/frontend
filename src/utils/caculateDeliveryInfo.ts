import { DeliverTime } from "@/utils/CheckDeliveryTime";

interface DeliveryInfo {
  expectedArrivalMinutes: number;
  remainingMinutes: number;
  isToday: boolean;
  arrivalTimeFormatted: string;
}

// 배송 정보 계산 (배송 시간, 도착 시간 등)
export const calculateDeliveryInfo = async (
  address: string,
  cutoffMinutes = 18 * 60,
): Promise<DeliveryInfo> => {
  // expectedArrivalMinutes: 현재 시각 기준 예상 도착 시각
  const { expectedArrivalMinutes } = await DeliverTime(address);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const remainingMinutes = expectedArrivalMinutes - currentMinutes;

  const isToday = expectedArrivalMinutes <= cutoffMinutes;

  const hours = Math.floor(expectedArrivalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (expectedArrivalMinutes % 60).toString().padStart(2, "0");
  const arrivalTimeFormatted = `${hours}시 ${minutes}분`;

  return {
    expectedArrivalMinutes,
    remainingMinutes,
    isToday,
    arrivalTimeFormatted,
  };
};

export const formatDeliveryTimeRange = (startMinutes: number, rangeMinutes = 10): string => {
  const now = new Date();
  const start = new Date(now);
  start.setMinutes(now.getMinutes() + startMinutes);

  const end = new Date(start);
  end.setMinutes(start.getMinutes() + rangeMinutes);

  const format = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

  return `${format(start)}~${format(end)}`;
};

export const formatRemainingTimeRange = (startMinutes: number, range = 10): string => {
  const format = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours > 0 ? `${hours}시간 ` : ""}${minutes}분`;
  };

  const startText = format(startMinutes);
  const endText = format(startMinutes + range);

  return `${startText}~${endText} 후 도착`;
};

export function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6; // 0: 일요일, 6: 토요일
}

// 주문 마감까지 남은 시간 계산 (UI 표시용)
export const calculateOrderDeadline = (
  deliveryMinutes: number,
  productionMinutes = 30,
  cutoffHour = 18,
): string => {
  const now = new Date();
  console.log("🕒 현재 시각:", now.toLocaleTimeString());

  const cutoff = new Date();
  cutoff.setHours(cutoffHour, 0, 0, 0); // 오후 6시

  const timeUntilCutoffInMin = Math.floor((cutoff.getTime() - now.getTime()) / 60000);
  console.log("🔔 오후 6시까지 남은 시간:", timeUntilCutoffInMin, "분");

  console.log("🛠 제작 시간:", productionMinutes, "분");
  console.log("🚚 배송 시간:", deliveryMinutes, "분");

  const totalPrepTime = productionMinutes + deliveryMinutes;
  console.log("📦 총 준비 시간 (제작+배송):", totalPrepTime, "분");

  const arrival = new Date(now.getTime() + totalPrepTime * 60000);
  console.log("🚚 예상 도착 시각:", arrival.toLocaleTimeString());
  const remainingMinutes = timeUntilCutoffInMin - (deliveryMinutes + productionMinutes);

  if (remainingMinutes <= 0) return "주문 마감";

  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  return `${hours > 0 ? `${hours}시간 ` : ""}${minutes}분 내 주문 시`;
};
