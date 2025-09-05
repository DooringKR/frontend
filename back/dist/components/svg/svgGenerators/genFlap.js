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
    const borings = flapDoorData_1.FLAP_DOOR_BORINGS[subtype];
    if (Array.isArray(borings)) {
        borings.forEach(({ cy }, i) => {
            svg.appendChild(require('../svgCore/svgUtils').makeText({
                x: dimPos.boringTextPos[i].x,
                y: dimPos.boringTextPos[i].y,
                text: boringValues && boringValues[i] !== undefined && boringValues[i] !== null
                    ? boringValues[i].toString()
                    : cy.toString(),
                fontSize: FONT_SIZE,
                anchor: dimPos.boringTextPos[i].anchor,
                fill: "black"
            }));
        });
    }
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
    // 보링 위치 및 원 그리기
    const flapBorings = flapDoorData_1.FLAP_DOOR_BORINGS[subtype];
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
