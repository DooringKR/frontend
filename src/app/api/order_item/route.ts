import { NextRequest, NextResponse } from "next/server";

interface CreateOrderItemPayload {
  order_id: string;
  product_type: "DOOR" | "FINISH" | "CABINET" | "HARDWARE" | "ACCESSORY";
  unit_price: number;
  item_count: number;
  item_options: Record<string, any>;
}

interface CreateOrderItemResponse {
  order_item_id: number;
  order_id: string;
  product_type: string;
  unit_price: number;
  item_count: number;
  item_options: Record<string, any>;
}

// ✅ 백엔드에 실제 요청 보내는 함수
async function createOrderItemInBackend(
  itemPayload: CreateOrderItemPayload,
): Promise<CreateOrderItemResponse> {
  console.log("📦 백엔드에 order_item 생성 요청:", itemPayload);

  const response = await fetch("https://dooring-backend.onrender.com/order_item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemPayload),
  });

  console.log("📡 백엔드 응답 상태:", response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ order_item 생성 실패:", errorText);
    throw new Error("order_item 생성 실패");
  }

  const data = await response.json();
  console.log("✅ 백엔드 order_item 생성 성공:", data);
  return data;
}

// ✅ Next.js API route handler
export async function POST(request: NextRequest) {
  console.log("🚀 /api/order_item POST 요청 시작");

  try {
    const body = await request.json();
    console.log("📝 요청 바디:", body);

    const createdItem = await createOrderItemInBackend(body);
    console.log("🎉 order_item 생성 완료:", createdItem);

    return NextResponse.json(createdItem);
  } catch (error) {
    console.error("💥 order_item 생성 중 에러:", error);
    return NextResponse.json(
      {
        error: `order_item 생성 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      },
      { status: 500 },
    );
  }
}
