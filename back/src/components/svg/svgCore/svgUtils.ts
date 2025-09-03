import { SvgPart } from './svgTypes';

const SVG_NS = "http://www.w3.org/2000/svg";

export function makePath(part: SvgPart): SVGPathElement {
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', part.d);
  path.setAttribute('fill', part.fill);
  if (part.stroke) path.setAttribute('stroke', part.stroke);
  if (part.strokeWidth) path.setAttribute('stroke-width', part.strokeWidth);
  if (part.strokeLinejoin) path.setAttribute('stroke-linejoin', part.strokeLinejoin);
  return path;
}

export function makeRect(attribs: Record<string, string>): SVGRectElement {
  const rect = document.createElementNS(SVG_NS, 'rect');
  Object.entries(attribs).forEach(([k, v]) => rect.setAttribute(k, v));
  return rect;
}
