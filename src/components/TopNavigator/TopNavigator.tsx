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
      {/* 좌측 버튼 */}
      {page === HOME_PAGE ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="74" height="20" viewBox="0 0 74 20" fill="none">
          <path d="M69.4769 1.49744V1.18974H57.8462V3.73333H66.5322C66.508 4.13102 66.445 4.75854 66.3407 5.62474L66.3404 5.62654L66.3403 5.62837C66.2185 6.75163 66.022 7.95151 65.7503 9.22827L65.6712 9.6H68.601L68.6504 9.35264C68.871 8.24987 69.0636 7.03195 69.2284 5.69932C69.3942 4.35929 69.4769 2.95859 69.4769 1.49744Z" fill="black" />
          <path d="M65.2103 12.4103H73.3333V9.84615H54.7077V12.4103H62.318V20H65.2103V12.4103Z" fill="black" />
          <path d="M46.3652 2.89467L46.4152 2.54359H37.1375V5.08718H43.0905C42.2698 7.81092 40.2762 10.5029 37.0645 13.1577L36.7795 13.3933L38.8984 15.1679L39.0953 15.0083C43.2629 11.6299 45.6963 7.5908 46.3652 2.89467Z" fill="black" />
          <path d="M54.7077 6.68718H51.4667V0H48.6154V19.6308H51.4667V9.33333H54.7077V6.68718Z" fill="black" />
          <path d="M24.2462 8.55385H32.1846V1.7641H21.2718V4.26667H29.2923V6.05128H21.3538V12.9641H25.4974V14.7897H17.6V17.3538H36.2256V14.7897H28.4103V12.9641H32.5744V10.4615H24.2462V8.55385Z" fill="black" />
          <path d="M14.5436 6.62564H17.7846V9.2718H14.5436V19.6308H11.6923V0H14.5436V6.62564ZM2.81026 6.19487H6.74872V2.4H9.55897V13.9897H0V2.4H2.81026V6.19487ZM2.81026 8.71795V11.4462H6.74872V8.71795H2.81026Z" fill="black" />
        </svg>
        // <h3 className="text-xl font-700">바로가구</h3>
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
          {/* 장바구니 아이콘 */}
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
          {/* 마이페이지 아이콘 */}
          {/* <div className="rounded-2xl p-3 transition hover:bg-gray-100">
            <Link href="/mypage" className="cursor-pointer">
              <img src={"/icons/user-round.svg"} alt="유저 아이콘"></img>
            </Link>
          </div> */}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default TopNavigator;
