import React from "react";
import Image from "next/image";
import HeadphonesIcon from "public/icons/Headphones";
import ChevronLeft from "public/icons/chevron_left";

interface TopNavigatorProps {
  title?: string;
}

const TopNavigator: React.FC<TopNavigatorProps> = ({ title }) => {
  return (
    <div className="flex w-full h-[60px] px-[20px] justify-between items-center gap-[12px] flex-shrink-0">
      {/* Back Button */}
      <button className="flex items-center justify-center">
        <ChevronLeft />
      </button>

      {/* Title */}
      <h1 className="text-[17px] font-medium text-gray-600 font-[500]">{title}</h1>

      {/* Headphones Icon */}
      <button className="flex items-center justify-center">
        <HeadphonesIcon/>
      </button>
    </div>
  );
};

export default TopNavigator;