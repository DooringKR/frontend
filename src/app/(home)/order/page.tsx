"use client";

import {
  ACCESSORY_CATEGORY_LIST,
  CABINET_CATEGORY_LIST,
  CATEGORY_LIST,
  DOOR_CATEGORY_LIST,
  HARDWARE_CATEGORY_LIST,
  FINISH_CATEGORY_LIST,
} from "@/constants/category";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { useSingleCartStore } from "@/store/singleCartStore";

function DoorCategoryPage() {
  const router = useRouter();
  const type = useSingleCartStore(state => state.cart.type);
  const setCart = useSingleCartStore(state => state.setCart);

  const category = CATEGORY_LIST.find(item => item.slug === type);
  let header;
  if (category) header = category.name;

  // 카테고리별 리스트 매핑
  const categoryLists = {
    door: DOOR_CATEGORY_LIST,
    accessory: ACCESSORY_CATEGORY_LIST,
    finish: FINISH_CATEGORY_LIST,
    hardware: HARDWARE_CATEGORY_LIST,
    cabinet: CABINET_CATEGORY_LIST,
  };

  const categories = categoryLists[type as keyof typeof categoryLists] || [];

  return (
    <div className="flex flex-col">
      <TopNavigator />
      <Header size="Large" title={`${header} 종류를 선택해주세요`} />
      <div className="grid w-full grid-cols-2 gap-x-3 gap-y-[40px] px-5 pb-5 pt-10">
        {categories.map((category, idx) => (
          <div
            key={category.slug}
            className="flex flex-1 cursor-pointer flex-col items-center gap-2"
            onClick={() => {
              //type, catergory 추가 후 다음 페이지로 이동
              setCart({
                type: type,
                category: category.slug,
              });
              if (type === "accessory" || type === "hardware") {
                router.push(`/order/${type}`);
              } else {
                router.push(`/order/color`);
              }
            }}
          >
            <div className="relative aspect-square w-full">
              <Image
                src={category.image}
                alt={category.type || ''}
                fill
                style={{
                  objectFit: "contain",
                  verticalAlign: category.slug === "drawer" ? "top" : "middle",
                }}
                className="w-full h-full object-cover rounded-[28px] border-[2px] border-[rgba(3,7,18,0.05)]"
              />
            </div>
            <div className="text-center text-[17px]/[24px] font-500 text-gray-500">
              {category.type || ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <DoorCategoryPage />
    </Suspense>
  );
}

export default OrderPage;
