"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPPER_CABINET_DOOR_PARTS = exports.CABINET_SHAPES_DATA = exports.FLAP_CABINET_PARTS = exports.CABINET_BASE_PARTS = exports.DRAWER_CABINET_PARTS = void 0;
// 서랍장 서랍 파트 (2단, 3단(1:1:2), 3단(겉2:속1))
exports.DRAWER_CABINET_PARTS = {
    // 2단 서랍장 (SVG 예시 그대로)
    drawer2: [
        // 레일
        {
            d: "M588 708L792 564V624L588 768V708Z",
            fill: "#D1D5DC",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
        },
        {
            d: "M554 952L758 808V888L554 1032V952Z",
            fill: "#D1D5DC",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
        },
        // 서랍
        {
            d: "M588 528L192 432V672L588 768V528Z",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
            fill: '',
        },
        {
            d: "M554 792L158 696V936L554 1032V792Z",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
            fill: '',
        },
    ],
    // 3단 서랍장 (1:1:2, SVG 예시 그대로)
    drawer3_112: [
        // 레일
        {
            d: "M622 564L826 420V480L622 624V564Z",
            fill: "#D1D5DC",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
        },
        {
            d: "M588 708L792 564V624L588 768V708Z",
            fill: "#D1D5DC",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
        },
        {
            d: "M554 952L758 808V888L554 1032V952Z",
            fill: "#D1D5DC",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
        },
        // 서랍
        {
            d: "M622 504L226 408V528L622 624V504Z",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
            fill: '',
        },
        {
            d: "M588 648L192 552V672L588 768V648Z",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
            fill: '',
        },
        {
            d: "M554 792L158 696V936L554 1032V792Z",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
            fill: '',
        },
    ],
    // 3단 서랍장 (겉2:속1, SVG 예시 그대로)
    drawer3_221: [
        // 레일
        {
            d: "M571 700L775 556V636L571 780V700Z",
            fill: "#D1D5DC",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
        },
        {
            d: "M537 964L741 820V900L537 1044V964Z",
            fill: "#D1D5DC",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
        },
        {
            d: "M622 594L826 450V500L622 644V594Z",
            fill: "#D1D5DC",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
        },
        // 서랍
        {
            d: "M571 540L175 444V684L571 780V540Z",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
            fill: '',
        },
        {
            d: "M537 804L141 708V948L537 1044V804Z",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
            fill: '',
        },
        {
            d: "M622 524L226 428V548L622 644V524Z",
            stroke: "black",
            strokeWidth: "4",
            strokeLinejoin: "round",
            fill: '',
        },
    ],
};
// 공통 바닥, 좌측, 뒷면(색상 하드코딩)
exports.CABINET_BASE_PARTS = [
    { d: "M860 336L464 240V720L860 816V336Z", fill: "#F3F4F6", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
    { d: "M464 720L260 864L656 960L860 816L464 720Z", fill: "#F3F4F6", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
    { d: "M464 240V720L260 864V384L464 240Z", fill: "#F3F4F6", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
];
// 플랩장 3D 파트 (플랩장.svg 기반)
exports.FLAP_CABINET_PARTS = [
    // 바닥
    { d: "M464 720L260 864L656 960L860 816L464 720Z", fill: "#F3F4F6", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
    // 우측면
    { d: "M860 336L464 240V720L860 816V336Z", fill: "#F3F4F6", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
    // 좌측면
    { d: "M464 240V720L260 864V384L464 240Z", fill: "#F3F4F6", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
    // 우측 정면(플랩 도어)
    { d: "M656 480L860 336V816L656 960V480Z", fill: '', stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
    // 좌측 정면(플랩 도어)
    { d: "M260 384L656 480L488 846L92 750L260 384Z", fill: '', stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
    // 윗면
    { d: "M464 240L260 384L656 480L860 336L464 240Z", fill: '', stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
];
// 우측 면과 윗면은 파라미터화(아래에서 처리)
exports.CABINET_SHAPES_DATA = [
    { key: 'right', d: "M656 480L860 336V816L656 960V480Z", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
    { key: 'top', d: "M464 240L260 384L656 480L860 336L464 240Z", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
];
// 상부장 문 파트 (좌측문, 우측문)
exports.UPPER_CABINET_DOOR_PARTS = {
    leftDoor: {
        d: "M260 384V864L352 983L352 503L260 384Z",
        stroke: "black",
        strokeWidth: "4",
        strokeLinejoin: "round",
        fill: '', // fill은 파라미터로 전달
    },
    rightDoor: {
        d: "M418 519V999L656 960L656 480L418 519Z",
        stroke: "black",
        strokeWidth: "4",
        strokeLinejoin: "round",
        fill: '', // fill은 파라미터로 전달
    },
};
