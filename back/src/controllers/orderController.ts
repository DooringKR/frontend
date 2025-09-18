// 내부에서 직접 호출 가능한 주문 완성 로직 함수
async function completeOrderInternal(order_id: string) {
  try {
    // 주문 정보 조회
    const order = await prisma.order.findUnique({ where: { order_id } });
    if (!order) {
      console.error("[completeOrderInternal] 해당 주문을 찾을 수 없습니다.");
      return;
    }
    // 사용자 정보 조회
    const user = await prisma.user.findUnique({ where: { id: order.user_id } });
    // order_items 조회
    const orderItems = await prisma.orderItem.findMany({
      where: { order_id },
      select: {
        product_type: true,
        item_count: true,
        unit_price: true,
        item_options: true,
        image_url: true,
      }
    });
    // 노션 페이지 생성
    await createNotionOrderPage({
      orderedAt: order.created_at,
      userRoadAddress: user?.user_road_address || "",
      userPhone: user?.user_phone || "",
      recipientPhone: order.recipient_phone,
      orderType: order.order_type,
      orderPrice: order.order_price,
      orderOptions: order.order_options,
      orderItems: orderItems,
    });
    // 주문 견적서 Apps Script로 전송
    await sendOrderToAppsScript({
      created_at: order.created_at,
      delivery_type: order.order_type,
      recipient_phone: order.recipient_phone,
      order_options: order.order_options,
      order_items: orderItems,
    });
    console.log("[completeOrderInternal] 노션/구글 처리 완료");
  } catch (err: any) {
    console.error("[completeOrderInternal] error:", err.message);
  }
}
// src/controllers/orderController.ts


import { Request, Response } from "express";
import prisma from "../prismaClient";
import { generateAndUploadOrderItemImage } from "../services/imageService";
import { createNotionOrderPage } from "../services/notionService";
import amplitude from "../amplitudeClient";
import axios from 'axios';

// Amplitude user_id 변환 헬퍼
function toAmplitudeUserId(userId: number | string | null | undefined): string | undefined {
  if (userId === null || userId === undefined) return undefined;
  return `user_${String(userId)}`;
}

const VALID_SHIPPING_METHODS = ["직접 픽업하러 갈게요", "현장으로 배송해주세요"]; 
const VALID_MATERIAL_TYPES = ["문짝", "마감재", "부분장", "하드웨어", "부속", "기타(고객센터 직접 문의)"];

