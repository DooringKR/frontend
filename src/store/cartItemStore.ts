import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface CartItemStore {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  addCartItem: (item: CartItem) => void;
  updateCartItem: (id: string, newItem: Partial<CartItem>) => void;
  removeCartItem: (id: string) => void;
  clearCartItems: () => void;
}

const useCartItemStore = create<CartItemStore>()(
  devtools(
    persist(
      set => ({
        cartItems: [],
        setCartItems: (items) => set({ cartItems: items }),
        addCartItem: (item) => set(state => ({ cartItems: [...state.cartItems, item] })),
        updateCartItem: (id, newItem) =>
          set(state => ({
            cartItems: state.cartItems.map(item =>
              item.id == id
                ? new CartItem({
                    ...item,
                    ...newItem,
                  })
                : item
            ),
          })),
        removeCartItem: (id) =>
          set(state => ({
            cartItems: state.cartItems.filter(item => item.id != id),
          })),
        clearCartItems: () => set({ cartItems: [] }),
      }),
      {
        name: "cartitem-storage", // localStorage 키 이름
      },
    ),
    {
      name: "cartitem-store", // devtools에서 표시될 이름
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
);

export default useCartItemStore;
