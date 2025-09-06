// src/controllers/orderController.ts

import { Request, Response } from "express";
import prisma from "../prismaClient";
import { createNotionOrderPage } from "../services/notionService";
// ProductType enum 직접 명시 또는 문자열 비교

import axios from 'axios';

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

    // 3. 응답
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

interface AppsScriptOrderPayload {
  created_at: Date | string;
  delivery_type: string;
  recipient_phone: string;
  order_options: any;
  order_items: any[];
}

async function sendOrderToAppsScript(order: AppsScriptOrderPayload) {
  const url = 'https://script.google.com/macros/s/AKfycbyvcUyurVprdhThlcK2UmaUwzleYcZcU7T9yiecG-NLJ-llWUFmHBk4qW6WAFBPUxpKLg/exec';
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