import { create } from "zustand";

export type AccessoryItem = {
  category: "accessory";
  slug: "sinkBowl" | "hood" | "cooktop" | null;
  madeBy: string;
  model: string;
  accessoryRequests: string | null;
  count: number | null;
  price: number | null;
};

interface AccessoryStore {
  accessoryItem: AccessoryItem;
  updateItem: (payload: Omit<AccessoryItem, "count" | "price"> & { price: number }) => void;
  updatePriceAndCount: (price: number, count: number) => void;
  resetAccessoryItem: () => void;
}

const initialState: AccessoryItem = {
  category: "accessory",
  slug: null,
  madeBy: "",
  model: "",
  accessoryRequests: null,
  count: null,
  price: null,
};

const useAccessoryStore = create<AccessoryStore>(set => ({
  accessoryItem: initialState,
  updateItem: payload => set(state => ({
    accessoryItem: { ...state.accessoryItem, ...payload },
  })),
  updatePriceAndCount: (price, count) =>
    set(state => ({ accessoryItem: { ...state.accessoryItem, price, count } })),
  resetAccessoryItem: () => set({ accessoryItem: initialState }),
}));

export default useAccessoryStore;
