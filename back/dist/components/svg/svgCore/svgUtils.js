"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeText = makeText;
exports.makePath = makePath;
exports.makeRect = makeRect;
function makeText({ x, y, text, fontSize = 50, anchor = "middle", fill = "black" }) {
    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('x', x.toString());
    t.setAttribute('y', y.toString());
    t.setAttribute('fill', fill);
    t.setAttribute('text-anchor', anchor);
    t.style.fontSize = `${fontSize}px`;
    t.textContent = text;
    return t;
}
const SVG_NS = "http://www.w3.org/2000/svg";
function makePath(part) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', part.d);
    path.setAttribute('fill', part.fill);
    if (part.stroke)
        path.setAttribute('stroke', part.stroke);
    if (part.strokeWidth)
        path.setAttribute('stroke-width', part.strokeWidth);
    if (part.strokeLinejoin)
        path.setAttribute('stroke-linejoin', part.strokeLinejoin);
    return path;
}
function makeRect(attribs) {
    const rect = document.createElementNS(SVG_NS, 'rect');
    Object.entries(attribs).forEach(([k, v]) => rect.setAttribute(k, v));
    return rect;
}
