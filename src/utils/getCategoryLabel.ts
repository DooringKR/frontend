export function getCategoryLabel(
  category: string | null,
  list: { slug: string; name?: string; header?: string }[],
  fallback = "기타",
) {
  if (!category) return fallback;
  const normalized = category.toLowerCase(); // ← 대소문자 무시
  const found = list.find(item => item.slug === normalized);
  return found?.header ?? found?.name ?? fallback;
}
