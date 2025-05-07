import { create } from "zustand";

export type HardwareItem = {
  category: "hardware";
  slug: "hinge" | "rail" | "screw" | null;
  madeBy: string;
  model: string;
  hardwareRequests: string | null;
  count: number | null;
  price: number | null;
};

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
  hardwareRequests: null,
  count: null,
  price: null,
};

const useHardwareStore = create<HardwareStore>(set => ({
  hardwareItem: initialState,
  updateItem: payload => set(state => ({
    hardwareItem: { ...state.hardwareItem, ...payload },
  })),
  updatePriceAndCount: (price, count) =>
    set(state => ({ hardwareItem: { ...state.hardwareItem, price, count } })),
  resetHardwareItem: () => set({ hardwareItem: initialState }),
}));

export default useHardwareStore;
