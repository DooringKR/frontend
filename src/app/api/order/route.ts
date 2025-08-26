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

interface OrderHistoryResponse {
  orders: CreateOrderResponse[];
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

async function getOrderHistoryFromBackend(userId: number) {
  console.log("📋 백엔드에서 주문 내역 조회 요청:", userId);

  const url = `https://dooring-backend.onrender.com/order/orders?user_id=${userId}`;
  console.log("🌐 요청 URL:", url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    console.log("📡 백엔드 응답 상태:", response.status, response.statusText);
    console.log("📡 백엔드 응답 헤더:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 백엔드 주문 내역 조회 실패:", response.status, response.statusText, errorText);
      throw new Error(`주문 내역 조회 실패: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ 백엔드 주문 내역 조회 성공:", data);

    return data;
  } catch (error) {
    console.error("🔍 백엔드 요청 중 네트워크 에러:", error);
    console.error("🔍 에러 상세 정보:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export async function GET(request: Request) {
  console.log("🚀 /api/order GET 요청 시작");
  console.log("🔍 요청 URL:", request.url);

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    console.log("🔍 추출된 user_id:", userId);

    if (!userId) {
      console.log("❌ user_id 파라미터가 없음");
      return NextResponse.json(
        { error: 'user_id 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    const userIdNumber = parseInt(userId, 10);
    console.log("🔍 파싱된 userIdNumber:", userIdNumber);

    if (isNaN(userIdNumber)) {
      console.log("❌ 유효하지 않은 user_id");
      return NextResponse.json(
        { error: '유효하지 않은 user_id입니다.' },
        { status: 400 }
      );
    }

    console.log("👤 사용자 ID:", userIdNumber);
    console.log("🔄 getOrderHistoryFromBackend 함수 호출 시작");
    const orderHistory = await getOrderHistoryFromBackend(userIdNumber);
    console.log("🎉 주문 내역 조회 완료:", orderHistory);

    return NextResponse.json(orderHistory);
  } catch (error) {
    console.error("💥 주문 내역 조회 중 에러:", error);
    return NextResponse.json(
      { error: `주문 내역 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
      { status: 500 }
    );
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
