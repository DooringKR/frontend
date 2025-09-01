import { SvgPart } from '../svgCore/svgTypes';

// 공통 바닥, 좌측, 뒷면(색상 하드코딩)
export const CABINET_BASE_PARTS: SvgPart[] = [
  { d: "M860 336L464 240V720L860 816V336Z", fill: "#F3F4F6", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
  { d: "M464 720L260 864L656 960L860 816L464 720Z", fill: "#F3F4F6", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
  { d: "M464 240V720L260 864V384L464 240Z", fill: "#F3F4F6", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
];

// 우측 면과 윗면은 파라미터화(아래에서 처리)
export const CABINET_SHAPES_DATA = [
  { key: 'right', d: "M656 480L860 336V816L656 960V480Z", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
  { key: 'top', d: "M464 240L260 384L656 480L860 336L464 240Z", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
];
// 문 등 부가 파트들도 필요시 만들어서 export.
