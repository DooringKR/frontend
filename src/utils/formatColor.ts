export default function formatColor(color: string | null | undefined) {
  if (!color) return "";
  if (color.includes(",")) {
    const parts = color.split(",").map(s => s.trim());
    // [자재, 브랜드, 두께, 색상] 순서라고 가정
    const label = [parts[1], parts[3]].filter(Boolean).join(" ");
    const description = [parts[0], parts[2]].filter(Boolean).join(" ");
    if (label && description) return `${label} (${description})`;
    if (label) return label;
    if (description) return description;
    return color;
  }
  return color;
}
