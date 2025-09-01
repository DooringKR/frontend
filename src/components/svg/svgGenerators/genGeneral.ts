import { DOOR_RECT, GENERAL_DOOR_BORINGS, DOOR_DIMENSION_POSITIONS, GeneralDoorSubtype } from "../svgData/generalDoorData";
import { makeRect } from "../svgCore/svgUtils";

type ColorProps = {
  doorFill?: string;          // 패턴 ID 혹은 단색 색상 문자열
  doorFillImageUrl?: string;  // 이미지 패턴 URL
  fallbackColor?: string;     // 이미지 없을 경우 단색 대체
};

type Size = { width: number; height: number };

const SVG_NS = "http://www.w3.org/2000/svg";
const FONT_SIZE = 50;

export function genGeneralDoorSvg(
  subtype: GeneralDoorSubtype,
  size: Size,
  color: ColorProps = {}, 
  boringValues?: number[]
): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "1200");
  svg.setAttribute("height", "1200");
  svg.setAttribute("viewBox", "0 0 1200 1200");
  svg.setAttribute("fill", "none");

  svg.appendChild(makeRect({ width: "1200", height: "1200", fill: "white" }));

  if (color.doorFillImageUrl) {
    const defs = document.createElementNS(SVG_NS, "defs");
    const pattern = document.createElementNS(SVG_NS, "pattern");
    const patternId = `pattern_${Math.random().toString(36).slice(2, 10)}`;

    // 문 사각형 영역(컨테이너)에 정확히 맞추는 설정
    pattern.setAttribute("id", patternId);
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("x", DOOR_RECT.x.toString());
    pattern.setAttribute("y", DOOR_RECT.y.toString());
    pattern.setAttribute("width", DOOR_RECT.width.toString());
    pattern.setAttribute("height", DOOR_RECT.height.toString());

    const image = document.createElementNS(SVG_NS, "image");
    // NormalDoorPreview의 '문 면적을 가득 채우기'와 동일한 효과
    image.setAttributeNS(null, "href", color.doorFillImageUrl);
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    image.setAttribute("width", DOOR_RECT.width.toString());
    image.setAttribute("height", DOOR_RECT.height.toString());
    image.setAttribute("preserveAspectRatio", "none"); // 비율 고정 해제하여 꽉 채움

    pattern.appendChild(image);
    defs.appendChild(pattern);
    svg.appendChild(defs);

    const doorRect = makeRect({
      x: DOOR_RECT.x.toString(),
      y: DOOR_RECT.y.toString(),
      width: DOOR_RECT.width.toString(),
      height: DOOR_RECT.height.toString(),
      fill: `url(#${patternId})`,
      stroke: "black",
      "stroke-width": "8",
    });
    svg.appendChild(doorRect);
  } else {
    const fillColor = color.doorFill || color.fallbackColor || "#ccc";
    const doorRect = makeRect({
      x: DOOR_RECT.x.toString(),
      y: DOOR_RECT.y.toString(),
      width: DOOR_RECT.width.toString(),
      height: DOOR_RECT.height.toString(),
      fill: fillColor,
      stroke: "black",
      "stroke-width": "8",
    });
    svg.appendChild(doorRect);
  }


  GENERAL_DOOR_BORINGS[subtype].forEach(({ cx, cy, r }) => {
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", cx.toString());
    circle.setAttribute("cy", cy.toString());
    circle.setAttribute("r", r.toString());
    circle.setAttribute("fill", "white");
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "6");
    svg.appendChild(circle);
  });

  insertDimensionTexts(svg, subtype, size, boringValues);

  return svg;
}



function insertDimensionTexts(
  svg: SVGSVGElement,
  subtype: GeneralDoorSubtype,
  size: Size,
  boringValues?: number[]
) {
  const dimPos = DOOR_DIMENSION_POSITIONS[subtype];
  if (!dimPos) return;

  const verticalText = document.createElementNS(SVG_NS, "text");
  verticalText.setAttribute("x", dimPos.verticalPos.x.toString());
  verticalText.setAttribute("y", dimPos.verticalPos.y.toString());
  verticalText.setAttribute("fill", "black");
  verticalText.style.fontSize = `${FONT_SIZE}px`;
  verticalText.style.dominantBaseline = "middle";
  verticalText.style.textAnchor = dimPos.verticalPos.anchor;
  verticalText.textContent = size.height.toString();
  svg.appendChild(verticalText);

  const horizontalText = document.createElementNS(SVG_NS, "text");
  horizontalText.setAttribute("x", dimPos.horizontalPos.x.toString());
  horizontalText.setAttribute("y", dimPos.horizontalPos.y.toString());
  horizontalText.setAttribute("fill", "black");
  horizontalText.style.fontSize = `${FONT_SIZE}px`;
  horizontalText.style.textAnchor = dimPos.horizontalPos.anchor;
  horizontalText.textContent = size.width.toString();
  svg.appendChild(horizontalText);

  GENERAL_DOOR_BORINGS[subtype].forEach(({ cy }, i) => {
    const boringText = document.createElementNS(SVG_NS, "text");
    boringText.setAttribute("x", dimPos.boringTextPos[i].x.toString());
    boringText.setAttribute("y", dimPos.boringTextPos[i].y.toString());
    boringText.setAttribute("fill", "black");
    boringText.style.fontSize = `${FONT_SIZE}px`;
    boringText.style.dominantBaseline = "middle";
    boringText.style.textAnchor = dimPos.boringTextPos[i].anchor;
    boringText.textContent = boringValues && boringValues[i] !== undefined ? boringValues[i].toString() : cy.toString();
    svg.appendChild(boringText);
  });
}
