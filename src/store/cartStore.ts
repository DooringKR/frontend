// interface CartStore {
//   cartItems: any[];
//   setCartItems: (items: any[]) => void;
// }
// const useCartStore = create<CartStore>((set) => ({
//   cartItems: [],
//   setCartItems: (items) => set({ cartItems: items }),
// }));
// export default useCartStore;
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  cartItems: any[];
  cartId: number | null;
  setCartItems: (items: any[]) => void;
  setCartId: (id: number) => void;
  clearCartItems: () => void;
}

const useCartStore = create<CartStore>()(
  persist(
    set => ({
      cartItems: [],
      cartId: null,
      setCartItems: items => set({ cartItems: items }),
      setCartId: id => set({ cartId: id }),
      clearCartItems: () => set({ cartItems: [], cartId: null }),
    }),
    {
      name: "cart-storage", // localStorage 키 이름
    },
  ),
);

export default useCartStore;
