import { create } from "zustand";

export type DoorSlug = "normal" | "flap" | "drawer";

export type DoorItem = {
  category: "door";
  slug: DoorSlug | null;
  color: string;
  width: number | null;
  height: number | null;
  hinge: {
    hingeCount: number | null;
    hingePosition: "left" | "right" | null;
    topHinge: number | null;
    bottomHinge: number | null;
    middleHinge: number | null;
    middleTopHinge: number | null;
    middleBottomHinge: number | null;
  };
  doorRequest: string | null;
  count: number | null;
  price: number | null;
};

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
