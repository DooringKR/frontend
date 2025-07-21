// 장바구니 아이템 타입 정의
export interface CartItemRequest {
  cart_id: number;
  product_type: "DOOR" | "FINISH" | "CABINET" | "HARDWARE" | "ACCESSORY";
  unit_price: number;
  item_count: number;
  item_options: Record<string, any>;
}

// 장바구니 아이템 추가
export async function addCartItem(cartItem: CartItemRequest): Promise<any> {
  const response = await fetch("https://dooring-backend.onrender.com/cart_item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cartItem),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "장바구니 아이템 추가에 실패했습니다.");
  }

  return await response.json();
}
