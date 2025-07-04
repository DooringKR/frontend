"use client";

import TopNavigator from "@/components/TopNavigator/TopNavigator";
// import CategorySection from "./_components/CategorySection";
import Header from "@/components/Header/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";

const doorCategories = [
  {
    src: "/img/door-category/Door.png",
    alt: "일반문",
    label: (
      <>
        일반문<br />(여닫이)
      </>
    ),
    heightClass: "height-[44px]",
    category: "normal",
  },
  {
    src: "/img/door-category/FlapDoor.png",
    alt: "플랩문",
    label: (
      <>
        플랩문<br />(위로 열림)
      </>
    ),
    heightClass: "height-[44px]",
    category: "flap",
  },
  {
    src: "/img/door-category/Drawer.png",
    alt: "서랍",
    label: "서랍 마에다",
    heightClass: "height-[22px]",
    category: "drawer",
  },
];

function DoorCategoryPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <TopNavigator title="문짝 종류" />
      <Header size="Large" title="문짝 종류를 선택해주세요" />
      <div className="flex flex-row pt-10 px-5 pb-5 gap-3 w-full">
        {doorCategories.map((category, idx) => (
          <div
            key={category.alt}
            className="flex flex-col gap-2 items-center flex-1 cursor-pointer"
            onClick={() => router.push(`/order/door/color?category=${category.category}`)}
          >
            <div className="w-full aspect-square relative">
              <Image
                src={category.src}
                alt={category.alt}
                fill
                style={{ objectFit: 'contain', verticalAlign: category.alt === '서랍' ? 'top' : 'middle' }}
              />
            </div>
            <div className={`text-center text-gray-600 font-400 text-[16px] ${category.heightClass}`}>{category.label}</div>
          </div>
        ))}
      </div>
      {/* 전임 개발자 분이 만든 컴포넌트입니다. <CategorySection /> */}
    </div>
  );
}

export default DoorCategoryPage;
