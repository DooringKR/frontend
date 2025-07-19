import { create } from "zustand";

// interface CartStore {
//   cartItems: any[];
//   setCartItems: (items: any[]) => void;
// }

// const useCartStore = create<CartStore>((set) => ({
//   cartItems: [],
//   setCartItems: (items) => set({ cartItems: items }),
// }));

// export default useCartStore;

interface CartStore {
  cartItems: any[];
  cartId: number | null;
  setCartItems: (items: any[]) => void;
  setCartId: (id: number) => void;
}

const useCartStore = create<CartStore>(set => ({
  cartItems: [],
  cartId: null,
  setCartItems: items => set({ cartItems: items }),
  setCartId: id => set({ cartId: id }),
}));
export default useCartStore;
