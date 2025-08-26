import { HardwareItem } from "@/types/itemTypes";
import { create } from "zustand";

interface HardwareStore {
  hardwareItem: HardwareItem;
  updateItem: (payload: Omit<HardwareItem, "count" | "price"> & { price: number }) => void;
  updatePriceAndCount: (price: number, count: number) => void;
  resetHardwareItem: () => void;
}

const initialState: HardwareItem = {
  category: "hardware",
  slug: null,
  madeBy: "",
  model: "",
  hardwareRequest: null,
  count: null,
  price: null,
  cartItemId: undefined,
};

const useHardwareStore = create<HardwareStore>(set => ({
  hardwareItem: initialState,
  updateItem: payload =>
    set(state => ({
      hardwareItem: { ...state.hardwareItem, ...payload },
    })),
  updatePriceAndCount: (price, count) =>
    set(state => ({ hardwareItem: { ...state.hardwareItem, price, count } })),
  resetHardwareItem: () => set({ hardwareItem: initialState }),
}));

export default useHardwareStore;
