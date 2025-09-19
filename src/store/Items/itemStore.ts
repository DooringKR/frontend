import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 기본 아이템 타입
export interface BaseItem {
    category: DetailProductType;
    type: any; //세부 타입 정의하는 곳, 예시: FinishType, AccessoryType, HardwareType, CabinetType, DoorType
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
        }
    )
);

export default useItemStore;
