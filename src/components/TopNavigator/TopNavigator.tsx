import { CUSTOMER_SERVICE_PAGE } from "@/constants/pageName";
import HeadphonesIcon from "public/icons/Headphones";
import ChevronLeft from "public/icons/chevron_left";
import React from "react";

interface TopNavigatorProps {
  title?: string;
  page?: string;
}

const TopNavigator: React.FC<TopNavigatorProps> = ({ title, page }) => {
  return (
    <div className="flex h-[60px] w-full flex-shrink-0 items-center justify-between gap-[12px] px-[20px]">
      {/* Back Button */}
      <button className="flex items-center justify-center">
        <ChevronLeft />
      </button>

      {/* Title */}
      <h1 className="text-[17px] font-[500] font-medium text-gray-600">{title}</h1>

      {/* Headphones Icon */}

      {page === CUSTOMER_SERVICE_PAGE ? (
        ""
      ) : (
        <button className="flex items-center justify-center">
          <HeadphonesIcon />
        </button>
      )}
    </div>
  );
};

export default TopNavigator;
