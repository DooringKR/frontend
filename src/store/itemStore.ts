import { ProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

// 기본 아이템 타입
export interface BaseItem {
    category?: ProductType;
    type: any;
    //세부 타입 정의하는 곳,
    // 예시: DoorType의 일반문, 플랩문 등 세부 타입 정의
    // 여기서 롱문도 다룸
    color?: string | null;
    [key: string]: any; // 추가 속성들을 위한 인덱스 시그니처
}

// 아이템 스토어 인터페이스
interface ItemStore {
    item: BaseItem | null;

    setItem: (item: BaseItem) => void;
    updateItem: (updates: Partial<BaseItem>) => void;
    resetItem: () => void;
}

// 아이템 스토어 생성
const useItemStore = create<ItemStore>()(
    devtools(
        persist(
            (set) => ({
                item: null,

                setItem: (item: BaseItem) => set({ item }),

                updateItem: (updates: Partial<BaseItem>) =>
                    set(state => ({
                        item: state.item ? { ...state.item, ...updates } : null,
                    })),

                resetItem: () => set({ item: null }),
            }),
            {
                name: "item-storage",
                // File 객체는 직렬화할 수 없으므로 제외
                partialize: (state) => ({
                    item: state.item ? {
                        ...state.item,
                        raw_images: undefined // File 객체 제외
                    } : null
                })
            }
        ),
        {
            name: "item-store",
            enabled: process.env.NODE_ENV === 'development',
        }
    )
);

export default useItemStore;
