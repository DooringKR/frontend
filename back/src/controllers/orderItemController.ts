// src/controllers/orderItemController.ts

import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { ProductType } from '@prisma/client';

const VALID_PRODUCT_TYPES = Object.values(ProductType);

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
  });
}

// POST /order_item — 주문에 아이템 추가
export async function addOrderItem(req: Request, res: Response) {
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

  const newItem = await prisma.orderItem.create({
    data: { order_id, product_type, unit_price, item_count, item_options },
  });

  return res.status(201).json({
    order_item_id: newItem.order_item_id,
    order_id:      newItem.order_id,
    product_type:  newItem.product_type,
    unit_price:    newItem.unit_price,
    item_count:    newItem.item_count,
    item_options:  newItem.item_options,
  });
}

// PUT /order_item/:order_item_id
export async function updateOrderItem(req: Request, res: Response) {
  const id = Number(req.params.order_item_id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'order_item_id는 정수여야 합니다' });
  }
  const { item_options, item_count } = req.body;
  if (typeof item_options !== 'object') {
    return res.status(400).json({ message: 'item_options는 객체여야 합니다' });
  }
  const updateData: any = { item_options };
  if (typeof item_count === 'number' && item_count > 0) {
    updateData.item_count = item_count;
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
