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
  color?: string | null;
  depth?: number | null;
  height?: number | null;
  depthIncrease?: number | null;
  heightIncrease?: number | null;
  request?: string | null;
};

export type SingleCart = CabinetCart | HardwareCart | AccessoryCart | FinishCart | DoorCart;

interface SingleCartState {
  cart: SingleCart;
  setCart: (cart: SingleCart) => void;
  reset: () => void;
  // 옵션 수정용
  isEditing: boolean;
  editingCartItemId: number | null;
  setEditing: (editing: boolean) => void;
  setEditingCartItemId: (id: number | null) => void;
}

export const useSingleCartStore = create<SingleCartState>()(
  persist(
    set => ({
      cart: {} as SingleCart,
      setCart: (cart: SingleCart) => set({ cart }),
      reset: () =>
        set({
          cart: {} as SingleCart,
          isEditing: false,
          editingCartItemId: null,
        }),
      // 옵션 수정용
      isEditing: false,
      editingCartItemId: null,
      setEditing: editing => set({ isEditing: editing }),
      setEditingCartItemId: id => set({ editingCartItemId: id }),
    }),
    {
      name: "single-cart-storage", // localStorage key
    },
  ),
);
