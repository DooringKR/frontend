"use client";

import React from "react";

interface HomeProductButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const HomeProductButton: React.FC<HomeProductButtonProps> = ({ label, icon, onClick }) => {
  return (
    <button
      type="button"
      className={`flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-2`}
      onClick={onClick}
    >
      <div className="w-full">{icon}</div>
      <span className="text-center text-[17px] font-500 text-gray-500">{label}</span>
    </button>
  );
};

export default HomeProductButton;
