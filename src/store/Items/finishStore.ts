import { create } from "zustand";

export type FinishItem = {
  category: "finish";
  color: string;
  depth: {
    baseDepth: number | null;
    additionalDepth: number | null;
  };
  height: {
    baseHeight: number | null;
    additionalHeight: number | null;
  };
  finishRequest: string | null;
  count: number | null;
  price: number | null;
};

interface FinishStore {
  finishItem: FinishItem;
  updateItem: (payload: Omit<FinishItem, "count" | "price"> & { price: number }) => void;
  updatePriceAndCount: (price: number, count: number) => void;
  resetFinishItem: () => void;
}

const initialState: FinishItem = {
  category: "finish",
  color: "",
  depth: { baseDepth: null, additionalDepth: null },
  height: { baseHeight: null, additionalHeight: null },
  finishRequest: null,
  count: null,
  price: null,
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
