"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FLAP_DOOR_DIMENSION_POSITIONS = exports.FLAP_DOOR_BORINGS = exports.FLAP_DOOR_RECT = void 0;
exports.FLAP_DOOR_RECT = { x: 154, y: 404, width: 792, height: 392 };
exports.FLAP_DOOR_BORINGS = {
    "2보링": [
        { cx: 350, cy: 365, r: 22 },
        { cx: 750, cy: 365, r: 22 },
    ],
    "3보링": [
        { cx: 255.333, cy: 365, r: 22 },
        { cx: 522, cy: 365, r: 22 },
        { cx: 788.667, cy: 365, r: 22 },
    ],
    "4보링": [
        { cx: 222, cy: 365, r: 22 },
        { cx: 422, cy: 365, r: 22 },
        { cx: 622, cy: 365, r: 22 },
        { cx: 822, cy: 365, r: 22 },
    ],
};
const VERTICAL_TEXT_OFFSET = 30;
const HORIZONTAL_TEXT_OFFSET = 20;
const FLAP_BORING_TEXT_OFFSET = 30;
exports.FLAP_DOOR_DIMENSION_POSITIONS = {
    "2보링": {
        verticalPos: {
            x: exports.FLAP_DOOR_RECT.x + exports.FLAP_DOOR_RECT.width + VERTICAL_TEXT_OFFSET,
            y: exports.FLAP_DOOR_RECT.y + exports.FLAP_DOOR_RECT.height / 2,
            anchor: "start",
        },
        horizontalPos: {
            x: exports.FLAP_DOOR_RECT.x + exports.FLAP_DOOR_RECT.width / 2,
            y: exports.FLAP_DOOR_RECT.y + exports.FLAP_DOOR_RECT.height + HORIZONTAL_TEXT_OFFSET + 50 / 2,
            anchor: "middle",
        },
        boringTextPos: exports.FLAP_DOOR_BORINGS["2보링"].map(({ cx, cy, r }) => ({
            x: cx,
            y: cy - r - FLAP_BORING_TEXT_OFFSET,
            anchor: "middle",
        })),
    },
    "3보링": {
        verticalPos: {
            x: exports.FLAP_DOOR_RECT.x + exports.FLAP_DOOR_RECT.width + VERTICAL_TEXT_OFFSET,
            y: exports.FLAP_DOOR_RECT.y + exports.FLAP_DOOR_RECT.height / 2,
            anchor: "start",
        },
        horizontalPos: {
            x: exports.FLAP_DOOR_RECT.x + exports.FLAP_DOOR_RECT.width / 2,
            y: exports.FLAP_DOOR_RECT.y + exports.FLAP_DOOR_RECT.height + HORIZONTAL_TEXT_OFFSET + 50 / 2,
            anchor: "middle",
        },
        boringTextPos: exports.FLAP_DOOR_BORINGS["3보링"].map(({ cx, cy, r }) => ({
            x: cx,
            y: cy - r - FLAP_BORING_TEXT_OFFSET,
            anchor: "middle",
        })),
    },
    "4보링": {
        verticalPos: {
            x: exports.FLAP_DOOR_RECT.x + exports.FLAP_DOOR_RECT.width + VERTICAL_TEXT_OFFSET,
            y: exports.FLAP_DOOR_RECT.y + exports.FLAP_DOOR_RECT.height / 2,
            anchor: "start",
        },
        horizontalPos: {
            x: exports.FLAP_DOOR_RECT.x + exports.FLAP_DOOR_RECT.width / 2,
            y: exports.FLAP_DOOR_RECT.y + exports.FLAP_DOOR_RECT.height + HORIZONTAL_TEXT_OFFSET + 50 / 2,
            anchor: "middle",
        },
        boringTextPos: exports.FLAP_DOOR_BORINGS["4보링"].map(({ cx, cy, r }) => ({
            x: cx,
            y: cy - r - FLAP_BORING_TEXT_OFFSET,
            anchor: "middle",
        })),
    },
};
