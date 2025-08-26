import Link from "next/link";
import React from "react";

interface BottomNavigationItemProps {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  isActive: boolean;
}

const BottomNavigationItem: React.FC<BottomNavigationItemProps> = ({
  label,
  href,
  icon,
  activeIcon,
  isActive,
}) => {
  return (
    <Link
      href={href}
      className={`flex min-w-[80px] flex-col items-center justify-center gap-[2px] px-4 pb-3 pt-2 transition-colors duration-200`}
    >
      <div className="flex h-[24px] w-[24px] items-center justify-center">
        {isActive ? activeIcon : icon}
      </div>
      <span
        className={`text-[11px]/[16px] font-500 ${isActive ? "text-gray-800" : "text-gray-400"}`}
      >
        {label}
      </span>
    </Link>
  );
};

export default BottomNavigationItem;
