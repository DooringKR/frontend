
// src/services/imageService.ts
// 독립적인 이미지 생성 및 S3 업로드 서비스 (orderItem 생성 시 사용)
import sharp from 'sharp';
import fs from 'fs';
import { mapItemOptionsToSvgParams } from './svgParamMapper';
// SVG 생성기 import (필요에 따라 추가)
const path = require('path');
const { genCabinetSvg } = require(path.join(__dirname, '../components/svg/svgGenerators/genCabinet'));
const { genGeneralDoorSvg } = require(path.join(__dirname, '../components/svg/svgGenerators/genGeneral'));
const { genFlapSvg } = require(path.join(__dirname, '../components/svg/svgGenerators/genFlap'));
const { genMaedaDoorSvg } = require(path.join(__dirname, '../components/svg/svgGenerators/genMaeda'));
const { genFinishDoorSvg } = require(path.join(__dirname, '../components/svg/svgGenerators/genFinish'));
const { genDrawerSvg } = require(path.join(__dirname, '../components/svg/svgGenerators/genDrawer'));



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
    const doorType = item_options?.door_type;
    if (doorType === "STANDARD") {
      svg = genGeneralDoorSvg(
        params.subtype,
        params.size,
        params.color,
        params.boringValues
      );
    } else if (doorType === "FLAP") {
      svg = genFlapSvg(
        params.subtype,
        params.size,
        params.color,
        params.boringValues
      );
    } else if (doorType === "DRAWER") {
      if (typeof genDrawerSvg === "function") {
        svg = genMaedaDoorSvg(
          params.size,
          params.color
        );
      } else {
        // Drawer SVG generator가 없으면 General로 fallback
        svg = genGeneralDoorSvg(
          params.subtype ?? "좌경_2보링",
          params.size,
          params.color,
          []
        );
      }
    }
  } else if (product_type === "CABINET") {
    svg = genCabinetSvg(params);
  } else if (product_type === "FINISH") {
  svg = genFinishDoorSvg(
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
    console.log('[imageService][DEBUG] generateAndUploadOrderItemImage 호출:', item);
    const svgString = getSvgForOrderItem(item);
    console.log('[imageService][DEBUG] SVG 생성 결과:', svgString ? svgString.slice(0, 200) : svgString);
    if (!svgString) {
      console.warn('[imageService][WARN] SVG 생성 실패, 반환값 없음');
      return null;
    }
    // sharp가 SVG 내 href를 그대로 처리하도록 경로 치환 없이 변환
    let pngBuffer;
    try {
      pngBuffer = await sharp(Buffer.from(svgString)).png().toBuffer();
      console.log('[imageService][DEBUG] PNG 변환 성공, buffer 길이:', pngBuffer.length);
    } catch (err) {
      console.warn('[imageService][ERROR] PNG 변환 실패:', err);
      return null;
    }

    // SVG 파일도 저장
    let svgFilename;
    if (item.image_url) {
      svgFilename = item.image_url.replace(/\.png$/, '.svg').replace(/^\/images\//, "");
    } else if (item.order_id && item.order_item_id) {
      svgFilename = `${item.order_id}_${item.order_item_id}.svg`;
    } else if (item.order_item_id) {
      svgFilename = `orderitem_${item.order_item_id}.svg`;
    } else if (typeof item.item_index !== 'undefined') {
      svgFilename = `item_${item.item_index}.svg`;
    } else {
      svgFilename = `item_${Date.now()}.svg`;
    }
    const imagesDir = path.join(__dirname, '../../public/images');
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
    const svgFilePath = path.join(imagesDir, svgFilename);
    await fs.promises.writeFile(svgFilePath, svgString);
    console.log(`[SVG 저장] ${svgFilePath}`);

    // PNG 저장
    let filename;
    if (item.image_url) {
      filename = item.image_url.replace(/^\/images\//, "");
      await saveImageLocally(pngBuffer, filename);
      console.log(`[PNG 저장] ${path.join(imagesDir, filename)}`);
      return item.image_url;
    }
    if (item.order_id && item.order_item_id) {
      filename = `${item.order_id}_${item.order_item_id}.png`;
    } else if (item.order_item_id) {
      filename = `orderitem_${item.order_item_id}.png`;
    } else if (typeof item.item_index !== 'undefined') {
      filename = `orderitem_${item.item_index}.png`;
    } else {
      filename = `orderitem_${Date.now()}.png`;
    }
    const imageUrl = await saveImageLocally(pngBuffer, filename);
    console.log('[imageService][DEBUG] PNG 저장 결과 imageUrl:', imageUrl);
    return imageUrl;
  } catch (e) {
    console.warn('[OrderItem][IMAGE][ERROR] 이미지 생성/업로드 실패', e);
    return null;
  }
}