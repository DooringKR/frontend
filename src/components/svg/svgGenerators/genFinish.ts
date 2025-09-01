const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";

export function genFinishDoorSvg(width: number, height: number): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "1200");
  svg.setAttribute("height", "1200");
  svg.setAttribute("viewBox", "0 0 1200 1200");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", SVG_NS);
  svg.setAttribute("xmlns:xlink", XLINK_NS);

  // 배경
  const rectBg = document.createElementNS(SVG_NS, "rect");
  rectBg.setAttribute("width", "1200");
  rectBg.setAttribute("height", "1200");
  rectBg.setAttribute("fill", "white");
  svg.appendChild(rectBg);

  // 여기서는 간단히 width와 height 비교해서 배경색만 변경하는 예시
  // 실제는 아까 제시한 3가지 패턴을 조건에 따라 DOM 구성

  if (height > width) {
    // 세로 긴 패턴 사각형 (예시)
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("x", "396");
    rect.setAttribute("y", "196");
    rect.setAttribute("width", "408");
    rect.setAttribute("height", "808");
    rect.setAttribute("fill", "url(#pattern0_6_12)");
    rect.setAttribute("stroke", "black");
    rect.setAttribute("stroke-width", "8");
    svg.appendChild(rect);
  } else if (height === width) {
    // 정사각형 패턴
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M804 396V804H396V396H804Z");
    path.setAttribute("fill", "url(#pattern0_9_622)");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "8");
    svg.appendChild(path);
  } else {
    // 가로 긴 패턴
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M1004 396V804H196V396H1004Z");
    path.setAttribute("fill", "url(#pattern0_9_624)");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "8");
    svg.appendChild(path);
  }

  return svg;
}
