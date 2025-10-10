// Body material id -> name mapping for Edge Function
// Keep in sync with src/constants/bodymaterial.ts

type Item = { id: number; name: string };

const BODY_MATERIAL_LIST: Item[] = [
  { id: 1, name: "헤링본 PB 15T" },
  { id: 2, name: "헤링본 PB 18T" },
  { id: 3, name: "한솔 파타고니아크림 LPM 18T" },
  { id: 4, name: "직접입력" },
];

export function getBodyMaterialName(id: number | string | null | undefined): string | undefined {
  if (id === null || id === undefined) return undefined;
  const n = typeof id === 'number' ? id : parseInt(String(id), 10);
  if (Number.isNaN(n)) return undefined;
  return BODY_MATERIAL_LIST.find((x) => x.id === n)?.name;
}
