import { Request, Response } from 'express';
import prisma from '../prismaClient';

// GET /cart/:user_id — 전체 장바구니 상품 목록 조회
export async function getCart(req: Request, res: Response) {
  const userId = Number(req.params.user_id);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'user_id는 정수여야 합니다' });
  }

  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
    include: { cart_items: true },
  });
  if (!cart) {
    return res.status(404).json({ message: '장바구니를 찾을 수 없습니다' });
  }

  const items = cart.cart_items.map(item => ({
    cart_item_id: item.id,
    product_type: item.product_type,
    item_count: item.item_count,
    item_options: item.item_options,
  }));

  return res.status(200).json({
    cart_id: cart.id,
    user_id: cart.user_id,
    cart_count: items.length,
    items,
  });
}

// POST /cart — 장바구니 생성
export async function createCart(req: Request, res: Response) {
  const { user_id } = req.body;
  if (typeof user_id !== 'number') {
    return res.status(400).json({ message: 'user_id는 필수 숫자입니다' });
  }

  const cart = await prisma.cart.create({ data: { user_id } });
  return res.status(201).json({
    cart_id: cart.id,
    user_id: cart.user_id,
    cart_count: 0,
  });
}