import { DRAWER1_PARTS } from "../svgData/drawerData";
import { makePath } from "../svgCore/svgUtils";

export function genDrawerSvg() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "1200");
  svg.setAttribute("height", "1200");
  svg.setAttribute("viewBox", "0 0 1200 1200");
  svg.setAttribute("fill", "none");

  DRAWER1_PARTS.forEach(part => svg.appendChild(makePath(part)));
  return svg;
}
