// genFlap.ts
import { FLAP_DOOR_RECT, FLAP_DOOR_BORINGS, FlapDoorSubtype, FLAP_DOOR_DIMENSION_POSITIONS } from "../svgData/flapDoorData";
import { makeRect } from "../svgCore/svgUtils";

type FlapColorProps = {
  doorFill?: string;
  doorFillImageUrl?: string;
};

const SVG_NS = "http://www.w3.org/2000/svg";
const FONT_SIZE = 50;

function insertFlapDimensionTexts(
  svg: SVGSVGElement,
  subtype: FlapDoorSubtype,
  size: { width: number; height: number },
  boringValues?: (number | null)[]
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
  color: FlapColorProps = {},
  size: { width: number; height: number } = FLAP_DOOR_RECT,
  boringValues?: (number | null)[]
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
    svg.appendChild(
      makeRect({
        x: FLAP_DOOR_RECT.x.toString(),
        y: FLAP_DOOR_RECT.y.toString(),
        width: FLAP_DOOR_RECT.width.toString(),
        height: FLAP_DOOR_RECT.height.toString(),
        fill: color.doorFill || "#ccc",
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
  }

  insertFlapDimensionTexts(svg, subtype, size, boringValues);

  return svg;
}
