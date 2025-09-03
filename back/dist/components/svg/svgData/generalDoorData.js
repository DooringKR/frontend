"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOOR_DIMENSION_POSITIONS = exports.GENERAL_DOOR_BORINGS = exports.DOOR_RECT = void 0;
exports.DOOR_RECT = { x: 304, y: 154, width: 392, height: 792 };
exports.GENERAL_DOOR_BORINGS = {
    '좌경_2보링': [
        { cx: 365, cy: 350, r: 22 },
        { cx: 365, cy: 750, r: 22 },
    ],
    '좌경_3보링': [
        { cx: 365, cy: 283.333, r: 22 },
        { cx: 365, cy: 550, r: 22 },
        { cx: 365, cy: 816.667, r: 22 },
    ],
    '좌경_4보링': [
        { cx: 365, cy: 250, r: 22 },
        { cx: 365, cy: 450, r: 22 },
        { cx: 365, cy: 650, r: 22 },
        { cx: 365, cy: 850, r: 22 },
    ],
    '우경_2보링': [
        { cx: 635, cy: 350, r: 22 },
        { cx: 635, cy: 750, r: 22 },
    ],
    '우경_3보링': [
        { cx: 635, cy: 283.333, r: 22 },
        { cx: 635, cy: 550, r: 22 },
        { cx: 635, cy: 816.667, r: 22 },
    ],
    '우경_4보링': [
        { cx: 635, cy: 250, r: 22 },
        { cx: 635, cy: 450, r: 22 },
        { cx: 635, cy: 650, r: 22 },
        { cx: 635, cy: 850, r: 22 },
    ],
};
const VERTICAL_TEXT_OFFSET = 30;
const HORIZONTAL_TEXT_OFFSET = 20;
const BORING_TEXT_RECT_OFFSET = 30;
const BORING_RADIUS = 22;
const FONT_SIZE = 50;
exports.DOOR_DIMENSION_POSITIONS = {
    '좌경_2보링': {
        verticalPos: { x: 304 + 392 + VERTICAL_TEXT_OFFSET, y: 154 + 792 / 2, anchor: 'start' },
        horizontalPos: { x: 304 + 392 / 2, y: 154 + 792 + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2, anchor: 'middle' },
        boringTextPos: [
            { x: 304 - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 350, anchor: 'end' },
            { x: 304 - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 750, anchor: 'end' },
        ],
    },
    '좌경_3보링': {
        verticalPos: { x: 304 + 392 + VERTICAL_TEXT_OFFSET, y: 154 + 792 / 2, anchor: 'start' },
        horizontalPos: { x: 304 + 392 / 2, y: 154 + 792 + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2, anchor: 'middle' },
        boringTextPos: [
            { x: 304 - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 283.333, anchor: 'end' },
            { x: 304 - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 550, anchor: 'end' },
            { x: 304 - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 816.667, anchor: 'end' },
        ],
    },
    '좌경_4보링': {
        verticalPos: { x: 304 + 392 + VERTICAL_TEXT_OFFSET, y: 154 + 792 / 2, anchor: 'start' },
        horizontalPos: { x: 304 + 392 / 2, y: 154 + 792 + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2, anchor: 'middle' },
        boringTextPos: [
            { x: 304 - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 250, anchor: 'end' },
            { x: 304 - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 450, anchor: 'end' },
            { x: 304 - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 650, anchor: 'end' },
            { x: 304 - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 850, anchor: 'end' },
        ],
    },
    '우경_2보링': {
        verticalPos: { x: 304 - VERTICAL_TEXT_OFFSET, y: 154 + 792 / 2, anchor: 'end' },
        horizontalPos: { x: 304 + 392 / 2, y: 154 + 792 + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2, anchor: 'middle' },
        boringTextPos: [
            { x: 304 + 392 + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 350, anchor: 'start' },
            { x: 304 + 392 + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 750, anchor: 'start' },
        ],
    },
    '우경_3보링': {
        verticalPos: { x: 304 - VERTICAL_TEXT_OFFSET, y: 154 + 792 / 2, anchor: 'end' },
        horizontalPos: { x: 304 + 392 / 2, y: 154 + 792 + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2, anchor: 'middle' },
        boringTextPos: [
            { x: 304 + 392 + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 283.333, anchor: 'start' },
            { x: 304 + 392 + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 550, anchor: 'start' },
            { x: 304 + 392 + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 816.667, anchor: 'start' },
        ],
    },
    '우경_4보링': {
        verticalPos: { x: 304 - VERTICAL_TEXT_OFFSET, y: 154 + 792 / 2, anchor: 'end' },
        horizontalPos: { x: 304 + 392 / 2, y: 154 + 792 + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2, anchor: 'middle' },
        boringTextPos: [
            { x: 304 + 392 + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 250, anchor: 'start' },
            { x: 304 + 392 + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 450, anchor: 'start' },
            { x: 304 + 392 + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 650, anchor: 'start' },
            { x: 304 + 392 + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 850, anchor: 'start' },
        ],
    },
};
