import { CABINET_CATEGORY_LIST } from "@/constants/category";

export function getCategoryLabel(category: string | null) {
  if (!category) return "부분장";
  const found = CABINET_CATEGORY_LIST.find(item => item.slug === category);
  return found ? found.header : "부분장";
}
