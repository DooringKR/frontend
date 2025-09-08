// 마감재 색상/패턴 정보 (실제 패턴 SVG 코드/ID 등)
export type FinishMaterial = { id: string; label: string; pattern: string };
export const FINISH_MATERIALS: FinishMaterial[] = [
  { id: "pattern0_6_48", label: "화이트우드", pattern: "url(#pattern0_6_48)" },
  { id: "solid_white", label: "단색화이트", pattern: "#ffffff" },
  // 기타 마감재 추가
];
