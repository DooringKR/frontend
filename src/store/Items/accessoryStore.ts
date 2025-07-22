import { AccessoryItem } from "@/types/itemTypes";
import { create } from "zustand";

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
  accessoryRequest: null,
  count: null,
  price: null,
  cartItemId: undefined,
};

const useAccessoryStore = create<AccessoryStore>(set => ({
  accessoryItem: initialState,
  updateItem: payload =>
    set(state => ({
      accessoryItem: { ...state.accessoryItem, ...payload },
    })),
  updatePriceAndCount: (price, count) =>
    set(state => ({ accessoryItem: { ...state.accessoryItem, price, count } })),
  resetAccessoryItem: () => set({ accessoryItem: initialState }),
}));

export default useAccessoryStore;
