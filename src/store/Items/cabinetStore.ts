import { CabinetItem } from "@/types/itemTypes";
import { create } from "zustand";

interface CabinetStore {
  cabinetItem: CabinetItem;
  updateItem: (payload: Omit<CabinetItem, "count" | "price"> & { price: number }) => void;
  updatePriceAndCount: (price: number, count: number) => void;
  resetCabinetItem: () => void;
}

const initialState: CabinetItem = {
  category: "cabinet",
  slug: null,
  color: "",
  width: null,
  height: null,
  depth: null,
  cabinetRequests: null,
  handleType: null,

  finishType: null,
  bodyType: null,
  bodyTypeDirectInput: null,

  absorberType: null,
  absorberTypeDirectInput: null,

  drawerType: null,
  railType: null,

  addRiceCookerRail: null,
  addBottomDrawer: null,

  count: null,
  price: null,
  cartItemId: undefined,

  compartmentCount: null,
  flapStayType: null,
  material: "",
  thickness: "",
  option: [],
};

const useCabinetStore = create<CabinetStore>(set => ({
  cabinetItem: initialState,
  updateItem: payload =>
    set(state => ({
      cabinetItem: { ...state.cabinetItem, ...payload },
    })),
  updatePriceAndCount: (price, count) =>
    set(state => ({ cabinetItem: { ...state.cabinetItem, price, count } })),
  resetCabinetItem: () => set({ cabinetItem: initialState }),
}));

export default useCabinetStore;
