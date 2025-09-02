export default function formatLocation(value: string): string {
    const locationMap: Record<string, string> = {
        KITCHEN: "주방",
        SHOES: "신발장",
        BUILT_IN: "붙박이장",
        ETC: "기타 수납장",
        BALCONY: "발코니 창고문",
    };
    return locationMap[value] || value;
} 