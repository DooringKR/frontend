import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

export type HardwareCart = {
    type: "hardware";
    category?: string | null;
    manufacturer?: string | null;
    size?: string | null;
    request?: string | null | undefined;
}

export type AccessoryCart = {
    type: "accessory";
    category?: string | null;
    manufacturer?: string | null;
    modelName?: string | null;
    request?: string | null;
}

export type FinishCart = {
    type: "finish";
    color?: string | null;
    depth?: string | null;
    height?: string | null;
    depthIncrease?: string | null;
    heightIncrease?: string | null;
    request?: string | null;
}


export type SingleCart = CabinetCart | HardwareCart | AccessoryCart | FinishCart;

interface SingleCartState {
    cart: SingleCart;
    setCart: (cart: SingleCart) => void;
    reset: () => void;
}

export const useSingleCartStore = create<SingleCartState>()(
    persist(
        (set) => ({
            cart: {} as SingleCart,
            setCart: (cart: SingleCart) => set({ cart }),
            reset: () => set({ cart: {} as SingleCart }),
        }),
        {
            name: 'single-cart-storage', // localStorage key
        }
    )
);

// interface SingleCartState {
//     type: "door" | "cabinet" | "finish" | "hardware" | "accessory" | "custom" | null;
//     category: string | null;
//     materialId: string | null;
//     quantity: number;
//     color: string | null;
//     request: string;
//     manufacturer: string | null;
//     size: string | null;
//     modelName: string | null;
//     // 필요에 따라 추가 필드
//     setType: (type: "door" | "cabinet" | "finish" | "hardware" | "accessory" | "custom" | null) => void;
//     setCategory: (category: string | null) => void;
//     setMaterialId: (id: string | null) => void;
//     setQuantity: (qty: number) => void;
//     setColor: (color: string | null) => void;
//     setRequest: (req: string) => void;
//     setManufacturer: (manufacturer: string | null) => void;
//     setSize: (size: string | null) => void;
//     setModelName: (modelName: string | null) => void;
//     reset: () => void;
// }

// export const useSingleCartStore = create<SingleCartState>()(
//     persist(
//         (set) => ({
//             type: null,
//             category: null,
//             materialId: null,
//             quantity: 1,
//             color: null,
//             request: '',
//             manufacturer: null,
//             size: null,
//             modelName: null,
//             setType: (type) => set({ type }),
//             setCategory: (category) => set({ category }),
//             setMaterialId: (id) => set({ materialId: id }),
//             setQuantity: (qty) => set({ quantity: qty }),
//             setColor: (color) => set({ color }),
//             setRequest: (req) => set({ request: req }),
//             setManufacturer: (manufacturer) => set({ manufacturer }),
//             setSize: (size) => set({ size }),
//             setModelName: (modelName) => set({ modelName }),
//             reset: () => set({ materialId: null, quantity: 1, color: null, request: '', manufacturer: null, size: null, modelName: null }),
//         }),
//         {
//             name: 'single-cart-storage', // localStorage key
//         }
//     )
// ); 