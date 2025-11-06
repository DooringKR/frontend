"use client";

import { useRouter } from "next/navigation";
import React from "react";

import {
  AccessoryCart,
  CabinetCart,
  DoorCart,
  FinishCart,
  HardwareCart,
  useSingleCartStore,
} from "@/store/singleCartStore";

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

const HomeProductContainer: React.FC = () => {
  const router = useRouter();
  const setCart = useSingleCartStore(state => state.setCart);

  const handleCategoryClick = (slug: string) => {
    if (slug === "custom") {
      trackClick({
        object_type: "button",
        object_name: "custom",
        current_page: getScreenName(),
        modal_name: null,
      });
      router.push("/customer-service");
      return;
    }

    if (slug === "finish") {
      trackClick({
        object_type: "button",
        object_name: "finish",
        current_page: getScreenName(),
        modal_name: null,
      });
      router.push(`/finish`);
    } else if (slug === "hardware") {
      trackClick({
        object_type: "button",
        object_name: "hardware",
        current_page: getScreenName(),
        modal_name: null,
      });
      router.push(`/hardware`);
    } else if (slug === "accessory") {
      trackClick({
        object_type: "button",
        object_name: "accessory",
        current_page: getScreenName(),
        modal_name: null,
      });
      router.push(`/accessory`);
    } else if (slug === "cabinet") {
      trackClick({
        object_type: "button",
        object_name: "cabinet",
        current_page: getScreenName(),
        modal_name: null,
      });
      router.push(`/cabinet`);
    } else if (slug === "door") {
      trackClick({
        object_type: "button",
        object_name: "door",
        current_page: getScreenName(),
        modal_name: null,
      });
      router.push(`/door`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 px-5">
      <InitAmplitude />
      <OrderGuideCard onClick={() => window.open("https://dooring.notion.site/2a3b6a70ff3980cbb38dddab4b4f1a1c?pvs=74", "_blank")} />
      <div className="grid grid-cols-3 items-stretch justify-items-stretch gap-5 w-full h-full">
        {productList.map((item, idx) => (
          <HomeProductButton
            key={item.label}
            amplitudeEventName={`home-product-button-${item.slug}`}
            label={item.label}
            icon={item.icon}
            image={item.image}
            onClick={() => handleCategoryClick(item.slug)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeProductContainer;
