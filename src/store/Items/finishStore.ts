import { FinishItem } from "@/types/itemTypes";
import { create } from "zustand";

interface FinishStore {
  finishItem: FinishItem;
  updateItem: (payload: Omit<FinishItem, "count" | "price"> & { price: number }) => void;
  updatePriceAndCount: (price: number, count: number) => void;
  resetFinishItem: () => void;
}

const initialState: FinishItem = {
  category: "finish",
  color: "",
  baseDepth: null,
  additionalDepth: null,
  baseHeight: null,
  additionalHeight: null,
  finishRequest: null,
  count: null,
  price: null,
  cartItemId: undefined,
};

const useFinishStore = create<FinishStore>(set => ({
  finishItem: initialState,
  updateItem: payload =>
    set(state => ({
      finishItem: { ...state.finishItem, ...payload },
    })),
  updatePriceAndCount: (price, count) =>
    set(state => ({ finishItem: { ...state.finishItem, price, count } })),
  resetFinishItem: () => set({ finishItem: initialState }),
}));

export default useFinishStore;
