import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

interface OrderStore {
  order: any; // 또는 적절한 Order 타입
  setOrder: (order: any) => void;
  updateOrder: (updates: Partial<any>) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderStore>()(
  devtools(
    persist(
      set => ({
        order: null,

        setOrder: order => set({ order }),

        updateOrder: updates =>
          set(state => ({
            order: state.order ? { ...state.order, ...updates } : updates
          }), false, "updateOrder"),

        clearOrder: () => set({ order: null }, false, "clearOrder"),
      }),

      {
        name: "order-storage",
      },
    ),
    {
      name: "order-store", // devtools에서 보여질 이름
    }
  ),
);
