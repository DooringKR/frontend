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
  console.log("장바구니 아이템 조회 API 호출:", userId);

  const response = await fetch(`/api/cart/${userId}/items`, {
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
  console.log("삭제 요청 보냄:", cartItemId);

  const res = await fetch(`/api/cart_item/${cartItemId}`, {
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

  console.log("삭제 성공:", cartItemId);
};

// 아이템 수량 변경

export const updateCartItem = async (cartItemId: number, itemOptions: any, itemCount: number) => {
  try {
    const res = await fetch(`/api/cart_item/${cartItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item_options: itemOptions,
        item_count: itemCount,
      }),
    });

    console.log("📡 응답 status:", res.status);
    const text = await res.text();
    console.log("📄 응답 내용:", text);

    if (!res.ok) {
      throw new Error(`수정 실패: ${res.status}`);
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("❌ updateCartItem 오류:", err);
    throw err;
  }
};

export const getCartItemById = async (cartItemId: number) => {
  const res = await fetch(`/api/cart_item/${cartItemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("장바구니 아이템 조회 실패");
  }

  return await res.json();
};
