"use client";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import { COLOR_LIST } from "@/constants/colorList";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Input from "@/components/Input/Input";

export default function ColorList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug"); // 쿼리스트링에서 slug 가져오기
  const [searchKeyword, setSearchKeyword] = useState("");

  // 현재 slug에 맞는 header 찾기
  const currentCategory = DOOR_CATEGORY_LIST.find(item => item.slug === slug);
  const header = currentCategory?.header || "문짝";

  // 검색 필터링
  const filteredColors = COLOR_LIST.filter(item =>
    item.name.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const handleGoToManualInput = () => {
    const query = searchParams.toString();
    router.push(`/order/door/color/custom-color?${query}`);
  };

  return (
    <div className="flex flex-col gap-4 p-5">
      <h1 className="text-2xl font-bold">
        <span className="text-[#AD46FF]">{header}</span> 색상을 선택해주세요
      </h1>

      <Input
        type="text"
        name="search"
        placeholder="색상 이름으로 검색"
        value={searchKeyword}
        onChange={e => setSearchKeyword(e.target.value)}
      />

      <div className="flex flex-col gap-3">
        {filteredColors.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 bg-white text-center">
            <p>검색 결과 0개</p>
            <button
              onClick={handleGoToManualInput}
              className="rounded-lg border-[2px] border-[#767676] bg-[#d9d9d9] p-2"
            >
              찾는 색상이 없어요
            </button>
          </div>
        ) : (
          filteredColors.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="flex w-full items-center gap-3"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("color", item.name);
                router.push(`/order/door/select?${params.toString()}`);
              }}
            >
              <Image src={item.image} width={35} height={35} alt={item.name} />
              <p className="text-base font-semibold">{item.name}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
