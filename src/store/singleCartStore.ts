import { FinishEdgeCount, Location } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DoorCart = {
  type: "door";
  category?: string | null;
  color?: string | null;
  width?: number | null;
  height?: number | null;
  boringNum?: 2 | 3 | 4 | null;
  boringDirection?: string | null;
  boringSize?: (number | null)[];
  request?: string | null;
  door_location?: string | null;
  addOn_hinge?: boolean | null;
};

export type CabinetCart = {
  type: "cabinet";
  category?: string | null;
  color?: string | null;
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  bodyMaterial?: string | null;
  request?: string | null;
  handleType?: string | null;
  finishType?: string | null;
  showBar?: string | null;
  drawerType?: string | null;
  railType?: string | null;
  riceRail?: string | null;
  lowerDrawer?: string | null;
  cabinet_location?: string | null;
  addOn_construction?: boolean | null;
  legType?: string | null;
};

export type HardwareCart = {
  type: "hardware";
  category?: string | null;
  hardware_madeby?: string | null;
  hardware_size?: string | null;
  request?: string | null | undefined;
};

export type AccessoryCart = {
  type: "accessory";
  category?: string | null;
  accessory_madeby?: string | null;
  accessory_model?: string | null;
  request?: string | null;
};

export type FinishCart = {
  type: "finish";
  category?: string | null;
  edge_count?: FinishEdgeCount | null;
  color?: string | null;
  depth?: number | null;
  height?: number | null;
  depthIncrease?: number | null;
  heightIncrease?: number | null;
  request?: string | null;
  finish_location?: Location | null;
};

export type SingleCart = CabinetCart | HardwareCart | AccessoryCart | FinishCart | DoorCart;

interface SingleCartState {
  cart: SingleCart;
  setCart: (cart: SingleCart) => void;
  reset: () => void;
}

export const useSingleCartStore = create<SingleCartState>()(
  persist(
    set => ({
      cart: {} as SingleCart,
      setCart: (cart: SingleCart) => set({ cart }),
      reset: () => set({ cart: {} as SingleCart }),
    }),
    {
      name: "single-cart-storage", // localStorage key
    },
  ),
);
