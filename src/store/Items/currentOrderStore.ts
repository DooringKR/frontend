import { AccessoryItem, CabinetItem, DoorItem, FinishItem, HardwareItem } from "@/types/itemTypes";
import { create } from "zustand";

type OrderItem = DoorItem | FinishItem | CabinetItem | AccessoryItem | HardwareItem | null;

interface CurrentOrderStore {
  currentItem: OrderItem | null;
  setCurrentItem: (item: OrderItem) => void;
  clearCurrentItem: () => void;
}

export const useCurrentOrderStore = create<CurrentOrderStore>(set => ({
  currentItem: null,
  setCurrentItem: item => set({ currentItem: item }),
  clearCurrentItem: () => set({ currentItem: null }),
}));
