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

  const verticalText = document.createElementNS(SVG_NS, "text");
  verticalText.setAttribute("x", dimPos.verticalPos.x.toString());
  verticalText.setAttribute("y", dimPos.verticalPos.y.toString());
  verticalText.setAttribute("fill", "black");
  verticalText.style.fontSize = `${FONT_SIZE}px`;
  verticalText.style.dominantBaseline = "middle";
  verticalText.style.textAnchor = dimPos.verticalPos.anchor;
  verticalText.textContent = size.height?.toString() || "";
  svg.appendChild(verticalText);

  const horizontalText = document.createElementNS(SVG_NS, "text");
  horizontalText.setAttribute("x", dimPos.horizontalPos.x.toString());
  horizontalText.setAttribute("y", dimPos.horizontalPos.y.toString());
  horizontalText.setAttribute("fill", "black");
  horizontalText.style.fontSize = `${FONT_SIZE}px`;
  horizontalText.style.textAnchor = dimPos.horizontalPos.anchor;
  horizontalText.textContent = size.width?.toString() || "";
  svg.appendChild(horizontalText);

  const borings = FLAP_DOOR_BORINGS[subtype];
  if (Array.isArray(borings)) {
    borings.forEach(({ cy }, i) => {
      const boringText = document.createElementNS(SVG_NS, "text");
      boringText.setAttribute("x", dimPos.boringTextPos[i].x.toString());
      boringText.setAttribute("y", dimPos.boringTextPos[i].y.toString());
      boringText.setAttribute("fill", "black");
      boringText.style.fontSize = `${FONT_SIZE}px`;
      boringText.style.dominantBaseline = "middle";
      boringText.style.textAnchor = dimPos.boringTextPos[i].anchor;
      boringText.textContent =
        boringValues && boringValues[i] !== undefined && boringValues[i] !== null
          ? boringValues[i].toString()
          : cy.toString();
      svg.appendChild(boringText);
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
  }

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
