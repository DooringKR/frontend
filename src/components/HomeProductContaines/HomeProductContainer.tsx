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
import { AccessoryCart, CabinetCart, FinishCart, HardwareCart, useSingleCartStore } from "@/store/singleCartStore";

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
  const setCart = useSingleCartStore(state => state.setCart);

  const handleCategoryClick = (slug: string) => {
    if (slug === "custom") {
      router.push("/custom-order");
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
      router.push(`/order/color?type=${slug}`);
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
    } else {
      router.push(`/order`);
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
