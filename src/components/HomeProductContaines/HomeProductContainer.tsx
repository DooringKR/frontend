import React from "react";

import HomeProductButton from "./HomeProductButton";
import DoorIcon from "./Icons/Door";
import FinishingMaterialsIcon from "./Icons/FinishingMaterials";
import SectionHeadIcon from "./Icons/SectionHead";
import AttachedIcon from "./Icons/Attached";
import HardWareIcon from "./Icons/HardWare";
import CustomOrderIcon from "./Icons/CustomOrder";

const productList = [
  { label: "문짝", icon: <DoorIcon /> },
  { label: "마감재", icon: <FinishingMaterialsIcon /> },
  { label: "부분장", icon: <SectionHeadIcon /> },
  { label: "부속", icon: <AttachedIcon /> },
  { label: "하드웨어", icon: <HardWareIcon /> },
  { label: "직접 주문", icon: <CustomOrderIcon /> },
];

const HomeProductContainer: React.FC = () => {

  return (
    <div className="flex flex-col items-center gap-6 px-5">
      <div className="grid grid-cols-3 gap-5 items-stretch justify-items-stretch">
        {productList.map((item, idx) => (
          <HomeProductButton key={item.label} label={item.label} icon={item.icon} />
        ))}
      </div>
    </div>
  );
};

export default HomeProductContainer;
