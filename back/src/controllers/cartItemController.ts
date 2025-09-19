import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { ProductType } from '@prisma/client';
import amplitude from '../amplitudeClient';
const VALID_PRODUCT_TYPES = Object.values(ProductType);

// GET /cart_item/:cart_item_id — 특정 장바구니 아이템 조회
export async function getCartItem(req: Request, res: Response) {
  const id = Number(req.params.cart_item_id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'cart_item_id는 정수여야 합니다' });
  }

  const item = await prisma.cartItem.findUnique({
    where: { id },
  });
  if (!item) {
    return res.status(404).json({ message: '해당 장바구니 아이템을 찾을 수 없습니다' });
  }

  return res.status(200).json({
    cart_item_id: item.id,
    cart_id:        item.cart_id,
    product_type:   item.product_type,
    unit_price:     item.unit_price,
    item_count:     item.item_count,
    item_options:   item.item_options,
  });
}

// POST /cart_item — 장바구니에 상품 추가
export async function addCartItem(req: Request, res: Response) {
  const { cart_id, product_type, unit_price, item_count, item_options } = req.body;
  if (typeof cart_id !== 'number' || 
    typeof item_count !== 'number' || 
    !product_type || 
    typeof unit_price !== 'number' ||
    typeof item_options !== 'object' ||
    !VALID_PRODUCT_TYPES.includes(product_type)) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  const newItem = await prisma.cartItem.create({
    data: { cart_id, product_type, unit_price, item_count, item_options },
  });

  // cart_id로 cart의 user_id를 조회해서 amplitude 전용 user_id 생성
  let productTypeKey = product_type.toLowerCase() === 'finish'
    ? 'finish_category'
    : product_type.toLowerCase() + '_type';
  let productTypeValue = '';
  if (
    item_options &&
    typeof item_options[productTypeKey] === 'string'
  ) {
    productTypeValue = item_options[productTypeKey].toLowerCase();
  }
  const product_name = product_type.toLowerCase() + (productTypeValue ? `_${productTypeValue}` : '');
  const cart = await prisma.cart.findUnique({ where: { id: cart_id } });
  if (!cart) {
    return res.status(400).json({ message: '유효하지 않은 cart_id입니다' });
  }
  let amplitudeUserId = String(cart.user_id);
  if (amplitudeUserId.length < 5) {
    amplitudeUserId = `user_${amplitudeUserId}`;
    while (amplitudeUserId.length < 5) {
      amplitudeUserId = amplitudeUserId + "0";
    }
  }
  amplitude.track({
    event_type: 'Added to Cart',
    user_id: amplitudeUserId,
    event_properties: {
      product_name,
      quantity: item_count,
      price_per_unit: unit_price,
    },
  });

  return res.status(201).json({
    cart_item_id: newItem.id,
    cart_id:      newItem.cart_id,
    product_type: newItem.product_type,
    unit_price:   newItem.unit_price,
    item_count:   newItem.item_count,
    item_options: newItem.item_options,
  });
}

// PUT /cart_item/:cart_item_id
export async function updateCartItem(req: Request, res: Response) {
  const id = Number(req.params.cart_item_id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'cart_item_id는 정수여야 합니다' });
  }
  const { item_options, item_count } = req.body;
  if (typeof item_options !== 'object') {
    return res.status(400).json({ message: 'item_options는 객체여야 합니다' });
  }
  // 동시에 둘다 바꿀 수도, item_options만 바꿀 수도 있음!
  const updateData: any = { item_options };
  if (typeof item_count === 'number' && item_count > 0) {
    updateData.item_count = item_count;
  }
  try {
    const updated = await prisma.cartItem.update({
      where: { id },
      data: updateData,
    });
    return res.status(200).json({
      cart_item_id: updated.id,
      cart_id: updated.cart_id,
      product_type: updated.product_type,
      unit_price: updated.unit_price,
      item_count: updated.item_count,
      item_options: updated.item_options,
    });
  } catch {
    return res.status(404).json({ message: '해당 장바구니 아이템이 없습니다' });
  }
}


// DELETE /cart_item/:cart_item_id — 특정 장바구니 아이템 삭제
export async function deleteCartItem(req: Request, res: Response) {
  const id = Number(req.params.cart_item_id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'cart_item_id는 정수여야 합니다' });
  }

  try {
    await prisma.cartItem.delete({ where: { id } });
    return res.sendStatus(204);
  } catch {
    return res.status(404).json({ message: '해당 장바구니 아이템이 없습니다' });
  }
}
