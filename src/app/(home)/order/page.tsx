"use client";

import { CATEGORY_LIST, DOOR_CATEGORY_LIST, ACCESSORY_CATEGORY_LIST, HARDWARE_CATEGORY_LIST, CABINET_CATEGORY_LIST } from "@/constants/category";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

function DoorCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // 쿼리스트링에서 category 가져오기
  let header;
  const category = CATEGORY_LIST.find(item => item.slug === type);
  if (category) header = category.name;

  // 카테고리별 리스트 매핑
  const categoryLists = {
    door: DOOR_CATEGORY_LIST,
    accessory: ACCESSORY_CATEGORY_LIST,
    hardware: HARDWARE_CATEGORY_LIST,
    cabinet: CABINET_CATEGORY_LIST,
  };

  const categories = categoryLists[type as keyof typeof categoryLists] || [];

  return (
    <div className="flex flex-col">
      <TopNavigator />
      <Header size="Large" title={`${header} 종류를 선택해주세요`} />
      <div className="grid w-full grid-cols-3 gap-x-3 gap-y-[40px] px-5 pb-5 pt-10">
        {categories.map((category, idx) => (
          <div
            key={category.slug}
            className="flex flex-1 cursor-pointer flex-col items-center gap-2"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("category", category.slug);
              if (type === "accessory" || type === "hardware") {
                router.push(`/order/${type}?${params.toString()}`);
              } else {
                router.push(`/order/color?${params.toString()}`);
              }
            }}
          >
            <div className="relative aspect-square w-full">
              <Image
                src={category.image}
                alt={category.name}
                fill
                style={{
                  objectFit: "contain",
                  verticalAlign: category.slug === "drawer" ? "top" : "middle",
                }}
              />
            </div>
            <div className="text-center text-[16px]/[22px] font-400 text-gray-600">
              {category.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoorCategoryPage;
