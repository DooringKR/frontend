"use client";

import {
  CART_PAGE,
  CUSTOMER_SERVICE_PAGE,
  HOME_PAGE,
  LICENSE_PAGE,
  MY_PAGE,
} from "@/constants/pageName";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeadphonesIcon from "public/icons/Headphones";
import ChevronLeft from "public/icons/chevron_left";
import React from "react";

interface TopNavigatorProps {
  title?: string;
  page?: string;
  cartItemCount?: number;
}

const TopNavigator: React.FC<TopNavigatorProps> = ({ title, page, cartItemCount = 0 }) => {
  const router = useRouter();
  return (
    <div
      className={`flex h-[60px] w-full flex-shrink-0 items-center justify-between gap-[12px] ${page === HOME_PAGE ? "pl-5 pr-2" : "px-5"
        }`}
    >
      {page === HOME_PAGE ? (
        <h3 className="text-xl font-700">바로가구</h3>
      ) : page === MY_PAGE || page === CART_PAGE ? (
        <button onClick={() => router.replace("/")} className="flex items-center justify-center">
          <img src={"/icons/close.svg"} alt="엑스 아이콘" />
        </button>
      ) : (
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center rounded-2xl p-3 transition hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>
      )}

      {/* Title */}
      <h1 className="text-[17px] font-[500] text-gray-600">{title}</h1>

      {/* Headphones Icon */}

      {page === CUSTOMER_SERVICE_PAGE ||
        page === HOME_PAGE ||
        page === MY_PAGE ||
        page === LICENSE_PAGE ? (
        <div className="h-6 w-6"></div>
      ) : (
        <Link href={"/customer-service"}>
          <button
            className="flex items-center justify-center rounded-2xl p-3 transition hover:bg-gray-100"
            onMouseEnter={() => console.log("🎧 Headphones hovered!")}
          >
            <HeadphonesIcon />
          </button>
        </Link>
      )}

      {page === HOME_PAGE ? (
        <div className="flex">
          <div className="rounded-2xl p-3 transition hover:bg-gray-100">
            <div className="relative">
              <Link href={"/cart"} className="cursor-pointer">
                <img src={"/icons/shopping-cart.svg"} alt="장바구니 아이콘" />
              </Link>

              {cartItemCount > 0 && (
                <span className="absolute -right-2 -top-2 h-[18px] w-[18px] rounded-full bg-red-500 text-center text-[13px] font-500 text-white">
                  {cartItemCount}
                </span>
              )}
            </div>
          </div>
          <div className="rounded-2xl p-3 transition hover:bg-gray-100">
            <Link href="/mypage" className="cursor-pointer">
              <img src={"/icons/user-round.svg"} alt="유저 아이콘"></img>
            </Link>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default TopNavigator;
