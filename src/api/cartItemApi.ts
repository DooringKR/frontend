import useUserStore from "@/store/userStore";

// 장바구니 아이템 타입 정의
export interface CartItemRequest {
  product_type: "DOOR" | "FINISH" | "CABINET" | "HARDWARE" | "ACCESSORY";
  unit_price: number;
  item_count: number;
  item_options: Record<string, any>;
}

// 장바구니 아이템 추가
export async function addCartItem(cartItem: CartItemRequest): Promise<any> {
  const userStore = useUserStore.getState();
  const cart_id = userStore.cart_id;

  if (!cart_id) {
    throw new Error("장바구니 ID가 없습니다. 로그인을 확인해주세요.");
  }

  const requestData = {
    ...cartItem,
    cart_id: cart_id
  };

  const response = await fetch("https://dooring-backend.onrender.com/cart_item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "장바구니 아이템 추가에 실패했습니다.");
  }

  return await response.json();
}
