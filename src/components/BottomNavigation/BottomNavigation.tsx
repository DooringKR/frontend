"use client";

import { usePathname } from "next/navigation";
import React from "react";

import BottomNavigationItem from "./BottomNavigationItem";

interface BottomNavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

const BottomNavigation: React.FC = () => {
  const pathname = usePathname();

  const navigationItems: BottomNavigationItem[] = [
    {
      label: "홈",
      href: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M15 21V13C15 12.7348 14.8946 12.4805 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12H10C9.73478 12 9.48043 12.1054 9.29289 12.2929C9.10536 12.4805 9 12.7348 9 13V21M3 10C2.99993 9.7091 3.06333 9.42165 3.18579 9.15775C3.30824 8.89384 3.4868 8.65983 3.709 8.47203L10.709 2.47303C11.07 2.16794 11.5274 2.00055 12 2.00055C12.4726 2.00055 12.93 2.16794 13.291 2.47303L20.291 8.47203C20.5132 8.65983 20.6918 8.89384 20.8142 9.15775C20.9367 9.42165 21.0001 9.7091 21 10V19C21 19.5305 20.7893 20.0392 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0392 3 19.5305 3 19V10Z"
            stroke="#D1D5DC"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      activeIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M15 21V13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12H10C9.73478 12 9.48043 12.1054 9.29289 12.2929C9.10536 12.4804 9 12.7348 9 13V21M3 10C2.99993 9.70907 3.06333 9.42162 3.18579 9.15771C3.30824 8.89381 3.4868 8.65979 3.709 8.472L10.709 2.473C11.07 2.16791 11.5274 2.00052 12 2.00052C12.4726 2.00052 12.93 2.16791 13.291 2.473L20.291 8.472C20.5132 8.65979 20.6918 8.89381 20.8142 9.15771C20.9367 9.42162 21.0001 9.70907 21 10V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V10Z"
            stroke="#1E2939"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "주문목록",
      href: "/order-history",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8M9 14L11 16L15 12M9 2H15C15.5523 2 16 2.44772 16 3V5C16 5.55228 15.5523 6 15 6H9C8.44772 6 8 5.55228 8 5V3C8 2.44772 8.44772 2 9 2Z"
            stroke="#D1D5DC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      activeIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8M9 14L11 16L15 12M9 2H15C15.5523 2 16 2.44772 16 3V5C16 5.55228 15.5523 6 15 6H9C8.44772 6 8 5.55228 8 5V3C8 2.44772 8.44772 2 9 2Z"
            stroke="#1E2939"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "전체",
      href: "/mypage",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
        >
          <path
            d="M2 2H18M2 9H18M2 16H18"
            stroke="#D1D5DC"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      activeIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
        >
          <path
            d="M2 2H18M2 9H18M2 16H18"
            stroke="#1E2939"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white max-w-[460px] mx-auto">
      <div className="flex max-w-[460px] items-center justify-around">
        {navigationItems.map(item => {
          const active = isActive(item.href);
          return (
            <BottomNavigationItem
              key={item.href}
              label={item.label}
              href={item.href}
              icon={item.icon}
              activeIcon={item.activeIcon}
              isActive={active}
            />
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