const NOTION_MATERIAL_TYPE_MAP: Record<string, string> = {
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
    console.log('[OrderController][DEBUG] 주문 생성 요청:', {
      user_id,
      cart_id,
      order_type,
      recipient_phone,
      order_price,
      order_options,
    });
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
      include: {
        order_items: true,
      },
    });
    console.log('[OrderController][DEBUG] 주문 생성 결과:', order);

    // Amplitude Purchased 이벤트 전송
    try {
      const amplitudeUserId = toAmplitudeUserId(order.user_id);
      const itemCount = order.order_items ? order.order_items.length : 0;
      amplitude.track({
        event_type: "Purchased",
        user_id: amplitudeUserId,
        event_properties: {
          order_id: order.order_id,
          order_price: order.order_price,
          item_count: itemCount,
          fulfillment_type: String(order.order_type).toLowerCase(),
        },
      });
    } catch (e) {
      console.warn('[OrderController][WARN] Amplitude Purchased 이벤트 전송 실패', e);
    }

    // 2. user 조회
    const user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user) {
      console.error('[OrderController][ERROR] user_id 조회 실패:', user_id);
      return res.status(404).json({ message: '해당 user_id가 존재하지 않습니다.' });
    }
    console.log('[OrderController][DEBUG] user 조회 결과:', user);

    // 3. 비동기 후처리 (orderItem 생성 및 completeOrder)
    setImmediate(async () => {
      try {
        // 장바구니 아이템 조회 (cart_id 기준)
        const cartItems = await prisma.cartItem.findMany({
          where: { cart_id: order.cart_id },
        });
        console.log('[OrderController][DEBUG][비동기] cartItems 조회 결과:', cartItems);
        // orderItem 생성
        for (const item of cartItems) {
          // 1. orderItem 생성
          console.log('[OrderController][DEBUG][비동기] orderItem 생성 요청:', item);
          const newOrderItem = await prisma.orderItem.create({
            data: {
              order_id: order.order_id,
              product_type: item.product_type,
              unit_price: item.unit_price ?? 0,
              item_count: item.item_count ?? 1,
              item_options: item.item_options as any,
            },
          });
          console.log('[OrderController][DEBUG][비동기] orderItem 생성 결과:', newOrderItem);
          // 2. 이미지 생성 및 image_url 업데이트
          try {
            console.log('[OrderController][DEBUG][비동기] 이미지 생성 요청:', {
              order_id: newOrderItem.order_id,
              order_item_id: newOrderItem.order_item_id,
              product_type: newOrderItem.product_type,
              unit_price: newOrderItem.unit_price,
              item_count: newOrderItem.item_count,
              item_options: newOrderItem.item_options,
            });
            const image_url = await generateAndUploadOrderItemImage({
              order_id: newOrderItem.order_id,
              order_item_id: newOrderItem.order_item_id,
              product_type: newOrderItem.product_type,
              unit_price: newOrderItem.unit_price,
              item_count: newOrderItem.item_count,
              item_options: newOrderItem.item_options,
            });
            console.log('[OrderController][DEBUG][비동기] 이미지 생성 결과 image_url:', image_url);
            if (!image_url) {
              console.warn('[OrderController][WARN][비동기] image_url이 null/undefined입니다.');
            }
            await prisma.orderItem.update({
              where: { order_item_id: newOrderItem.order_item_id },
              data: { image_url },
            });
            const updated = await prisma.orderItem.findUnique({ where: { order_item_id: newOrderItem.order_item_id } });
            console.log('[OrderController][DEBUG][비동기] DB 업데이트 후 orderItem:', updated);
          } catch (e) {
            console.warn('[OrderController][WARN][비동기] 이미지 생성/업로드 실패', e);
          }
        }
        // 주문 완성 처리 (노션/구글 등)
        console.log('[OrderController][DEBUG][비동기] completeOrderInternal 호출:', order.order_id);
        await completeOrderInternal(order.order_id);
      } catch (err) {
        console.error('[createOrder][비동기 후처리] error:', err);
      }
    });

    // 4. 응답 반환 (주문 생성만 완료 후 바로 반환)
    console.log('[OrderController][DEBUG] 최종 응답 반환:', {
      order_id: order.order_id,
      user_id: order.user_id,
      cart_id: order.cart_id,
      order_type: order.order_type,
      recipient_phone: order.recipient_phone,
      order_price: order.order_price,
      order_options: order.order_options,
      created_at: order.created_at,
    });
    res.status(201).json({
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

interface AppsScriptOrderPayload {
  created_at: Date | string;
  delivery_type: string;
  recipient_phone: string;
  order_options: any;
  order_items: any[];
}

async function sendOrderToAppsScript(order: AppsScriptOrderPayload) {
  const url = 
  'https://script.google.com/macros/s/AKfycbxRevHahHKRnI5CIj0oXW1M2DBsrUFdj8f6FQfVNjE2x_JIxaUcMczfIzcoNY1iSvphvQ/exec'
  ;
  // order 객체는 이미 필요한 필드만 포함됨
  await axios.post(url, order);
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
  orders: orders.map((order: any) => ({
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

export async function completeOrder(req: Request, res: Response) {
  const { order_id } = req.params;
  if (!order_id) {
    return res.status(400).json({ message: "order_id가 필요합니다." });
  }
  try {
    // 주문 정보 조회
    const order = await prisma.order.findUnique({ where: { order_id } });
    if (!order) {
      return res.status(404).json({ message: "해당 주문을 찾을 수 없습니다." });
    }
    // 사용자 정보 조회
    const user = await prisma.user.findUnique({ where: { id: order.user_id } });
    // order_items 조회
    const orderItems = await prisma.orderItem.findMany({
      where: { order_id },
      select: {
        product_type: true,
        item_count: true,
        unit_price: true,
        item_options: true,
        image_url: true,
      }
    });
    // 노션 페이지 생성
    await createNotionOrderPage({
      orderedAt: order.created_at,
      userRoadAddress: user?.user_road_address || "",
      userPhone: user?.user_phone || "",
      recipientPhone: order.recipient_phone,
      orderType: order.order_type,
      orderPrice: order.order_price,
      orderOptions: order.order_options,
      orderItems: orderItems,
    });

    // 주문 견적서 Apps Script로 전송
    await sendOrderToAppsScript({
      created_at: order.created_at,
      delivery_type: order.order_type,
      recipient_phone: order.recipient_phone,
      order_options: order.order_options,
      order_items: orderItems,
    });
    return res.status(200).json({ message: "노션 페이지 생성 완료" });
  } catch (err: any) {
    console.error("[completeOrder] error:", err.message);
    return res.status(500).json({ message: "노션 페이지 생성 실패" });
  }
}