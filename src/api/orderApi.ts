import { OrderRequest, OrderResponse } from "@/types/apiType";

export async function createOrder(order: OrderRequest): Promise<OrderResponse> {
  const response = await fetch("/api/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error("주문 요청 실패");
  }

  const data: OrderResponse = await response.json();
  return data;
}
