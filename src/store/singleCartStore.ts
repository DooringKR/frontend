import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SingleCartState {
    materialId: string | null;
    quantity: number;
    color: string | null;
    request: string;
    // 필요에 따라 추가 필드
    setMaterialId: (id: string | null) => void;
    setQuantity: (qty: number) => void;
    setColor: (color: string | null) => void;
    setRequest: (req: string) => void;
    reset: () => void;
}

export const useSingleCartStore = create<SingleCartState>()(
    persist(
        (set) => ({
            materialId: null,
            quantity: 1,
            color: null,
            request: '',
            setMaterialId: (id) => set({ materialId: id }),
            setQuantity: (qty) => set({ quantity: qty }),
            setColor: (color) => set({ color }),
            setRequest: (req) => set({ request: req }),
            reset: () => set({ materialId: null, quantity: 1, color: null, request: '' }),
        }),
        {
            name: 'single-cart-storage', // localStorage key
        }
    )
); 