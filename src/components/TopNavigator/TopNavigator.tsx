"use client";

import { CUSTOMER_SERVICE_PAGE, HOME_PAGE, MY_PAGE } from "@/constants/pageName";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeadphonesIcon from "public/icons/Headphones";
import ChevronLeft from "public/icons/chevron_left";
import React from "react";

interface TopNavigatorProps {
  title?: string;
  page?: string;
  isCartEmpty?: boolean;
}

const TopNavigator: React.FC<TopNavigatorProps> = ({ title, page, isCartEmpty }) => {
  const router = useRouter();
  return (
    <div className="flex h-[60px] w-full flex-shrink-0 items-center justify-between gap-[12px] px-[20px]">
      {page === HOME_PAGE ? (
        <h3 className="text-xl font-700">바로가구</h3>
      ) : (
        <button onClick={() => router.back()} className="flex items-center justify-center">
          {/* 뒤로가기 버튼 */}
          <ChevronLeft />
        </button>
      )}

      {/* Title */}
      <h1 className="text-[17px] font-[500] font-medium text-gray-600">{title}</h1>

      {/* Headphones Icon */}

      {page === CUSTOMER_SERVICE_PAGE || page === HOME_PAGE || page === MY_PAGE ? (
        <div></div>
      ) : (
        <Link href={"/customer-service"}>
          <button className="flex items-center justify-center">
            <HeadphonesIcon />
          </button>
        </Link>
      )}

      {page === HOME_PAGE ? (
        <div className="flex gap-6">
          <Link href={"/cart"} className="relative cursor-pointer">
            <img src={"/icons/shopping-cart.svg"} alt="장바구니 아이콘"></img>
            {isCartEmpty ? (
              ""
            ) : (
              <span className="absolute -right-2 -top-2 h-[18px] w-[18px] rounded-full bg-red-500 text-center text-[13px] font-500 text-white">
                1
              </span>
            )}
          </Link>
          <Link href="/mypage" className="cursor-pointer">
            <img src={"/icons/user-round.svg"} alt="유저 아이콘"></img>
          </Link>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default TopNavigator;
