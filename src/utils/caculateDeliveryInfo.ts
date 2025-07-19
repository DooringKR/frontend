import { DeliverTime } from "@/utils/CheckDeliveryTime";

interface DeliveryInfo {
  expectedArrivalMinutes: number;
  remainingMinutes: number;
  isToday: boolean;
  arrivalTimeFormatted: string;
}

export const calculateDeliveryInfo = async (
  address: string,
  cutoffMinutes = 18 * 60,
): Promise<DeliveryInfo> => {
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
