"use client";

import { CATEGORY_LIST } from "@/constants/category";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

// import CategorySection from "./_components/CategorySection";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

function DoorCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // 쿼리스트링에서 category 가져오기
  let header;
  const category = CATEGORY_LIST.find(item => item.slug === type);
  if (category) header = category.name;
  let categories = doorCategories;
  if (type === "cabinet") {
    categories = cabinetCategories;
  }
  if (type === "accessory") {
    categories = accessCategories;
  }
  if (type === "hardware") {
    categories = hardwareCategories;
  }
  return (
    <div className="flex flex-col">
      <TopNavigator />
      <Header size="Large" title={`${header} 종류를 선택해주세요`} />
      <div className="grid w-full grid-cols-3 gap-x-3 gap-y-[40px] px-5 pb-5 pt-10">
        {categories.map((category, idx) => (
          <div
            key={category.alt}
            className="flex flex-1 cursor-pointer flex-col items-center gap-2"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("category", category.category);
              router.push(`/order/color?${params.toString()}`);
            }}
          >
            <div className="relative aspect-square w-full">
              <Image
                src={category.src}
                alt={category.alt}
                fill
                style={{
                  objectFit: "contain",
                  verticalAlign: category.alt === "서랍" ? "top" : "middle",
                }}
              />
            </div>
            <div
              className={`text-center text-[16px] font-400 text-gray-600 ${category.heightClass}`}
            >
              {category.label}
            </div>
          </div>
        ))}
      </div>
      {/* 전임 개발자 분이 만든 컴포넌트입니다. <CategorySection /> */}
    </div>
  );
}

export default DoorCategoryPage;

const doorCategories = [
  {
    category: "normal",
    src: "/img/door-category/Door.png",
    alt: "일반문",
    label: (
      <>
        일반문
        <br />
        (여닫이)
      </>
    ),
    heightClass: "height-[44px]",
  },
  {
    category: "flap",
    src: "/img/door-category/FlapDoor.png",
    alt: "플랩문",
    label: (
      <>
        플랩문
        <br />
        (위로 열림)
      </>
    ),
    heightClass: "height-[44px]",
  },
  {
    category: "drawer",
    src: "/img/door-category/Drawer.png",
    alt: "서랍",
    label: "서랍 마에다",
    heightClass: "height-[22px]",
  },
];
const cabinetCategories = [
  {
    category: "upper",
    src: "/img/cabinet-category/Upper.png",
    alt: "상부장",
    label: "상부장",
    heightClass: "height-[22px]",
  },
  {
    category: "lower",
    src: "/img/cabinet-category/Lower.png",
    alt: "하부장",
    label: "하부장",
    heightClass: "height-[22px]",
  },
  {
    category: "flap",
    src: "/img/cabinet-category/Flap.png",
    alt: "플랩장",
    label: "플랩장",
    heightClass: "height-[22px]",
  },
  {
    category: "drawer",
    src: "/img/cabinet-category/Drawers.png",
    alt: "서랍장",
    label: "서랍장",
    heightClass: "height-[22px]",
  },
  {
    category: "open",
    src: "/img/cabinet-category/Open.png",
    alt: "오픈장",
    label: "오픈장",
    heightClass: "height-[22px]",
  },
];
const accessCategories = [
  {
    category: "sinkbowl",
    src: "/img/access-category/sinkbowl.png",
    alt: "싱크볼",
    label: "싱크볼",
    heightClass: "height-[22px]",
  },
  {
    category: "cooktop",
    src: "/img/access-category/cooktop.png",
    alt: "쿡탑",
    label: "쿡탑",
    heightClass: "height-[22px]",
  },
  {
    category: "hood",
    src: "/img/access-category/hood.png",
    alt: "후드",
    label: "후드",
    heightClass: "height-[22px]",
  },
];
const hardwareCategories = [
  {
    category: "hinge",
    src: "/img/hardware-category/hinge.png",
    alt: "경첩",
    label: "경첩",
    heightClass: "height-[22px]",
  },
  {
    category: "rail",
    src: "/img/hardware-category/rail.png",
    alt: "레일",
    label: "레일",
    heightClass: "height-[22px]",
  },
  {
    category: "bolt",
    src: "/img/hardware-category/bolt.png",
    alt: "피스",
    label: "피스",
    heightClass: "height-[22px]",
  },
];
