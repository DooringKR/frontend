"use client";

import {
  CABINET_CATEGORY_LIST,
  DOOR_CATEGORY_LIST,
  ACCESSORY_CATEGORY_LIST,
} from "@/constants/category";
import { COLOR_LIST_BY_TYPE } from "@/constants/colorList";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { CabinetCart, DoorCart, FinishCart, useSingleCartStore } from "@/store/singleCartStore";

import ColorManualInputGuide from "./_components/ColorManualInputGuide";
import ColorManualInputSheet from "./_components/ColorManualInputSheet";
import ColorSelectBottomButton from "./_components/ColorSelectBottomButton";
import ColorSelectList from "./_components/ColorSelectList";

const categoryMap: Record<string, any[]> = {
  door: DOOR_CATEGORY_LIST,
  cabinet: CABINET_CATEGORY_LIST,
  accessory: ACCESSORY_CATEGORY_LIST,
};

// 마감재의 경우, 카테고리 선택 없이 바로 색상 선택 페이지로 이동하기 때문에 따로 설정합니다.
function getHeader(type: string | null, currentCategory: any) {
  if (type === "finish") return "마감재";
  return currentCategory?.header ?? "";
}

function ColorListPageContent() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const type = useSingleCartStore(state => state.cart.type);
  const category = useSingleCartStore(state => (state.cart as CabinetCart | DoorCart).category);
  const setCartColor = useSingleCartStore(state => state.setCart);

  const [searchKeyword, setSearchKeyword] = useState("");
  const initialColor = useSingleCartStore(
    state => (state.cart as FinishCart | CabinetCart | DoorCart).color ?? null,
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(initialColor);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const categoryList = categoryMap[type as keyof typeof categoryMap] || [];
  const currentCategory = categoryList.find(item => item.slug === category);
  const header = getHeader(type, currentCategory);

  const colorList = COLOR_LIST_BY_TYPE[type as keyof typeof COLOR_LIST_BY_TYPE] || [];
  const filteredColors = colorList.filter(item =>
    item.name.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  return (
    <div className="flex flex-col">
      <TopNavigator />
      <Header size="Large" title={`${header} 색상을 선택해주세요`} />
      <BoxedInput
        type="text"
        className={"px-5 py-3"}
        placeholder="색상 이름으로 검색"
        value={searchKeyword}
        onChange={e => setSearchKeyword(e.target.value)}
      />
      <ColorSelectList
        filteredColors={filteredColors}
        selectedColor={selectedColor}
        setSelectedColor={color => {
          setSelectedColor(color);
          setCartColor({
            type: type,
            category: category,
            color: color,
          });
        }}
      />
      {!isBottomSheetOpen && (
        <ColorManualInputGuide
          selectedColor={selectedColor}
          onClick={() => setIsBottomSheetOpen(true)}
        />
      )}
      <ColorManualInputSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        value={selectedColor ?? ""}
        onChange={color => {
          setSelectedColor(color);
          setCartColor({
            type: type,
            category: category,
            color: color,
          });
        }}
        type={type ?? ""}
        onNext={() => {
          if (selectedColor) {
            setCartColor({
              type: type,
              category: category,
              color: selectedColor,
            });
            router.push(`/order/${type}`);
          }
        }}
      />
      {!isBottomSheetOpen && (
        <ColorSelectBottomButton
          selectedColor={selectedColor}
          type={type ?? ""}
          onClick={() => {
            setCartColor({
              type: type,
              category: category,
              color: selectedColor,
            });
            router.push(`/order/${type}`);
          }}
        />
      )}
    </div>
  );
}

function ColorListPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ColorListPageContent />
    </Suspense>
  );
}

export default ColorListPage;
