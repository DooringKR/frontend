import React from "react";

interface HomeProductButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const HomeProductButton: React.FC<HomeProductButtonProps> = ({
  label,
  icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`flex flex-col gap-2 flex-1 items-center justify-center min-w-0 min-h-0`}
      onClick={onClick}
    >
      <div className="w-full">{icon}</div>
      <span className="font-500 text-[17px] text-gray-500 text-center">{label}</span>
    </button>
  );
};

export default HomeProductButton;
