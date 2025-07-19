// /api/cartApi.ts

export interface CartItem {
  cart_item_id: number;
  product_type: "DOOR" | "FINISH" | "CABINET" | "HARDWARE" | "ACCESSORY";
  unit_price: number;
  item_count: number;
  item_options: Record<string, any>;
}

export interface CartResponse {
  cart_id: number;
  user_id: number;
  cart_count: number;
  items: CartItem[];
}

// 장바구니 get
export async function getCartItems(userId: number): Promise<CartResponse> {
  const response = await fetch(`http://localhost:3001/cart/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "장바구니 조회에 실패했습니다.");
  }

  return await response.json(); // { cart_id, user_id, cart_count, items: [...] }
}

//아이템 삭제
export const deleteCartItem = async (cartItemId: number) => {
  const res = await fetch(`http://localhost:3001/cart_item/${cartItemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("장바구니 아이템 삭제 실패");
  }
};
