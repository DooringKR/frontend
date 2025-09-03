"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAndUploadOrderItemImage = generateAndUploadOrderItemImage;
// src/services/imageService.ts
// 독립적인 이미지 생성 및 S3 업로드 서비스 (orderItem 생성 시 사용)
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const svgParamMapper_1 = require("./svgParamMapper");
// SVG 생성기 import (필요에 따라 추가)
const path = require('path');
const genCabinetSvg = require(path.join(__dirname, '../components/svg/svgGenerators/genCabinet'));
const genGeneralDoorSvg = require(path.join(__dirname, '../components/svg/svgGenerators/genGeneral'));
const genFlapSvg = require(path.join(__dirname, '../components/svg/svgGenerators/genFlap'));
const genMaedaDoorSvg = require(path.join(__dirname, '../components/svg/svgGenerators/genMaeda'));
const genFinishSvg = require(path.join(__dirname, '../components/svg/svgGenerators/genFinish'));
function getSvgForOrderItem(item) {
    const { product_type, item_options } = item;
    // Node.js 환경에서 DOM 보장 (jsdom)
    if (typeof window === 'undefined' && typeof global.document === 'undefined') {
        const { JSDOM } = require('jsdom');
        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        global.window = dom.window;
        global.document = dom.window.document;
    }
    const params = (0, svgParamMapper_1.mapItemOptionsToSvgParams)(product_type, item_options);
    let svg;
    if (product_type === "DOOR") {
        svg = genGeneralDoorSvg(params.subtype, params.size, params.color, params.boringValues);
    }
    else if (product_type === "CABINET") {
        svg = genCabinetSvg(params);
    }
    else if (product_type === "FLAP_DOOR") {
        svg = genFlapSvg(params.subtype, params.size, params.color, params.boringValues);
    }
    else if (product_type === "MAEDA") {
        svg = genMaedaDoorSvg(params.size, params.color);
    }
    else if (product_type === "FINISH") {
        svg = genFinishSvg(params.width, params.height, params.colorOrImage);
    }
    if (!svg)
        return "";
    return svg.outerHTML;
}
async function saveImageLocally(buffer, filename) {
    const imagesDir = path.join(__dirname, '../../public/images');
    if (!fs_1.default.existsSync(imagesDir))
        fs_1.default.mkdirSync(imagesDir, { recursive: true });
    const filePath = path.join(imagesDir, filename);
    await fs_1.default.promises.writeFile(filePath, buffer);
    // 반환 URL: /images/filename
    return `/images/${filename}`;
}
async function generateAndUploadOrderItemImage(item) {
    try {
        const svgString = getSvgForOrderItem(item);
        if (!svgString)
            return null;
        const pngBuffer = await (0, sharp_1.default)(Buffer.from(svgString)).png().toBuffer();
        const filename = `orderitem_${Date.now()}_${Math.floor(Math.random() * 10000)}.png`;
        const imageUrl = await saveImageLocally(pngBuffer, filename);
        return imageUrl;
    }
    catch (e) {
        console.warn('[OrderItem][IMAGE][ERROR] 이미지 생성/업로드 실패', e);
        return null;
    }
}
