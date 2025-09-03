// src/services/imageService.ts
// 독립적인 이미지 생성 및 S3 업로드 서비스 (orderItem 생성 시 사용)
import sharp from 'sharp';
import fs from 'fs';
import { mapItemOptionsToSvgParams } from './svgParamMapper';
// SVG 생성기 import (필요에 따라 추가)
const path = require('path');
const genCabinetSvg = require(path.join(__dirname, '../../../src/components/svg/svgGenerators/genCabinet'));
const genGeneralDoorSvg = require(path.join(__dirname, '../../../src/components/svg/svgGenerators/genGeneral'));
const genFlapSvg = require(path.join(__dirname, '../../../src/components/svg/svgGenerators/genFlap'));
const genMaedaDoorSvg = require(path.join(__dirname, '../../../src/components/svg/svgGenerators/genMaeda'));
const genFinishSvg = require(path.join(__dirname, '../../../src/components/svg/svgGenerators/genFinish'));

function getSvgForOrderItem(item: any): string {
  const { product_type, item_options } = item;
  // Node.js 환경에서 DOM 보장 (jsdom)
  if (typeof window === 'undefined' && typeof global.document === 'undefined') {
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
  }
  const params = mapItemOptionsToSvgParams(product_type, item_options);
  let svg;
  if (product_type === "DOOR") {
    svg = genGeneralDoorSvg(
      params.subtype,
      params.size,
      params.color,
      params.boringValues
    );
  } else if (product_type === "CABINET") {
    svg = genCabinetSvg(params);
  } else if (product_type === "FLAP_DOOR") {
    svg = genFlapSvg(
      params.subtype,
      params.size,
      params.color,
      params.boringValues
    );
  } else if (product_type === "MAEDA") {
    svg = genMaedaDoorSvg(
      params.size,
      params.color
    );
  } else if (product_type === "FINISH") {
    svg = genFinishSvg(
      params.width,
      params.height,
      params.colorOrImage
    );
  }
  if (!svg) return "";
  return svg.outerHTML;
}


async function saveImageLocally(buffer: Buffer, filename: string): Promise<string> {
  const imagesDir = path.join(__dirname, '../../public/images');
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
  const filePath = path.join(imagesDir, filename);
  await fs.promises.writeFile(filePath, buffer);
  // 반환 URL: /images/filename
  return `/images/${filename}`;
}

export async function generateAndUploadOrderItemImage(item: any): Promise<string|null> {
  try {
    const svgString = getSvgForOrderItem(item);
    if (!svgString) return null;
    const pngBuffer = await sharp(Buffer.from(svgString)).png().toBuffer();
    const filename = `orderitem_${Date.now()}_${Math.floor(Math.random()*10000)}.png`;
    const imageUrl = await saveImageLocally(pngBuffer, filename);
    return imageUrl;
  } catch (e) {
    console.warn('[OrderItem][IMAGE][ERROR] 이미지 생성/업로드 실패', e);
    return null;
  }
}
