import { SvgPart } from "../svgCore/svgTypes";

// 서랍장-1 예시
export const DRAWER1_PARTS: SvgPart[] = [
  { d: "M464 240V720L260 864V384L464 240Z", fill: "#F3F4F6" },
  { d: "M260 864V384", fill: "none", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
  { d: "M860 336L464 240V720L860 816V336Z", fill: "#F3F4F6" },
  { d: "M464 720L260 864L656 960L860 816L464 720Z", fill: "#E3E3E3" },
  { d: "M464 240L260 384L656 480L860 336L464 240Z", fill: "url(#pattern0_6_54)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
  // ...생략(필요시 추가)
];
