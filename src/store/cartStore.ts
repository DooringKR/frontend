import { create } from "zustand";

interface CartStore {
  cartItems: any[];
  setCartItems: (items: any[]) => void;
}

const useCartStore = create<CartStore>((set) => ({
  cartItems: [],
  setCartItems: (items) => set({ cartItems: items }),
}));

export default useCartStore;
