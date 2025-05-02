import { create } from "zustand";

export type CabinetItem = {
  category: "cabinet";
  slug: "lower" | "upper" | "open" | "flap" | null;
  color: string;
  handleType: "channel" | "outer" | "pull-down" | null;
  compartmentCount: number | null;
  flapStayType: string | null;
  material: string;
  thickness: string;
  width: number | null;
  height: number | null;
  depth: number | null;
  option: string[];
  finishType: "makura" | "urahome" | null;
  drawerType: string | null;
  railType: string | null;
  orderRequests: string | null;
  count: number | null;
  price: number | null;
};

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
  handleType: null,
  compartmentCount: null,
  flapStayType: null,
  material: "",
  thickness: "",
  width: null,
  height: null,
  depth: null,
  option: [],
  finishType: null,
  drawerType: null,
  railType: null,
  orderRequests: null,
  count: null,
  price: null,
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
