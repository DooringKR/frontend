import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SingleCartState {
    type: "door" | "cabinet" | "finish" | "hardware" | "accessory" | "custom" | null;
    category: string | null;
    materialId: string | null;
    quantity: number;
    color: string | null;
    request: string;
    manufacturer: string | null;
    size: string | null;
    modelName: string | null;
    // 필요에 따라 추가 필드
    setType: (type: "door" | "cabinet" | "finish" | "hardware" | "accessory" | "custom" | null) => void;
    setCategory: (category: string | null) => void;
    setMaterialId: (id: string | null) => void;
    setQuantity: (qty: number) => void;
    setColor: (color: string | null) => void;
    setRequest: (req: string) => void;
    setManufacturer: (manufacturer: string | null) => void;
    setSize: (size: string | null) => void;
    setModelName: (modelName: string | null) => void;
    reset: () => void;
}

export const useSingleCartStore = create<SingleCartState>()(
    persist(
        (set) => ({
            type: null,
            category: null,
            materialId: null,
            quantity: 1,
            color: null,
            request: '',
            manufacturer: null,
            size: null,
            modelName: null,
            setType: (type) => set({ type }),
            setCategory: (category) => set({ category }),
            setMaterialId: (id) => set({ materialId: id }),
            setQuantity: (qty) => set({ quantity: qty }),
            setColor: (color) => set({ color }),
            setRequest: (req) => set({ request: req }),
            setManufacturer: (manufacturer) => set({ manufacturer }),
            setSize: (size) => set({ size }),
            setModelName: (modelName) => set({ modelName }),
            reset: () => set({ materialId: null, quantity: 1, color: null, request: '', manufacturer: null, size: null, modelName: null }),
        }),
        {
            name: 'single-cart-storage', // localStorage key
        }
    )
); 