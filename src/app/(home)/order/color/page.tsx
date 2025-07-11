"use client";

import {
  ACCESSORY_CATEGORY_LIST,
  CABINET_CATEGORY_LIST,
  DOOR_CATEGORY_LIST,
  HARDWARE_CATEGORY_LIST,
} from "@/constants/category";
import { COLOR_LIST } from "@/constants/colorList";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import ColorManualInputGuide from "./_components/ColorManualInputGuide";
import ColorManualInputSheet from "./_components/ColorManualInputSheet";
import ColorSelectBottomButton from "./_components/ColorSelectBottomButton";
import ColorSelectList from "./_components/ColorSelectList";
import { navigateWithAllParams } from "./utils/navigateWithAllParams";
import { useSingleCartStore } from "@/store/singleCartStore";

const categoryMap: Record<string, any[]> = {
  door: DOOR_CATEGORY_LIST,
  cabinet: CABINET_CATEGORY_LIST,
  accessory: ACCESSORY_CATEGORY_LIST,
  hardware: HARDWARE_CATEGORY_LIST,
};

function getHeader(type: string | null, currentCategory: any) {
  if (type === "finish") return "마감재";
  return currentCategory?.header ?? "";
}

function ColorListPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const category = searchParams.get("category"); // 쿼리스트링에서 category 가져오기
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(searchParams.get("color"));
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // zustand store 사용
  const setCartColor = useSingleCartStore(state => state.setColor);

  const categoryList = categoryMap[type as keyof typeof categoryMap] || [];
  const currentCategory = categoryList.find(item => item.slug === category);
  const header = getHeader(type, currentCategory);

  const filteredColors = COLOR_LIST.filter(item =>
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
        setSelectedColor={(color) => {
          setSelectedColor(color);
          setCartColor(color); // zustand에 저장
          // URL 업데이트
          const params = new URLSearchParams(searchParams);
          if (color) {
            params.set("color", color);
          } else {
            params.delete("color");
          }
          router.replace(`?${params.toString()}`, { scroll: false });
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
        onChange={(color) => {
          setSelectedColor(color);
          setCartColor(color); // zustand에 저장
          // URL 업데이트
          const params = new URLSearchParams(searchParams);
          if (color) {
            params.set("color", color);
          } else {
            params.delete("color");
          }
          router.replace(`?${params.toString()}`, { scroll: false });
        }}
        searchParams={searchParams}
        type={type ?? ""}
      />
      {!isBottomSheetOpen && (
        <ColorSelectBottomButton
          selectedColor={selectedColor}
          searchParams={searchParams}
          onClick={() => {
            if (selectedColor) {
              navigateWithAllParams({
                router,
                searchParams,
                type: type ?? "",
                category,
                color: selectedColor,
              });
            }
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
