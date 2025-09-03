"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genMaedaDoorSvg = genMaedaDoorSvg;
// genMaeda.ts
const maedaDoorData_1 = require("../svgData/maedaDoorData");
const svgUtils_1 = require("../svgCore/svgUtils");
const SVG_NS = "http://www.w3.org/2000/svg";
const FONT_SIZE = 50;
const VERTICAL_TEXT_OFFSET = 30;
const HORIZONTAL_TEXT_OFFSET = 20;
const MAEDA_DIMENSION_POSITIONS = {
    '마에다1': {
        verticalPos: {
            x: maedaDoorData_1.MAEDA_DOOR_RECTS['마에다1'].x + maedaDoorData_1.MAEDA_DOOR_RECTS['마에다1'].width + VERTICAL_TEXT_OFFSET,
            y: maedaDoorData_1.MAEDA_DOOR_RECTS['마에다1'].y + maedaDoorData_1.MAEDA_DOOR_RECTS['마에다1'].height / 2,
            anchor: 'start',
        },
        horizontalPos: {
            x: maedaDoorData_1.MAEDA_DOOR_RECTS['마에다1'].x + maedaDoorData_1.MAEDA_DOOR_RECTS['마에다1'].width / 2,
            y: maedaDoorData_1.MAEDA_DOOR_RECTS['마에다1'].y + maedaDoorData_1.MAEDA_DOOR_RECTS['마에다1'].height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
            anchor: 'middle',
        },
        boringTextPos: [],
    },
    '마에다2': {
        verticalPos: {
            x: maedaDoorData_1.MAEDA_DOOR_RECTS['마에다2'].x + maedaDoorData_1.MAEDA_DOOR_RECTS['마에다2'].width + VERTICAL_TEXT_OFFSET,
            y: maedaDoorData_1.MAEDA_DOOR_RECTS['마에다2'].y + maedaDoorData_1.MAEDA_DOOR_RECTS['마에다2'].height / 2,
            anchor: 'start',
        },
        horizontalPos: {
            x: maedaDoorData_1.MAEDA_DOOR_RECTS['마에다2'].x + maedaDoorData_1.MAEDA_DOOR_RECTS['마에다2'].width / 2,
            y: maedaDoorData_1.MAEDA_DOOR_RECTS['마에다2'].y + maedaDoorData_1.MAEDA_DOOR_RECTS['마에다2'].height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
            anchor: 'middle',
        },
        boringTextPos: [],
    },
    '마에다3': {
        verticalPos: {
            x: maedaDoorData_1.MAEDA_DOOR_RECTS['마에다3'].x + maedaDoorData_1.MAEDA_DOOR_RECTS['마에다3'].width + VERTICAL_TEXT_OFFSET,
            y: maedaDoorData_1.MAEDA_DOOR_RECTS['마에다3'].y + maedaDoorData_1.MAEDA_DOOR_RECTS['마에다3'].height / 2,
            anchor: 'start',
        },
        horizontalPos: {
            x: maedaDoorData_1.MAEDA_DOOR_RECTS['마에다3'].x + maedaDoorData_1.MAEDA_DOOR_RECTS['마에다3'].width / 2,
            y: maedaDoorData_1.MAEDA_DOOR_RECTS['마에다3'].y + maedaDoorData_1.MAEDA_DOOR_RECTS['마에다3'].height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
            anchor: 'middle',
        },
        boringTextPos: [],
    },
};
function genMaedaDoorSvg(size, color = {}) {
    // 가로세로 길이에 따라 subtype 결정
    let subtype;
    if (size.height > size.width)
        subtype = '마에다1';
    else if (size.height === size.width)
        subtype = '마에다2';
    else
        subtype = '마에다3';
    const rect = maedaDoorData_1.MAEDA_DOOR_RECTS[subtype];
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", "1200");
    svg.setAttribute("height", "1200");
    svg.setAttribute("viewBox", "0 0 1200 1200");
    svg.setAttribute("fill", "none");
    // 배경 흰색
    svg.appendChild((0, svgUtils_1.makeRect)({ width: "1200", height: "1200", fill: "white" }));
    // 색상 또는 패턴 이미지 URL 처리
    let fillValue = color.doorFill || rect.fillPatternId;
    if (color.doorFill && (color.doorFill.startsWith("http") || color.doorFill.startsWith("/"))) {
        const defs = document.createElementNS(SVG_NS, "defs");
        const pattern = document.createElementNS(SVG_NS, "pattern");
        const patternId = `pattern_${Math.random().toString(36).slice(2, 10)}`;
        pattern.setAttribute("id", patternId);
        pattern.setAttribute("patternUnits", "userSpaceOnUse");
        pattern.setAttribute("x", rect.x.toString());
        pattern.setAttribute("y", rect.y.toString());
        pattern.setAttribute("width", rect.width.toString());
        pattern.setAttribute("height", rect.height.toString());
        const image = document.createElementNS(SVG_NS, "image");
        image.setAttributeNS(null, "href", color.doorFill);
        image.setAttribute("x", "0");
        image.setAttribute("y", "0");
        image.setAttribute("width", rect.width.toString());
        image.setAttribute("height", rect.height.toString());
        image.setAttribute("preserveAspectRatio", "none");
        pattern.appendChild(image);
        defs.appendChild(pattern);
        svg.appendChild(defs);
        fillValue = `url(#${patternId})`;
    }
    svg.appendChild((0, svgUtils_1.makeRect)({
        x: rect.x.toString(),
        y: rect.y.toString(),
        width: rect.width.toString(),
        height: rect.height.toString(),
        fill: fillValue,
        stroke: "black",
        "stroke-width": "8",
    }));
    insertDimensionTexts(svg, subtype, size);
    return svg;
}
function insertDimensionTexts(svg, subtype, size) {
    const dimPos = MAEDA_DIMENSION_POSITIONS[subtype];
    if (!dimPos)
        return;
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
}
