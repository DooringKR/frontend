"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genFinishDoorSvg = genFinishDoorSvg;
const SVG_NS = "http://www.w3.org/2000/svg";
// 마감재 3종류별 이미지 패턴 경로 (예시, 실제 경로로 교체 필요)
const FINISH_IMAGE_PATHS = {
    vertical: "/img/finish/vertical.png", // 세로형
    square: "/img/finish/square.png", // 정사각형
    horizontal: "/img/finish/horizontal.png", // 가로형
};
const FINISH_SHAPES = {
    vertical: {
        type: "rect",
        x: 396, y: 196, width: 408, height: 808,
    },
    square: {
        type: "path",
        d: "M804 396V804H396V396H804Z",
    },
    horizontal: {
        type: "path",
        d: "M1004 396V804H196V396H1004Z",
    },
};
const FONT_SIZE = 50;
function genFinishDoorSvg(width, height, colorOrImage) {
    // 1. 타입 결정
    let type;
    if (height > width)
        type = "vertical";
    else if (height === width)
        type = "square";
    else
        type = "horizontal";
    // 2. SVG 생성
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", "1200");
    svg.setAttribute("height", "1200");
    svg.setAttribute("viewBox", "0 0 1200 1200");
    svg.setAttribute("fill", "none");
    // 3. 배경
    const rectBg = document.createElementNS(SVG_NS, "rect");
    rectBg.setAttribute("width", "1200");
    rectBg.setAttribute("height", "1200");
    rectBg.setAttribute("fill", "white");
    svg.appendChild(rectBg);
    // 4. 패턴/색상 처리 (마에다 방식 참조)
    // colorOrImage.imageUrl이 있으면 해당 이미지를, 없으면 fallbackColor(또는 기본색상)를 fill로 사용
    let fillValue = colorOrImage?.fallbackColor || "#eee";
    let patternId;
    // colorOrImage.imageUrl이 있으면 그 이미지를, 없으면 FINISH_IMAGE_PATHS[type] 사용
    const imageUrl = colorOrImage?.imageUrl || undefined;
    if (imageUrl) {
        patternId = `finish_pattern_${Math.random().toString(36).slice(2, 10)}`;
        const defs = document.createElementNS(SVG_NS, "defs");
        const pattern = document.createElementNS(SVG_NS, "pattern");
        pattern.setAttribute("id", patternId);
        pattern.setAttribute("patternUnits", "userSpaceOnUse");
        if (type === "vertical") {
            pattern.setAttribute("x", "396");
            pattern.setAttribute("y", "196");
            pattern.setAttribute("width", "408");
            pattern.setAttribute("height", "808");
        }
        else if (type === "square") {
            pattern.setAttribute("x", "396");
            pattern.setAttribute("y", "396");
            pattern.setAttribute("width", "408");
            pattern.setAttribute("height", "408");
        }
        else {
            pattern.setAttribute("x", "196");
            pattern.setAttribute("y", "396");
            pattern.setAttribute("width", "808");
            pattern.setAttribute("height", "408");
        }
        const image = document.createElementNS(SVG_NS, "image");
        image.setAttributeNS(null, "href", imageUrl);
        image.setAttribute("x", "0");
        image.setAttribute("y", "0");
        if (type === "vertical") {
            image.setAttribute("width", "408");
            image.setAttribute("height", "808");
        }
        else if (type === "square") {
            image.setAttribute("width", "408");
            image.setAttribute("height", "408");
        }
        else {
            image.setAttribute("width", "808");
            image.setAttribute("height", "408");
        }
        image.setAttribute("preserveAspectRatio", "none");
        pattern.appendChild(image);
        defs.appendChild(pattern);
        svg.appendChild(defs);
        fillValue = `url(#${patternId})`;
    }
    // 5. 메인 도형 및 세부 path/rect
    const shape = FINISH_SHAPES[type];
    let mainShape;
    if (shape.type === "rect") {
        mainShape = document.createElementNS(SVG_NS, "rect");
        const rectShape = shape;
        mainShape.setAttribute("x", rectShape.x.toString());
        mainShape.setAttribute("y", rectShape.y.toString());
        mainShape.setAttribute("width", rectShape.width.toString());
        mainShape.setAttribute("height", rectShape.height.toString());
        mainShape.setAttribute("fill", fillValue);
        mainShape.setAttribute("stroke", "black");
        mainShape.setAttribute("stroke-width", "8");
    }
    else {
        mainShape = document.createElementNS(SVG_NS, "path");
        const pathShape = shape;
        mainShape.setAttribute("d", pathShape.d);
        mainShape.setAttribute("fill", fillValue);
        mainShape.setAttribute("stroke", "black");
        mainShape.setAttribute("stroke-width", "8");
    }
    svg.appendChild(mainShape);
    // 6. 세부 강조(첨부 SVG 참고, 세로형/정사각형/가로형 모두 빨간 몰딩 추가)
    if (type === "vertical") {
        // ...기존 세로형 강조 코드 그대로...
        const mask = document.createElementNS(SVG_NS, "mask");
        mask.setAttribute("id", "path-2-outside-1_6_12");
        mask.setAttribute("maskUnits", "userSpaceOnUse");
        mask.setAttribute("x", "756");
        mask.setAttribute("y", "200");
        mask.setAttribute("width", "44");
        mask.setAttribute("height", "800");
        mask.setAttribute("fill", "black");
        const maskRect = document.createElementNS(SVG_NS, "rect");
        maskRect.setAttribute("fill", "white");
        maskRect.setAttribute("x", "756");
        maskRect.setAttribute("y", "200");
        maskRect.setAttribute("width", "44");
        maskRect.setAttribute("height", "800");
        const maskPath = document.createElementNS(SVG_NS, "path");
        maskPath.setAttribute("d", "M760 200H800V1000H760V200Z");
        mask.appendChild(maskRect);
        mask.appendChild(maskPath);
        svg.appendChild(mask);
        const path1 = document.createElementNS(SVG_NS, "path");
        path1.setAttribute("d", "M760 200H800V1000H760V200Z");
        path1.setAttribute("fill", "#FF0000");
        path1.setAttribute("fill-opacity", "0.2");
        svg.appendChild(path1);
        const path2 = document.createElementNS(SVG_NS, "path");
        path2.setAttribute("d", "M760 1000H764V200H760H756V1000H760Z");
        path2.setAttribute("fill", "#FF0000");
        path2.setAttribute("fill-opacity", "0.4");
        path2.setAttribute("mask", "url(#path-2-outside-1_6_12)");
        svg.appendChild(path2);
        // 하단 강조
        const mask2 = document.createElementNS(SVG_NS, "mask");
        mask2.setAttribute("id", "path-4-outside-2_6_12");
        mask2.setAttribute("maskUnits", "userSpaceOnUse");
        mask2.setAttribute("x", "400");
        mask2.setAttribute("y", "976");
        mask2.setAttribute("width", "400");
        mask2.setAttribute("height", "24");
        mask2.setAttribute("fill", "black");
        const mask2Rect = document.createElementNS(SVG_NS, "rect");
        mask2Rect.setAttribute("fill", "white");
        mask2Rect.setAttribute("x", "400");
        mask2Rect.setAttribute("y", "976");
        mask2Rect.setAttribute("width", "400");
        mask2Rect.setAttribute("height", "24");
        const mask2Path = document.createElementNS(SVG_NS, "path");
        mask2Path.setAttribute("d", "M400 980H800V1000H400V980Z");
        mask2.appendChild(mask2Rect);
        mask2.appendChild(mask2Path);
        svg.appendChild(mask2);
        const path3 = document.createElementNS(SVG_NS, "path");
        path3.setAttribute("d", "M400 980H800V1000H400V980Z");
        path3.setAttribute("fill", "#FF0000");
        path3.setAttribute("fill-opacity", "0.2");
        svg.appendChild(path3);
        const path4 = document.createElementNS(SVG_NS, "path");
        path4.setAttribute("d", "M400 980V984H800V980V976H400V980Z");
        path4.setAttribute("fill", "#FF0000");
        path4.setAttribute("fill-opacity", "0.4");
        path4.setAttribute("mask", "url(#path-4-outside-2_6_12)");
        svg.appendChild(path4);
    }
    else if (type === "square") {
        // 정사각형 우측 몰딩 (첨부 SVG와 동일하게 마스킹 적용)
        // mask: x=776, y=400, width=24, height=400, path: M780 400H800V800H780V400Z
        const maskR = document.createElementNS(SVG_NS, "mask");
        maskR.setAttribute("id", "path-3-outside-1_9_622");
        maskR.setAttribute("maskUnits", "userSpaceOnUse");
        maskR.setAttribute("x", "776");
        maskR.setAttribute("y", "400");
        maskR.setAttribute("width", "24");
        maskR.setAttribute("height", "400");
        maskR.setAttribute("fill", "black");
        const maskRRect = document.createElementNS(SVG_NS, "rect");
        maskRRect.setAttribute("fill", "white");
        maskRRect.setAttribute("x", "776");
        maskRRect.setAttribute("y", "400");
        maskRRect.setAttribute("width", "24");
        maskRRect.setAttribute("height", "400");
        const maskRPath = document.createElementNS(SVG_NS, "path");
        maskRPath.setAttribute("d", "M780 400H800V800H780V400Z");
        maskR.appendChild(maskRRect);
        maskR.appendChild(maskRPath);
        svg.appendChild(maskR);
        // 연한 빨강 우측
        const pathR1 = document.createElementNS(SVG_NS, "path");
        pathR1.setAttribute("d", "M780 400H800V800H780V400Z");
        pathR1.setAttribute("fill", "#FF0000");
        pathR1.setAttribute("fill-opacity", "0.2");
        svg.appendChild(pathR1);
        // 진한 빨강 우측 (마스킹)
        const pathR2 = document.createElementNS(SVG_NS, "path");
        pathR2.setAttribute("d", "M780 800H784V400H780H776V800H780Z");
        pathR2.setAttribute("fill", "#FF0000");
        pathR2.setAttribute("fill-opacity", "0.4");
        pathR2.setAttribute("mask", "url(#path-3-outside-1_9_622)");
        svg.appendChild(pathR2);
        // 하단 몰딩 (첨부 SVG와 동일하게 마스킹 적용)
        const mask = document.createElementNS(SVG_NS, "mask");
        mask.setAttribute("id", "path-2-outside-1_9_622");
        mask.setAttribute("maskUnits", "userSpaceOnUse");
        mask.setAttribute("x", "400");
        mask.setAttribute("y", "776");
        mask.setAttribute("width", "400");
        mask.setAttribute("height", "24");
        mask.setAttribute("fill", "black");
        const maskRect = document.createElementNS(SVG_NS, "rect");
        maskRect.setAttribute("fill", "white");
        maskRect.setAttribute("x", "400");
        maskRect.setAttribute("y", "776");
        maskRect.setAttribute("width", "400");
        maskRect.setAttribute("height", "24");
        const maskPath = document.createElementNS(SVG_NS, "path");
        maskPath.setAttribute("d", "M400 780H800V800H400V780Z");
        mask.appendChild(maskRect);
        mask.appendChild(maskPath);
        svg.appendChild(mask);
        // 연한 빨강 하단
        const path1 = document.createElementNS(SVG_NS, "path");
        path1.setAttribute("d", "M400 780H800V800H400V780Z");
        path1.setAttribute("fill", "#FF0000");
        path1.setAttribute("fill-opacity", "0.2");
        svg.appendChild(path1);
        // 진한 빨강 하단 (마스킹)
        const path2 = document.createElementNS(SVG_NS, "path");
        path2.setAttribute("d", "M400 780V784H800V780V776H400V780Z");
        path2.setAttribute("fill", "#FF0000");
        path2.setAttribute("fill-opacity", "0.4");
        path2.setAttribute("mask", "url(#path-2-outside-1_9_622)");
        svg.appendChild(path2);
    }
    else if (type === "horizontal") {
        // 가로형 우측 몰딩 (첨부 SVG와 동일하게 마스킹 적용)
        // mask: x=976, y=400, width=24, height=400, path: M980 400H1000V800H980V400Z
        const maskR = document.createElementNS(SVG_NS, "mask");
        maskR.setAttribute("id", "path-14-outside-2_9_624");
        maskR.setAttribute("maskUnits", "userSpaceOnUse");
        maskR.setAttribute("x", "976");
        maskR.setAttribute("y", "400");
        maskR.setAttribute("width", "24");
        maskR.setAttribute("height", "400");
        maskR.setAttribute("fill", "black");
        const maskRRect = document.createElementNS(SVG_NS, "rect");
        maskRRect.setAttribute("fill", "white");
        maskRRect.setAttribute("x", "976");
        maskRRect.setAttribute("y", "400");
        maskRRect.setAttribute("width", "24");
        maskRRect.setAttribute("height", "400");
        const maskRPath = document.createElementNS(SVG_NS, "path");
        maskRPath.setAttribute("d", "M980 400H1000V800H980V400Z");
        maskR.appendChild(maskRRect);
        maskR.appendChild(maskRPath);
        svg.appendChild(maskR);
        // 연한 빨강 우측
        const pathR1 = document.createElementNS(SVG_NS, "path");
        pathR1.setAttribute("d", "M980 400H1000V800H980V400Z");
        pathR1.setAttribute("fill", "#FF0000");
        pathR1.setAttribute("fill-opacity", "0.2");
        svg.appendChild(pathR1);
        // 진한 빨강 우측 (마스킹)
        const pathR2 = document.createElementNS(SVG_NS, "path");
        pathR2.setAttribute("d", "M980 800H984V400H980H976V800H980Z");
        pathR2.setAttribute("fill", "#FF0000");
        pathR2.setAttribute("fill-opacity", "0.4");
        pathR2.setAttribute("mask", "url(#path-14-outside-2_9_624)");
        svg.appendChild(pathR2);
        // 하단 몰딩 (첨부 SVG와 동일하게 마스킹 적용)
        const mask = document.createElementNS(SVG_NS, "mask");
        mask.setAttribute("id", "path-2-outside-1_9_624");
        mask.setAttribute("maskUnits", "userSpaceOnUse");
        mask.setAttribute("x", "200");
        mask.setAttribute("y", "776");
        mask.setAttribute("width", "800");
        mask.setAttribute("height", "24");
        mask.setAttribute("fill", "black");
        const maskRect = document.createElementNS(SVG_NS, "rect");
        maskRect.setAttribute("fill", "white");
        maskRect.setAttribute("x", "200");
        maskRect.setAttribute("y", "776");
        maskRect.setAttribute("width", "800");
        maskRect.setAttribute("height", "24");
        const maskPath = document.createElementNS(SVG_NS, "path");
        maskPath.setAttribute("d", "M200 780H1000V800H200V780Z");
        mask.appendChild(maskRect);
        mask.appendChild(maskPath);
        svg.appendChild(mask);
        // 연한 빨강 하단
        const path1 = document.createElementNS(SVG_NS, "path");
        path1.setAttribute("d", "M200 780H1000V800H200V780Z");
        path1.setAttribute("fill", "#FF0000");
        path1.setAttribute("fill-opacity", "0.2");
        svg.appendChild(path1);
        // 진한 빨강 하단 (마스킹)
        const path2 = document.createElementNS(SVG_NS, "path");
        path2.setAttribute("d", "M200 780V784H1000V780V776H200V780Z");
        path2.setAttribute("fill", "#FF0000");
        path2.setAttribute("fill-opacity", "0.4");
        path2.setAttribute("mask", "url(#path-2-outside-1_9_624)");
        svg.appendChild(path2);
    }
    // 7. 치수 텍스트 추가 (마에다 방식 참조)
    // 세로 치수 (오른쪽)
    const verticalText = document.createElementNS(SVG_NS, "text");
    if (type === "vertical") {
        verticalText.setAttribute("x", (396 + 408 + 30).toString());
        verticalText.setAttribute("y", (196 + 808 / 2).toString());
        verticalText.setAttribute("text-anchor", "start");
    }
    else if (type === "square") {
        verticalText.setAttribute("x", (396 + 408 + 30).toString());
        verticalText.setAttribute("y", (396 + 408 / 2).toString());
        verticalText.setAttribute("text-anchor", "start");
    }
    else if (type === "horizontal") {
        verticalText.setAttribute("x", (196 + 808 + 30).toString());
        verticalText.setAttribute("y", (396 + 408 / 2).toString());
        verticalText.setAttribute("text-anchor", "start");
    }
    verticalText.setAttribute("fill", "black");
    verticalText.style.fontSize = `${FONT_SIZE}px`;
    verticalText.style.dominantBaseline = "middle";
    verticalText.textContent = height.toString();
    svg.appendChild(verticalText);
    // 가로 치수 (하단)
    const horizontalText = document.createElementNS(SVG_NS, "text");
    if (type === "vertical") {
        horizontalText.setAttribute("x", (396 + 408 / 2).toString());
        horizontalText.setAttribute("y", (196 + 808 + 20 + FONT_SIZE / 2).toString());
        horizontalText.setAttribute("text-anchor", "middle");
    }
    else if (type === "square") {
        horizontalText.setAttribute("x", (396 + 408 / 2).toString());
        horizontalText.setAttribute("y", (396 + 408 + 20 + FONT_SIZE / 2).toString());
        horizontalText.setAttribute("text-anchor", "middle");
    }
    else if (type === "horizontal") {
        horizontalText.setAttribute("x", (196 + 808 / 2).toString());
        horizontalText.setAttribute("y", (396 + 408 + 20 + FONT_SIZE / 2).toString());
        horizontalText.setAttribute("text-anchor", "middle");
    }
    horizontalText.setAttribute("fill", "black");
    horizontalText.style.fontSize = `${FONT_SIZE}px`;
    horizontalText.textContent = width.toString();
    svg.appendChild(horizontalText);
    return svg;
}
