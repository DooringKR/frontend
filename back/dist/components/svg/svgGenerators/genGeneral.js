"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genGeneralDoorSvg = genGeneralDoorSvg;
const generalDoorData_1 = require("../svgData/generalDoorData");
const svgUtils_1 = require("../svgCore/svgUtils");
const SVG_NS = "http://www.w3.org/2000/svg";
const FONT_SIZE = 50;
function genGeneralDoorSvg(subtype, size, color = {}, boringValues) {
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
        // 문 사각형 영역(컨테이너)에 정확히 맞추는 설정
        pattern.setAttribute("id", patternId);
        pattern.setAttribute("patternUnits", "userSpaceOnUse");
        pattern.setAttribute("x", generalDoorData_1.DOOR_RECT.x.toString());
        pattern.setAttribute("y", generalDoorData_1.DOOR_RECT.y.toString());
        pattern.setAttribute("width", generalDoorData_1.DOOR_RECT.width.toString());
        pattern.setAttribute("height", generalDoorData_1.DOOR_RECT.height.toString());
        const image = document.createElementNS(SVG_NS, "image");
        // NormalDoorPreview의 '문 면적을 가득 채우기'와 동일한 효과
        image.setAttributeNS(null, "href", color.doorFillImageUrl);
        image.setAttribute("x", "0");
        image.setAttribute("y", "0");
        image.setAttribute("width", generalDoorData_1.DOOR_RECT.width.toString());
        image.setAttribute("height", generalDoorData_1.DOOR_RECT.height.toString());
        image.setAttribute("preserveAspectRatio", "none"); // 비율 고정 해제하여 꽉 채움
        pattern.appendChild(image);
        defs.appendChild(pattern);
        svg.appendChild(defs);
        const doorRect = (0, svgUtils_1.makeRect)({
            x: generalDoorData_1.DOOR_RECT.x.toString(),
            y: generalDoorData_1.DOOR_RECT.y.toString(),
            width: generalDoorData_1.DOOR_RECT.width.toString(),
            height: generalDoorData_1.DOOR_RECT.height.toString(),
            fill: `url(#${patternId})`,
            stroke: "black",
            "stroke-width": "8",
        });
        svg.appendChild(doorRect);
    }
    else {
        const fillColor = color.doorFill || color.fallbackColor || "#ccc";
        const doorRect = (0, svgUtils_1.makeRect)({
            x: generalDoorData_1.DOOR_RECT.x.toString(),
            y: generalDoorData_1.DOOR_RECT.y.toString(),
            width: generalDoorData_1.DOOR_RECT.width.toString(),
            height: generalDoorData_1.DOOR_RECT.height.toString(),
            fill: fillColor,
            stroke: "black",
            "stroke-width": "8",
        });
        svg.appendChild(doorRect);
    }
    if (generalDoorData_1.GENERAL_DOOR_BORINGS[subtype]) {
        generalDoorData_1.GENERAL_DOOR_BORINGS[subtype].forEach(({ cx, cy, r }) => {
            const circle = document.createElementNS(SVG_NS, "circle");
            circle.setAttribute("cx", cx.toString());
            circle.setAttribute("cy", cy.toString());
            circle.setAttribute("r", r.toString());
            circle.setAttribute("fill", "white");
            circle.setAttribute("stroke", "black");
            circle.setAttribute("stroke-width", "6");
            svg.appendChild(circle);
        });
    }
    // 치수/보링 텍스트 추가
    const dimPos = generalDoorData_1.DOOR_DIMENSION_POSITIONS[subtype];
    if (dimPos) {
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
        generalDoorData_1.GENERAL_DOOR_BORINGS[subtype].forEach(({ cy }, i) => {
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
    return svg;
}
