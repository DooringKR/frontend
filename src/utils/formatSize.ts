export default function formatSize(size: string | null) {
    if (!size) return "";
    // 숫자만 추출 후 천단위 콤마
    const num = Number(size.replace(/[^0-9]/g, ""));
    if (!num) return "";
    return num.toLocaleString() + "mm";
}