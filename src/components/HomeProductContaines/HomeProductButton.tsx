import React from "react";

interface HomeProductButtonProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const HomeProductButton: React.FC<HomeProductButtonProps> = ({
  label,
  selected,
  disabled,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`flex h-[72px] w-[72px] flex-col items-center justify-center rounded-xl transition-colors ${selected ? "bg-green-100" : "bg-gray-100"} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-green-50"}`}
      disabled={disabled}
      onClick={onClick}
    >
      {/* 아이콘 자리 (현재 빈 값) */}
      <div className="mb-1 h-10 w-10" />
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  );
};

export default HomeProductButton;
