"use client";

import React from "react";

import HomeProductButton from "./HomeProductButton";
import OrderGuideCard from "./OrderGuideCard";
import AttachedIcon from "./Icons/Attached";
import CustomOrderIcon from "./Icons/CustomOrder";
import DoorIcon from "./Icons/Door";
import FinishingMaterialsIcon from "./Icons/FinishingMaterials";
import HardWareIcon from "./Icons/HardWare";
import SectionHeadIcon from "./Icons/SectionHead";
import { trackClick } from "@/services/analytics/amplitude";
import { getScreenName } from "@/utils/screenName";
import InitAmplitude from "@/app/(client-helpers)/init-amplitude";

const productList = [
  { label: "가구 문짝", icon: <DoorIcon />, slug: "door", image: "/img/type/door.png" },
  { label: "가구 마감재", icon: <FinishingMaterialsIcon />, slug: "finish", image: "/img/type/finish.png" },
  { label: "부분장", icon: <SectionHeadIcon />, slug: "cabinet", image: "/img/type/cabinet.png" },
  { label: "가구 부속", icon: <AttachedIcon />, slug: "accessory", image: "/img/type/accessory.png" },
  { label: "가구 하드웨어", icon: <HardWareIcon />, slug: "hardware", image: "/img/type/hardware.png" },
  { label: "직접 주문", icon: <CustomOrderIcon />, slug: "custom", image: "/img/type/custom.png" },
];

// 「직접 주문」은 고객센터로, 나머지는 품목 입력 화면으로
const hrefOf = (slug: string) => (slug === "custom" ? "/customer-service" : `/${slug}`);

const HomeProductContainer: React.FC = () => {
  return (
    <div className="flex flex-col items-start gap-8 px-5">
      <InitAmplitude />
      <div className="text-[20px]/[28px] font-700 text-gray-800">직접 주문</div>
      <div className="grid grid-cols-3 items-stretch justify-items-stretch gap-5 w-full h-full">
        {productList.map((item) => (
          <HomeProductButton
            key={item.label}
            amplitudeEventName={`home-product-button-${item.slug}`}
            label={item.label}
            icon={item.icon}
            image={item.image}
            href={hrefOf(item.slug)}
            onClick={() =>
              trackClick({
                object_type: "button",
                object_name: item.slug,
                current_page: getScreenName(),
                modal_name: null,
              })
            }
          />
        ))}
      </div>
      <OrderGuideCard href="https://dooring.notion.site/2a3b6a70ff3980cbb38dddab4b4f1a1c?pvs=74" />
    </div>
  );
};

export default HomeProductContainer;
