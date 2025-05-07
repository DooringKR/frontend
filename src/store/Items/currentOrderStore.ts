import { create } from "zustand";
import { DoorItem } from "./doorStore";
import { FinishItem } from "./finishStore";
import { CabinetItem } from "./cabinetStore";
import { AccessoryItem } from "./accessoryStore";
import { HardwareItem } from "./hardwareStore";

type OrderItem = DoorItem | FinishItem | CabinetItem | AccessoryItem | HardwareItem | null;

interface CurrentOrderStore {
  currentItem: OrderItem | null;
  setCurrentItem: (item: OrderItem) => void;
  clearCurrentItem: () => void;
}

export const useCurrentOrderStore = create<CurrentOrderStore>(set => ({
  currentItem: null,
  setCurrentItem: (item) => set({ currentItem: item }),
  clearCurrentItem: () => set({ currentItem: null }),
}));
