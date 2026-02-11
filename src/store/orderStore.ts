import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

/** confirm 페이지에서 사용할 직전 주문 데이터 (localStorage 타이밍 이슈 대비) */
export interface RecentOrderForConfirm {
  order_id: string | undefined;
  order: any;
  cartItems: any[];
}

interface OrderStore {
  order: any; // 또는 적절한 Order 타입
  setOrder: (order: any) => void;
  updateOrder: (updates: Partial<any>) => void;
  clearOrder: () => void;
  /** confirm 페이지 전용: push 직전에 설정, confirm에서 읽은 뒤 clear */
  recentOrderForConfirm: RecentOrderForConfirm | null;
  setRecentOrderForConfirm: (payload: RecentOrderForConfirm | null) => void;
  clearRecentOrderForConfirm: () => void;
}

const orderStoreImpl = (set: any) => ({
  order: null,
  recentOrderForConfirm: null as RecentOrderForConfirm | null,

  setOrder: (order: any) => set({ order }),

  updateOrder: (updates: Partial<any>) =>
    set(
      (state: OrderStore) => ({
        order: state.order ? { ...state.order, ...updates } : updates,
      }),
      false,
      "updateOrder"
    ),

  clearOrder: () => set({ order: null }, false, "clearOrder"),

  setRecentOrderForConfirm: (payload: RecentOrderForConfirm | null) =>
    set({ recentOrderForConfirm: payload }, false, "setRecentOrderForConfirm"),

  clearRecentOrderForConfirm: () =>
    set({ recentOrderForConfirm: null }, false, "clearRecentOrderForConfirm"),
});

export const useOrderStore = create<OrderStore>()(
  devtools(
    persist(
      (set) => orderStoreImpl(set),
      {
        name: "order-storage",
        partialize: (state) => ({ order: state.order }), // recentOrderForConfirm은 persist 제외
      },
    ),
    {
      name: "order-store", // devtools에서 보여질 이름
    }
  ),
);
