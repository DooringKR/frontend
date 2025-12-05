import { AddressIndicatorProps } from "@/components/AddressIndicator/AddressIndicator";
import { BizClient } from "dooring-core-domain/dist/models/User/BizClient";

interface DeliveryInfo {
    deliverySchedule: "today" | "tomorrow" | "other" | "";
    timeLimit: string | undefined;
    arrivalDate: string | undefined;
    isCheckingDelivery: boolean;
}

export function getAddressIndicatorProps(
    bizClient: BizClient | null,
    deliveryInfo: DeliveryInfo
): AddressIndicatorProps {
    const { deliverySchedule, timeLimit, arrivalDate, isCheckingDelivery } = deliveryInfo;

    if (isCheckingDelivery) {
        return {
            address: bizClient?.road_address,
            deliverySchedule: "",
            timeLimit: "배송 정보 계산 중...",
            isLoading: true,
        };
    }

    if (!bizClient || !bizClient.road_address) {
        return {
            deliverySchedule: "",
        };
    }

    if (deliverySchedule === "today" && timeLimit) {
        return {
            address: bizClient.road_address,
            deliverySchedule: "today",
            timeLimit,
        };
    }

    if (deliverySchedule === "tomorrow" && timeLimit) {
        return {
            address: bizClient.road_address,
            deliverySchedule: "tomorrow",
            timeLimit,
        };
    }

    return {
        address: bizClient.road_address,
        deliverySchedule: "other",
        timeLimit,
        arrivalDate,
    };
}

