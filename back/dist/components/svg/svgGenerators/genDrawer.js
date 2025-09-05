"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genDrawerSvg = genDrawerSvg;
const drawerData_1 = require("../svgData/drawerData");
const svgUtils_1 = require("../svgCore/svgUtils");
function genDrawerSvg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "1200");
    svg.setAttribute("height", "1200");
    svg.setAttribute("viewBox", "0 0 1200 1200");
    svg.setAttribute("fill", "none");
    drawerData_1.DRAWER1_PARTS.forEach(part => svg.appendChild((0, svgUtils_1.makePath)(part)));
    return svg;
}
