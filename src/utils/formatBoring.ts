export function formatBoring(boringSize: (number | null)[], category?: string | null) {
  if (!boringSize || !Array.isArray(boringSize)) return "";

  const arr = boringSize;

  let labelMap: string[][];
  if (category === "flap") {
    labelMap = [
      ["좌", "우"],
      ["좌", "중", "우"],
      ["좌", "중좌", "중우", "우"],
    ];
  } else {
    labelMap = [
      ["상", "하"],
      ["상", "중", "하"],
      ["상", "중상", "중하", "하"],
    ];
  }

  const label = labelMap[arr.length - 2];
  if (!label) return arr.join(", ");
  return arr
    .map((v, i) => (v !== null && v !== undefined ? `${label[i]}${v}` : null))
    .filter(Boolean)
    .join(", ");
}

export function formatBoringDirection(dir: string | null) {
  if (dir === "left") return "좌경";
  if (dir === "right") return "우경";
  return dir ?? "";
}
