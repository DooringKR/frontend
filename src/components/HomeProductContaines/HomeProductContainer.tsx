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
import AttachedIcon from "./Icons/Attached";
import CustomOrderIcon from "./Icons/CustomOrder";
import DoorIcon from "./Icons/Door";
import FinishingMaterialsIcon from "./Icons/FinishingMaterials";
import HardWareIcon from "./Icons/HardWare";
import SectionHeadIcon from "./Icons/SectionHead";

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
      router.push("/customer-service");
      return;
    }

    const addressStorage = localStorage.getItem("address-storage");
    if (!addressStorage) {
      router.push(`/address-check?category=${slug}`);
    } else if (slug === "finish") {
      const initialFinishCart: FinishCart = {
        type: "finish",
      };
      setCart(initialFinishCart);
      router.push(`/order`);
      // router.push(`/order/color?type=${slug}`);
    } else if (slug === "hardware") {
      const initialHardwareCart: HardwareCart = {
        type: "hardware",
      };
      setCart(initialHardwareCart);
      router.push(`/order`);
    } else if (slug === "accessory") {
      const initialAccessoryCart: AccessoryCart = {
        type: "accessory",
      };
      setCart(initialAccessoryCart);
      router.push(`/order`);
    } else if (slug === "cabinet") {
      const initialAccessoryCart: CabinetCart = {
        type: "cabinet",
      };
      setCart(initialAccessoryCart);
      router.push(`/order`);
    } else if (slug === "door") {
      const initialDoorCart: DoorCart = {
        type: "door",
      };
      setCart(initialDoorCart);
      router.push(`/order`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 px-5">
      <div className="grid grid-cols-2 items-stretch justify-items-stretch gap-5 w-full h-full">
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
