"use client";

import { useRouter } from "next/navigation";
import React from "react";

import HomeProductButton from "./HomeProductButton";
import AttachedIcon from "./Icons/Attached";
import CustomOrderIcon from "./Icons/CustomOrder";
import DoorIcon from "./Icons/Door";
import FinishingMaterialsIcon from "./Icons/FinishingMaterials";
import HardWareIcon from "./Icons/HardWare";
import SectionHeadIcon from "./Icons/SectionHead";

const productList = [
  { label: "문짝", icon: <DoorIcon />, slug: "door" },
  { label: "마감재", icon: <FinishingMaterialsIcon />, slug: "finish" },
  { label: "부분장", icon: <SectionHeadIcon />, slug: "cabinet" },
  { label: "부속", icon: <AttachedIcon />, slug: "accessory" },
  { label: "하드웨어", icon: <HardWareIcon />, slug: "hardware" },
  { label: "직접 주문", icon: <CustomOrderIcon />, slug: "custom" },
];

const HomeProductContainer: React.FC = () => {
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    if (slug === "custom") {
      router.push("/custom-order"); // 직접 주문일 경우 예외 처리
      return;
    }

    const addressStorage = localStorage.getItem("address-storage");
    if (!addressStorage) {
      router.push(`/address-check?category=${slug}`);
    } else if (slug === "finish") {
      // 마감재일 경우 바로 색상 선택 페이지로 이동
      router.push(`/order/color?type=${slug}`);
    } else {
      router.push(`/order?type=${slug}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 px-5">
      <div className="grid grid-cols-3 items-stretch justify-items-stretch gap-5">
        {productList.map((item, idx) => (
          <HomeProductButton
            key={item.label}
            label={item.label}
            icon={item.icon}
            onClick={() => handleCategoryClick(item.slug)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeProductContainer;
