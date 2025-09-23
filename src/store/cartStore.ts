import { Cart } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Cart";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  cartItems: CartItem[];
  //cartItems 배열 길이가 cart_count
  cartId: string | null;
  setCartItems: (items: CartItem[]) => void;
  setCartId: (id: string) => void;
  clearCartItems: () => void;
}

const useCartStore = create<CartStore>()(
  persist(
    set => ({
      cart: null,
      setCart: cart => set({ cart: cart }),
      cartItems: [],
      cartId: null,
      setCartItems: items => set({ cartItems: items }),
      setCartId: id => set({ cartId: id }),
      clearCartItems: () => set({ cart: null, cartItems: [], cartId: null }),
    }),
    {
      name: "cart-storage", // localStorage 키 이름
    },
  ),
);

export default useCartStore;
