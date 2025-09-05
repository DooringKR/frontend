// genFlap.ts
import { FLAP_DOOR_RECT, FLAP_DOOR_BORINGS, FlapDoorSubtype, FLAP_DOOR_DIMENSION_POSITIONS } from "../svgData/flapDoorData";
import { makeRect } from "../svgCore/svgUtils";

type ColorProps = {
  doorFill?: string;
  doorFillImageUrl?: string;
  fallbackColor?: string;
};

const SVG_NS = "http://www.w3.org/2000/svg";
const FONT_SIZE = 50;

function insertFlapDimensionTexts(
  svg: SVGSVGElement,
  subtype: FlapDoorSubtype,
  size: { width: number; height: number },
  boringValues?: number[]
) {
  const dimPos = FLAP_DOOR_DIMENSION_POSITIONS[subtype];
  if (!dimPos) return;

  // 치수 텍스트
  svg.appendChild(require('../svgCore/svgUtils').makeText({
    x: dimPos.verticalPos.x,
    y: dimPos.verticalPos.y,
    text: size.height?.toString() || "",
    fontSize: FONT_SIZE,
    anchor: dimPos.verticalPos.anchor,
    fill: "black"
  }));
  svg.appendChild(require('../svgCore/svgUtils').makeText({
    x: dimPos.horizontalPos.x,
    y: dimPos.horizontalPos.y,
    text: size.width?.toString() || "",
    fontSize: FONT_SIZE,
    anchor: dimPos.horizontalPos.anchor,
    fill: "black"
  }));

  // 보링 텍스트
  const borings = FLAP_DOOR_BORINGS[subtype];
  if (Array.isArray(borings)) {
    borings.forEach(({ cy }, i) => {
      svg.appendChild(require('../svgCore/svgUtils').makeText({
        x: dimPos.boringTextPos[i].x,
        y: dimPos.boringTextPos[i].y,
        text:
          boringValues && boringValues[i] !== undefined && boringValues[i] !== null
            ? boringValues[i].toString()
            : cy.toString(),
        fontSize: FONT_SIZE,
        anchor: dimPos.boringTextPos[i].anchor,
        fill: "black"
      }));
    });
  }
}

export function genFlapSvg(
  subtype: FlapDoorSubtype,
  size: { width: number; height: number } = FLAP_DOOR_RECT,
  color: ColorProps = {},
  boringValues?: number[]
): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "1200");
  svg.setAttribute("height", "1200");
  svg.setAttribute("viewBox", "0 0 1200 1200");
  svg.setAttribute("fill", "none");

  svg.appendChild(makeRect({ width: "1200", height: "1200", fill: "white" }));

  // 문 면적 채우기 (이미지 패턴 또는 색상)
  if (color.doorFillImageUrl) {
    const defs = document.createElementNS(SVG_NS, "defs");
    const pattern = document.createElementNS(SVG_NS, "pattern");
    const patternId = `pattern_${Math.random().toString(36).slice(2, 10)}`;
    pattern.setAttribute("id", patternId);
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("x", FLAP_DOOR_RECT.x.toString());
    pattern.setAttribute("y", FLAP_DOOR_RECT.y.toString());
    pattern.setAttribute("width", FLAP_DOOR_RECT.width.toString());
    pattern.setAttribute("height", FLAP_DOOR_RECT.height.toString());

    const image = document.createElementNS(SVG_NS, "image");
    image.setAttributeNS(null, "href", color.doorFillImageUrl);
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    image.setAttribute("width", FLAP_DOOR_RECT.width.toString());
    image.setAttribute("height", FLAP_DOOR_RECT.height.toString());
    image.setAttribute("preserveAspectRatio", "none");

    pattern.appendChild(image);
    defs.appendChild(pattern);
    svg.appendChild(defs);

    svg.appendChild(
      makeRect({
        x: FLAP_DOOR_RECT.x.toString(),
        y: FLAP_DOOR_RECT.y.toString(),
        width: FLAP_DOOR_RECT.width.toString(),
        height: FLAP_DOOR_RECT.height.toString(),
        fill: `url(#${patternId})`,
        stroke: "black",
        "stroke-width": "8",
      })
    );
  } else {
    // 색상 정보가 없으면 doorFill 또는 흰색으로 채움
    const fillColor = color.doorFill || "white";
    svg.appendChild(
      makeRect({
        x: FLAP_DOOR_RECT.x.toString(),
        y: FLAP_DOOR_RECT.y.toString(),
        width: FLAP_DOOR_RECT.width.toString(),
        height: FLAP_DOOR_RECT.height.toString(),
        fill: fillColor,
        stroke: "black",
        "stroke-width": "8",
      })
    );
  }

  // 보링 위치 및 원 그리기
  const flapBorings = FLAP_DOOR_BORINGS[subtype];
  if (Array.isArray(flapBorings)) {
    flapBorings.forEach(({ cx, cy, r }) => {
      const c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("cx", cx.toString());
      c.setAttribute("cy", cy.toString());
      c.setAttribute("r", r.toString());
      c.setAttribute("fill", "white");
      c.setAttribute("stroke", "black");
      c.setAttribute("stroke-width", "6");
      svg.appendChild(c);
    });
  } else {
    // flapBorings가 없으면 아무것도 그리지 않음
    console.warn("[genFlapSvg] flapBorings가 없음", subtype);
  }

  // 치수 텍스트와 보링 텍스트 추가 (직접 SVG <text> 요소 생성)
  const dimPos = FLAP_DOOR_DIMENSION_POSITIONS[subtype];
  if (dimPos) {
    // 세로 치수
    const verticalText = document.createElementNS(SVG_NS, "text");
    verticalText.setAttribute("x", dimPos.verticalPos.x.toString());
    verticalText.setAttribute("y", dimPos.verticalPos.y.toString());
    verticalText.setAttribute("fill", "black");
    verticalText.style.fontSize = `${FONT_SIZE}px`;
    verticalText.style.dominantBaseline = "middle";
    verticalText.style.textAnchor = dimPos.verticalPos.anchor;
    verticalText.textContent = size.height?.toString() || "";
    svg.appendChild(verticalText);

    // 가로 치수
    const horizontalText = document.createElementNS(SVG_NS, "text");
    horizontalText.setAttribute("x", dimPos.horizontalPos.x.toString());
    horizontalText.setAttribute("y", dimPos.horizontalPos.y.toString());
    horizontalText.setAttribute("fill", "black");
    horizontalText.style.fontSize = `${FONT_SIZE}px`;
    horizontalText.style.textAnchor = dimPos.horizontalPos.anchor;
    horizontalText.textContent = size.width?.toString() || "";
    svg.appendChild(horizontalText);

    // 보링 텍스트
    if (Array.isArray(flapBorings)) {
      flapBorings.forEach(({ cy }, i) => {
        const boringText = document.createElementNS(SVG_NS, "text");
        boringText.setAttribute("x", dimPos.boringTextPos[i].x.toString());
        boringText.setAttribute("y", dimPos.boringTextPos[i].y.toString());
        boringText.setAttribute("fill", "black");
        boringText.style.fontSize = `${FONT_SIZE}px`;
        boringText.style.dominantBaseline = "middle";
        boringText.style.textAnchor = dimPos.boringTextPos[i].anchor;
        boringText.textContent =
          boringValues && boringValues[i] !== undefined && boringValues[i] !== null
            ? boringValues[i]?.toString()
            : cy.toString();
        svg.appendChild(boringText);
      });
    }
  }

  return svg;
}
