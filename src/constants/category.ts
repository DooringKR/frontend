 type Category = {
  name: string;
};

export const CATEGORY_LIST: Category[] = [
  { name: "문짝" },
  { name: "마감재" },
  { name: "부분장" },
  { name: "부속" },
  { name: "기타" },
];

export const categoryMap: Record<string, string> = {
  "문짝": "door",
  "마감재": "finish",
  "부분장": "cabinet",
  "부속": "accessory",
  "기타": "etc",
};