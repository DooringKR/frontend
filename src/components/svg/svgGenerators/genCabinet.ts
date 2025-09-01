import { CABINET_BASE_PARTS, CABINET_SHAPES_DATA } from "../svgData/cabinetData";
import { makePath } from "../svgCore/svgUtils";
import { ColorProps } from "../svgCore/svgTypes";

export function genCabinetSvg(colorProps: ColorProps = {}) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "1200");
  svg.setAttribute("height", "1200");
  svg.setAttribute("viewBox", "0 0 1200 1200");
  svg.setAttribute("fill", "none");

  // 공통
  CABINET_BASE_PARTS.forEach(part => svg.appendChild(makePath(part)));

  // 우측면, 윗면 등 파라미터화
  CABINET_SHAPES_DATA.forEach(shape => {
    svg.appendChild(makePath({
      ...shape,
      fill: colorProps[shape.key] ?? "url(#pattern0_6_20)" // default값 필요시
    }));
  });

  // 문, 기타 파트 등도 colorProps로 파라미터화 가능
  return svg;
}
