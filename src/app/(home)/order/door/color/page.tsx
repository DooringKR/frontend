"use client";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import { COLOR_LIST } from "@/constants/colorList";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import FileIcon from "public/icons/file";
import { useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

function ColorList() {
  if (typeof window === "undefined") return null;
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug"); // 쿼리스트링에서 slug 가져오기
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const currentCategory = DOOR_CATEGORY_LIST.find(item => item.slug === slug);
  const header = currentCategory?.header || "문짝";

  const filteredColors = COLOR_LIST.filter(item =>
    item.name.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const handleGoToManualInput = () => {
    const query = searchParams.toString();
    router.push(`/order/door/color/custom-color?${query}`);
  };

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
      <div className="flex flex-col gap-2 px-1 pb-5 pt-3">
        {filteredColors.length === 0 ? (
          <div className="flex items-center justify-center px-4 py-3 text-center text-[17px]/[24px] font-400 text-gray-400">
            검색 결과가 없어요
          </div>
        ) : (
          // <div className="flex flex-col items-center justify-center gap-3 bg-white text-center">
          //   <p>검색 결과 0개</p>
          //   <button
          //     onClick={handleGoToManualInput}
          //     className="rounded-lg border-[2px] border-[#767676] bg-[#d9d9d9] p-2"
          //   >
          //     찾는 색상이 없어요
          //   </button>
          // </div>
          filteredColors.map((item, idx) => {
            const nameParts = item.name.split(",").map(s => s.trim());
            const label = [nameParts[1], nameParts[3]].filter(Boolean).join(" ");
            const description = [nameParts[0], nameParts[2]].filter(Boolean).join(" ∙ ");
            return (
              <div key={idx}>
                <SelectToggleButton
                  label={label}
                  description={description}
                  showInfoIcon={nameParts[3] == "헤링본 - 미백색" ? true : false}
                  checked={selectedColor === item.name ? true : undefined}
                  imageSrc={item.image}
                  onClick={() => {
                    setSelectedColor(item.name);
                  }}
                />
              </div>
            );
          })
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-3 bg-gray-50 px-5 py-10">
        <FileIcon />
        <p className="text-center text-[16px]/[22px] font-400 text-gray-500">
          찾는 색상이 없다면
          <br />
          색상을 직접 입력해주세요
        </p>
        <Button
          type={"OutlinedMedium"}
          // type={filteredColors.length === 0 ? "Brand" : "OutlinedMedium"}
          text={"색상 직접 입력"}
          className="w-fit"
          onClick={() => setIsBottomSheetOpen(true)}
        />
      </div>
      <BottomSheet
        isOpen={isBottomSheetOpen}
        title="색상을 직접 입력해주세요"
        description="브랜드명, 색상명 등 색상 정보를 꼼꼼히 입력해주세요."
        children={
          <BoxedInput type="text" placeholder="색상 정보를 입력해주세요" className="pt-5" />
        }
        buttonArea={
          <BottomButton
            type={"1button"}
            button1Text={"다음"}
            className="px-5 pb-5"
            onButton1Click={() => {}}
          />
        }
        onClose={() => setIsBottomSheetOpen(false)}
      />
      <BottomButton
        children={
          selectedColor && (
            <div className="flex items-center justify-center gap-2 px-5 pb-4 pt-2">
              <Image
                src={COLOR_LIST.find(item => item.name === selectedColor)?.image || ""}
                alt={selectedColor}
                width={20}
                height={20}
                className="border-1 h-5 w-5 rounded-[4px] border-[#030712]/5 object-cover"
              />
              <div className="text-[16px]/[22px] font-500 text-[#3B82F6]">
                {(() => {
                  const nameParts = selectedColor.split(",").map(s => s.trim());
                  const label = [nameParts[1], nameParts[3]].filter(Boolean).join(" ");
                  const description = [nameParts[0], nameParts[2]].filter(Boolean).join(" ∙ ");
                  return `${label} (${description}) 선택됨`;
                })()}
              </div>
            </div>
          )
        }
        type={"1button"}
        button1Text={"다음"}
        className="fixed bottom-0 w-full max-w-[500px] px-5 pb-5"
        onButton1Click={() => {
          if (selectedColor) {
            const params = new URLSearchParams(searchParams);
            params.set("color", selectedColor);
            // router.push(`/order/door/select?${params.toString()}`);
            router.push(`/order/door/input?${params.toString()}`);
          }
        }}
      />
    </div>
  );
}

export default ColorList;
