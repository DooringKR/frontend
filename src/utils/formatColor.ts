export default function formatColor(color: string | null) {
    if (!color) return "";
    if (color.includes(",")) {
        const parts = color.split(",").map(s => s.trim());
        // [자재, 브랜드, 두께, 색상] 순서라고 가정
        const label = [parts[1], parts[3]].filter(Boolean).join(" ");
        const description = [parts[0], parts[2]].filter(Boolean).join(" ");
        return `${label} (${description})`;
    }
    return color;
}