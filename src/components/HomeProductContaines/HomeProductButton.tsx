"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface HomeProductButtonProps {
  amplitudeEventName: string;
  label: string;
  icon: React.ReactNode;
  image: string;
  href: string;
  onClick?: () => void;
}

const HomeProductButton: React.FC<HomeProductButtonProps> = ({ amplitudeEventName, label, image, href, onClick }) => {
  return (
    <Link
      id={amplitudeEventName}
      href={href}
      className={`flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-2 w-full h-full`}
      onClick={onClick}
    >
      <Image src={image} alt={label} width={100} height={100} className="w-full h-full object-cover rounded-[28px] border-[2px] border-border-[rgba(3,7,18,0.05)]" />
      <span className="text-center text-[17px]/[24px] font-500 text-gray-500 w-full">{label}</span>
    </Link>
  );
};

export default HomeProductButton;
