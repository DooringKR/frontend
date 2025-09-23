import { Cart } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Cart";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  // cartItems: CartItem[];
  //cartItems 배열 길이가 cart_count
  cartId: string | null;
  // setCartItems: (items: CartItem[]) => void;
  setCartId: (id: string) => void;
  // clearCartItems: () => void;
  incrementCartCount: (incrementBy: number) => void;
  decrementCartCount: (decrementBy: number) => void;
}

const useCartStore = create<CartStore>()(
  persist(
    set => ({
      cart: null,
      setCart: cart => set({ cart: cart }),
      // cartItems: [],
      cartId: null,
      // setCartItems: items => set({ cartItems: items }),
      setCartId: id => set({ cartId: id }),
      // clearCartItems: () => set({ cart: null, cartItems: [], cartId: null }),
      // cart_count를 증가시키는 메서드
      incrementCartCount: (incrementBy: number = 1) =>
        set(state => {
          if (!state.cart) return {};
          // Cart 인스턴스의 메서드와 타입을 유지하기 위해 Cart의 복사본을 생성
          const newCart = Object.create(Object.getPrototypeOf(state.cart));
          Object.assign(newCart, state.cart);
          newCart.cart_count = (state.cart.cart_count || 0) + incrementBy;
          return { cart: newCart };
        }),

      // cart_count를 감소시키는 메서드
      decrementCartCount: (decrementBy: number = 1) =>
        set(state => {
          if (!state.cart) return {};
          // Cart 인스턴스의 메서드와 타입을 유지하기 위해 Cart의 복사본을 생성
          const newCart = Object.create(Object.getPrototypeOf(state.cart));
          Object.assign(newCart, state.cart);
          newCart.cart_count = Math.max(0, (state.cart.cart_count || 0) - decrementBy);
          return { cart: newCart };
        }),
    }),
    {
      name: "cart-storage", // localStorage 키 이름
    },
  ),
);

export default useCartStore;
