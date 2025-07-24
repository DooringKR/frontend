// import { OrderRequest, OrderResponse } from "@/types/apiType";

// export async function createOrder(order: OrderRequest): Promise<OrderResponse> {
//   const response = await fetch("/api/order", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//     body: JSON.stringify(order),
//   });

//   if (!response.ok) {
//     throw new Error("주문 요청 실패");
//   }

//   const data: OrderResponse = await response.json();
//   return data;
// }

export interface CreateOrderPayload {
  user_id: number;
  cart_id: number;
  order_type: "DELIVERY" | "PICK_UP";
  recipient_phone: string;
  order_price: number;
  order_options: Record<string, any>; // JSONB 타입으로 처리
}

export interface CreateOrderResponse {
  order_id: string;
  user_id: number;
  cart_id: number;
  order_type: "DELIVERY" | "PICK_UP";
  recipient_phone: string;
  order_price: number;
  order_options: Record<string, any>;
  created_at: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  console.log("주문 생성 API 호출:", payload);

  const res = await fetch(`/api/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`주문 생성 실패: ${res.status} ${errorText}`);
  }

  return res.json();
}

export const createOrderItem = async (itemPayload: {
  order_id: string;
  product_type: "DOOR" | "FINISH" | "CABINET" | "HARDWARE" | "ACCESSORY";
  unit_price: number;
  item_count: number;
  item_options: any;
}) => {
  console.log("📦 order_item 요청 보냄:", itemPayload);

  const res = await fetch(`/api/order_item`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemPayload),
  });

  if (!res.ok) {
    console.error("❌ order_item 생성 실패:", await res.text());
    throw new Error("order_item 생성 실패");
  }

  const data = await res.json();
  console.log("✅ order_item 생성 성공:", data);

  return data;
};
