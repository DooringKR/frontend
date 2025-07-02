"use client";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import { COLOR_LIST } from "@/constants/colorList";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import TopNavigator from "@/components/TopNavigator/TopNavigator";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import SelectToggleButton from "@/components/Button/SelectToggleButton";

function ColorList() {
  if (typeof window === "undefined") return null;
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug"); // 쿼리스트링에서 slug 가져오기
  const [searchKeyword, setSearchKeyword] = useState("");

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
      <div className="flex flex-col px-1 pt-3 pb-5 gap-3">
        {filteredColors.length === 0 ? (
          <div className="py-3 px-4 text-center text-gray-400 font-400 text-[17px]/[24px] flex items-center justify-center">검색 결과가 없어요</div>
          // <div className="flex flex-col items-center justify-center gap-3 bg-white text-center">
          //   <p>검색 결과 0개</p>
          //   <button
          //     onClick={handleGoToManualInput}
          //     className="rounded-lg border-[2px] border-[#767676] bg-[#d9d9d9] p-2"
          //   >
          //     찾는 색상이 없어요
          //   </button>
          // </div>
        ) : (
          filteredColors.map((item, idx) => {
            const nameParts = item.name.split(',').map(s => s.trim());
            const label = [nameParts[1], nameParts[3]].filter(Boolean).join(' ');
            const description = [nameParts[0], nameParts[2]].filter(Boolean).join(' ');
            return (
              <div key={idx}>
                <SelectToggleButton
                  label={label}
                  description={description}
                  imageSrc={item.image}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("color", item.name);
                    router.push(`/order/door/select?${params.toString()}`);
                  }} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ColorList;
