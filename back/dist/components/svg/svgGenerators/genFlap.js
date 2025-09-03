"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genFlapSvg = genFlapSvg;
// genFlap.ts
const flapDoorData_1 = require("../svgData/flapDoorData");
const svgUtils_1 = require("../svgCore/svgUtils");
const SVG_NS = "http://www.w3.org/2000/svg";
const FONT_SIZE = 50;
function insertFlapDimensionTexts(svg, subtype, size, boringValues) {
    const dimPos = flapDoorData_1.FLAP_DOOR_DIMENSION_POSITIONS[subtype];
    if (!dimPos)
        return;
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
    const borings = flapDoorData_1.FLAP_DOOR_BORINGS[subtype];
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
function genFlapSvg(subtype, color = {}, size = flapDoorData_1.FLAP_DOOR_RECT, boringValues) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", "1200");
    svg.setAttribute("height", "1200");
    svg.setAttribute("viewBox", "0 0 1200 1200");
    svg.setAttribute("fill", "none");
    svg.appendChild((0, svgUtils_1.makeRect)({ width: "1200", height: "1200", fill: "white" }));
    if (color.doorFillImageUrl) {
        const defs = document.createElementNS(SVG_NS, "defs");
        const pattern = document.createElementNS(SVG_NS, "pattern");
        const patternId = `pattern_${Math.random().toString(36).slice(2, 10)}`;
        pattern.setAttribute("id", patternId);
        pattern.setAttribute("patternUnits", "userSpaceOnUse");
        pattern.setAttribute("x", flapDoorData_1.FLAP_DOOR_RECT.x.toString());
        pattern.setAttribute("y", flapDoorData_1.FLAP_DOOR_RECT.y.toString());
        pattern.setAttribute("width", flapDoorData_1.FLAP_DOOR_RECT.width.toString());
        pattern.setAttribute("height", flapDoorData_1.FLAP_DOOR_RECT.height.toString());
        const image = document.createElementNS(SVG_NS, "image");
        image.setAttributeNS(null, "href", color.doorFillImageUrl);
        image.setAttribute("x", "0");
        image.setAttribute("y", "0");
        image.setAttribute("width", flapDoorData_1.FLAP_DOOR_RECT.width.toString());
        image.setAttribute("height", flapDoorData_1.FLAP_DOOR_RECT.height.toString());
        image.setAttribute("preserveAspectRatio", "none");
        pattern.appendChild(image);
        defs.appendChild(pattern);
        svg.appendChild(defs);
        svg.appendChild((0, svgUtils_1.makeRect)({
            x: flapDoorData_1.FLAP_DOOR_RECT.x.toString(),
            y: flapDoorData_1.FLAP_DOOR_RECT.y.toString(),
            width: flapDoorData_1.FLAP_DOOR_RECT.width.toString(),
            height: flapDoorData_1.FLAP_DOOR_RECT.height.toString(),
            fill: `url(#${patternId})`,
            stroke: "black",
            "stroke-width": "8",
        }));
    }
    else {
        svg.appendChild((0, svgUtils_1.makeRect)({
            x: flapDoorData_1.FLAP_DOOR_RECT.x.toString(),
            y: flapDoorData_1.FLAP_DOOR_RECT.y.toString(),
            width: flapDoorData_1.FLAP_DOOR_RECT.width.toString(),
            height: flapDoorData_1.FLAP_DOOR_RECT.height.toString(),
            fill: color.doorFill || "#ccc",
            stroke: "black",
            "stroke-width": "8",
        }));
    }
    flapDoorData_1.FLAP_DOOR_BORINGS[subtype].forEach(({ cx, cy, r }) => {
        const c = document.createElementNS(SVG_NS, "circle");
        c.setAttribute("cx", cx.toString());
        c.setAttribute("cy", cy.toString());
        c.setAttribute("r", r.toString());
        c.setAttribute("fill", "white");
        c.setAttribute("stroke", "black");
        c.setAttribute("stroke-width", "6");
        svg.appendChild(c);
    });
    insertFlapDimensionTexts(svg, subtype, size, boringValues);
    return svg;
}
