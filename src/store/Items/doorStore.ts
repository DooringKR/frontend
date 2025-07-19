import { DoorItem } from "@/types/itemTypes";
import { create } from "zustand";

interface DoorStore {
  doorItem: DoorItem;
  updateItem: (payload: Partial<Omit<DoorItem, "category">>) => void;
  updatePriceAndCount: (price: number, count: number) => void;
  resetDoorItem: () => void;
}

const initialState: DoorItem = {
  category: "door",
  slug: null,
  color: "",
  width: null,
  height: null,
  hinge: {
    hingeCount: null,
    hingePosition: null,
    topHinge: null,
    bottomHinge: null,
    middleHinge: null,
    middleTopHinge: null,
    middleBottomHinge: null,
  },
  doorRequest: null,
  count: null,
  price: null,
  cartItemId: undefined,
};

const useDoorStore = create<DoorStore>(set => ({
  doorItem: initialState,

  updateItem: payload =>
    set(state => ({
      doorItem: {
        ...state.doorItem,
        ...payload,
        hinge: {
          ...state.doorItem.hinge,
          ...(payload.hinge || {}),
        },
      },
    })),

  updatePriceAndCount: (price, count) =>
    set(state => ({
      doorItem: { ...state.doorItem, price, count },
    })),

  resetDoorItem: () => set(() => ({ doorItem: initialState })),
}));

export default useDoorStore;
