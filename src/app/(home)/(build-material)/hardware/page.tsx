// 홈에서 하드웨어 선택 시 오는 페이지
// '하드웨어 종류를 선택해주세요'

"use client";

import { HARDWARE_CATEGORY_LIST } from "@/constants/category";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { HardwareType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import useItemStore from "@/store/itemStore";
import { DetailProductType, ProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function HardwareCategoryPage() {
  const router = useRouter();
  const hardwarecategory = HARDWARE_CATEGORY_LIST;
  const setItem = useItemStore(state => state.setItem);

  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
      // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
      setScreenName('hardware');
      const prev = getPreviousScreenName();
      trackView({
          object_type: "screen",
          object_name: null,
          current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
          previous_screen: prev,
      });
  }, []);

  // const category = CATEGORY_LIST.find(item => item.slug === type);
  // let header;
  // if (category) header = category.name;

  // // 카테고리별 리스트 매핑
  // const categoryLists = { hardware: HARDWARE_CATEGORY_LIST};

  // const categories = categoryLists[type as keyof typeof categoryLists] || [];

  return (
    <div className="flex flex-col pt-[90px]">
      <InitAmplitude />
      <TopNavigator />
      <ProgressBar progress={20} />
      <Header size="Large" title={`하드웨어 종류를 선택해주세요`} />
      <div className="grid w-full grid-cols-2 gap-x-3 gap-y-[40px] px-5 pb-5 pt-10">
        {hardwarecategory.map((category, idx) => (
          <div
            key={category.slug}
            className="flex flex-1 cursor-pointer flex-col items-center gap-2"
            onClick={() => {

              trackClick({
                  object_type: "button",
                  object_name: category.slug,
                  current_page: getScreenName(),
                  modal_name: null,
              });
              setItem({
                category: ProductType.HARDWARE,
                type: category.type as HardwareType,
              })
              router.push(`/hardware/${category.slug}`);
            }}
          >
            <div className="relative aspect-square w-full">
              <Image
                src={category.image}
                alt={category.type || ''}
                fill
                style={{
                  objectFit: "contain",
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
      <HardwareCategoryPage />
    </Suspense>
  );
}

export default OrderPage;
