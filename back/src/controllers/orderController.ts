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

  if (!user_id || !cart_id || !order_type || !recipient_phone || !order_price) {
    return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
  }

  try {
    // 1) 주문 생성
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

    // 2) cart_item에서 자재종류(product_type) 추출 (ENUM으로 관리)
    const cartItems = await prisma.cartItem.findMany({
      where: { cart_id: order.cart_id },
    });

    const orderJsonString = JSON.stringify(order, null, 2);
    const cartItemJsonString = JSON.stringify(cartItems, null, 2);

    const children = [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "Order JSON" }
          }]
        }
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { content: orderJsonString }
          }]
        }
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "Cart Items JSON" }
          }]
        }
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { content: cartItemJsonString }
          }]
        }
      }
    ];
    // 대표 product_type 하나 선정(첫번째 기준)
    const productType: ProductType | null = cartItems.length > 0 ? cartItems[0].product_type : null;
    // Notion에 보낼 한글값으로 매핑
    const materialType = productType ? NOTION_MATERIAL_TYPE_MAP[productType] : "";

    if (productType && !VALID_MATERIAL_TYPES.includes(materialType)) {
      console.warn(`[Notion Warning] 유효하지 않은 자재종류: ${materialType}`);
    }

    // 3) 배송방법 결정 (Notion DB 옵션과 완전히 일치해야 함)
    const shippingMethod =
      order.order_type === "DELIVERY"
        ? "현장으로 배송해주세요"
        : "픽업하러 오세요";

    // 4) Notion Orders 테이블에 새 페이지 생성(비동기, 오류 무시)
    createNotionOrderPage({
      orderedAt: order.created_at,
      customerName: String(order.user_id),
      recipientPhone: order.recipient_phone,
      shippingMethod,
      materialType,
      children
    }).catch((err) => console.error("[Notion Sync Error]", err));

    // 5) 응답
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
    return res
      .status(500)
      .json({ message: "서버 내부 오류로 주문을 처리할 수 없습니다." });
  }
}
