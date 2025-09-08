// src/controllers/orderItemController.ts

import { Request, Response } from 'express';
import prisma from '../prismaClient';
// ProductType enum 직접 명시
import { generateAndUploadOrderItemImage } from '../services/imageService';

const VALID_PRODUCT_TYPES = ["DOOR", "FINISH", "CABINET", "HARDWARE", "ACCESSORY"];

// GET /order_item/:order_item_id — 특정 주문 아이템 조회
export async function getOrderItem(req: Request, res: Response) {
  const id = Number(req.params.order_item_id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'order_item_id는 정수여야 합니다' });
  }

  const item = await prisma.orderItem.findUnique({
    where: { order_item_id: id },
  });
  if (!item) {
    return res.status(404).json({ message: '해당 주문 아이템을 찾을 수 없습니다' });
  }

  return res.status(200).json({
    order_item_id: item.order_item_id,
    order_id:      item.order_id,
    product_type:  item.product_type,
    unit_price:    item.unit_price,
    item_count:    item.item_count,
    item_options:  item.item_options,
    image_url:     item.image_url,
  });
}

// POST /order_item — 주문에 아이템 추가
export async function addOrderItem(req: Request, res: Response) {
  console.log('[NotionSync][TRACE][orderItemController] addOrderItem 함수 진입', { body: req.body });
  // ...existing code...
  const { order_id, product_type, unit_price, item_count, item_options } = req.body;
  if (
    !order_id ||
    !VALID_PRODUCT_TYPES.includes(product_type) ||
    typeof unit_price !== 'number' ||
    typeof item_count !== 'number' ||
    typeof item_options !== 'object'
  ) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }


  // 1. orderItem 먼저 생성
  const newItem = await prisma.orderItem.create({
    data: {
      order_id,
      product_type,
      unit_price,
      item_count,
      item_options,
      // image_url: null (생성 후 업데이트)
    },
  });

  // 2. 이미지 생성 및 업로드 (order_id, order_item_id 넘김)
  let image_url: string | null = null;
  try {
    image_url = await generateAndUploadOrderItemImage({
      order_id: newItem.order_id,
      order_item_id: newItem.order_item_id,
      product_type,
      unit_price,
      item_count,
      item_options
    });
    // 3. image_url 업데이트
    await prisma.orderItem.update({
      where: { order_item_id: newItem.order_item_id },
      data: { image_url }
    });
  } catch (e) {
    console.warn('[OrderItem][WARN] 이미지 생성/업로드 실패', e);
  }

  // 4. 최종 응답
  const updatedItem = await prisma.orderItem.findUnique({
    where: { order_item_id: newItem.order_item_id }
  });
  if (!updatedItem) {
    return res.status(404).json({ message: '생성된 주문 아이템을 찾을 수 없습니다.' });
  }
  return res.status(201).json({
    order_item_id: updatedItem.order_item_id,
    order_id:      updatedItem.order_id,
    product_type:  updatedItem.product_type,
    unit_price:    updatedItem.unit_price,
    item_count:    updatedItem.item_count,
    item_options:  updatedItem.item_options,
    image_url:     updatedItem.image_url,
  });
}

// PUT /order_item/:order_item_id
export async function updateOrderItem(req: Request, res: Response) {
  const id = Number(req.params.order_item_id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'order_item_id는 정수여야 합니다' });
  }
  const { item_options, item_count, image_url } = req.body;
  if (typeof item_options !== 'object') {
    return res.status(400).json({ message: 'item_options는 객체여야 합니다' });
  }
  const updateData: any = { item_options };
  if (typeof item_count === 'number' && item_count > 0) {
    updateData.item_count = item_count;
  }
  if (typeof image_url === 'string' && image_url.length > 0) {
    updateData.image_url = image_url;
  }
  try {
    const updated = await prisma.orderItem.update({
      where: { order_item_id: id },
      data: updateData,
    });
    return res.status(200).json({
      order_item_id: updated.order_item_id,
      order_id: updated.order_id,
      product_type: updated.product_type,
      unit_price: updated.unit_price,
      item_count: updated.item_count,
      item_options: updated.item_options,
    });
  } catch {
    return res.status(404).json({ message: '해당 주문 아이템이 없습니다' });
  }
}


// DELETE /order_item/:order_item_id — 특정 주문 아이템 삭제
export async function deleteOrderItem(req: Request, res: Response) {
  const id = Number(req.params.order_item_id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'order_item_id는 정수여야 합니다' });
  }

  try {
    await prisma.orderItem.delete({ where: { order_item_id: id } });
    return res.sendStatus(204);
  } catch {
    return res.status(404).json({ message: '해당 주문 아이템이 없습니다' });
  }
}
