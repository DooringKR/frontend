import { NextResponse } from 'next/server';

interface CreateOrderPayload {
  user_id: number;
  cart_id: number;
  order_type: "DELIVERY" | "PICK_UP";
  recipient_phone: string;
  order_price: number;
  order_options: Record<string, any>;
}

interface CreateOrderResponse {
  order_id: string;
  user_id: number;
  cart_id: number;
  order_type: "DELIVERY" | "PICK_UP";
  recipient_phone: string;
  order_price: number;
  order_options: Record<string, any>;
  created_at: string;
}

async function createOrderInBackend(orderData: CreateOrderPayload) {
  console.log("📦 백엔드에서 주문 생성 요청:", orderData);

  try {
    const response = await fetch(`https://dooring-backend.onrender.com/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
      credentials: 'include',
    });

    console.log("📡 백엔드 응답 상태:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 백엔드 주문 생성 실패:", response.status, response.statusText, errorText);
      throw new Error(`주문 생성 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ 백엔드 주문 생성 성공:", data);

    return data;
  } catch (error) {
    console.error("🔍 백엔드 요청 중 네트워크 에러:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  console.log("🚀 /api/order POST 요청 시작");

  try {
    const body = await request.json();
    console.log("📝 요청 바디:", body);

    const orderData = await createOrderInBackend(body);
    console.log("🎉 주문 생성 완료:", orderData);

    return NextResponse.json(orderData);
  } catch (error) {
    console.error("💥 주문 생성 중 에러:", error);
    return NextResponse.json(
      { error: `주문 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
      { status: 500 }
    );
  }
}
