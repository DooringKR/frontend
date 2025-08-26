// src/controllers/orderController.ts

import { Request, Response } from "express";
import prisma from "../prismaClient";
import { createNotionOrderPage } from "../services/notionService";
import { ProductType } from '@prisma/client'

const VALID_SHIPPING_METHODS = ["직접 픽업하러 갈게요", "현장으로 배송해주세요"]; 
const VALID_MATERIAL_TYPES = ["문짝", "마감재", "부분장", "하드웨어", "부속", "기타(고객센터 직접 문의)"];

const NOTION_MATERIAL_TYPE_MAP: Record<ProductType, string> = {
  DOOR: "문짝",
  FINISH: "마감재",
  CABINET: "부분장",
  HARDWARE: "하드웨어",
  ACCESSORY: "부속",
};

export async function createOrder(req: Request, res: Response) {
  const {
    user_id,
    cart_id,
    order_type,
    recipient_phone,
    order_price,
    order_options,
  } = req.body;

  if (!user_id || !cart_id || !order_type || !recipient_phone || order_price == null) {
    return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
  }

  try {
    // 1. 주문 생성
    const order = await prisma.order.create({
      data: {
        user_id,
        cart_id,
        order_type,
        recipient_phone,
        order_price,
        order_options,
      },
    });

    // 2. user 조회
    const user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user) return res.status(404).json({ message: '해당 user_id가 존재하지 않습니다.' });

    // 3. cartItems 조회 (cart_id 기반)
    const cartItems = await prisma.cartItem.findMany({
      where: { cart_id },
    });

    // 4. notionService 호출
    await createNotionOrderPage({
      orderedAt: order.created_at,
      userRoadAddress: user?.user_road_address || "",
      userPhone: user?.user_phone || "",
      recipientPhone: order.recipient_phone,
      orderType: order.order_type,
      orderPrice: order.order_price,
      orderOptions: order.order_options,
      orderItems: cartItems.map(item => ({
        product_type: item.product_type as ProductType,
        item_count: item.item_count,
        unit_price: item.unit_price ?? 0,
        item_options: item.item_options,
      })),
    }).catch(err => console.error("[Notion Sync Error]", err));

    // 5. 응답
    return res.status(201).json({
      order_id: order.order_id,
      user_id: order.user_id,
      cart_id: order.cart_id,
      order_type: order.order_type,
      recipient_phone: order.recipient_phone,
      order_price: order.order_price,
      order_options: order.order_options,
      created_at: order.created_at,
    });
  } catch (err: any) {
    console.error("Order creation error:", err.message);
    return res.status(500).json({ message: "서버 내부 오류로 주문을 처리할 수 없습니다." });
  }
}

export async function getOrdersByUser(req: Request, res: Response) {
  const user_id = Number(req.query.user_id);
  if (isNaN(user_id)) {
    return res.status(400).json({ message: "유효한 user_id를 쿼리스트링으로 입력하세요." });
  }
  try {
    // order.user_id 기준 조회
    const orders = await prisma.order.findMany({
      where: { user_id },
      orderBy: { created_at: "desc" },
      include: {
        order_items: {
          select: {
            order_item_id: true,
            product_type: true,
            unit_price: true,
            item_count: true,
            item_options:true
          }
        }
      },
    });

    return res.status(200).json({
      orders: orders.map(order => ({
        order_id: order.order_id,
        cart_id: order.cart_id,
        order_type: order.order_type,
        recipient_phone: order.recipient_phone,
        order_price: order.order_price,
        order_options: order.order_options,
        created_at: order.created_at,
        order_items: order?.order_items ?? [],
      })),
    });
  } catch (err: any) {
    console.error("[GET /orders?user_id=X] error:", err.message);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
}

export async function getOrderById(req: Request, res: Response) {
  const { order_id } = req.params;

  if (!order_id) {
    return res.status(400).json({ message: "order_id가 필요합니다." });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { order_id },
      include: {
        order_items: {
          select: {
            order_item_id: true,
            product_type: true,
            unit_price: true,
            item_count: true,
            item_options: true,
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: "해당 주문을 찾을 수 없습니다." });
    }

    return res.status(200).json({
      order_id: order.order_id,
      cart_id: order.cart_id,
      order_type: order.order_type,
      recipient_phone: order.recipient_phone,
      order_price: order.order_price,
      order_options: order.order_options,
      created_at: order.created_at,
      order_items: order.order_items ?? [],
    });
  } catch (error) {
    console.error("getOrderById error:", error);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
}