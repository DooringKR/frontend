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

  return await response.json();
}

//아이템 삭제
export const deleteCartItem = async (cartItemId: number) => {
  console.log("삭제 요청 보냄:", cartItemId); // ✅ 추가
  const res = await fetch(`http://localhost:3001/cart_item/${cartItemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("해당 장바구니 아이템이 존재하지 않습니다.");
    }
    throw new Error("장바구니 아이템 삭제 실패");
  }

  console.log("삭제 성공:", cartItemId); // ✅ 추가
};
