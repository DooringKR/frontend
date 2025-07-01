import React from "react";

interface IconProps {
  icon?: React.ReactNode;
}

interface ButtonProps extends IconProps {
  type: "Brand" | "GrayLarge" | "OutlinedLarge" | "BrandInverse" | "GrayMedium" | "OutlinedMedium";
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ type, text, onClick, disabled, icon }) => {
  const getClassName = () => {
    switch (type) {
      case "Brand":
        return [
          "bg-brand-500 px-4 py-3 rounded-[12px]",
          "text-white text-[17px] font-500",
          "hover:bg-brand-600 focus:ring-4 focus:ring-brand-200",
          "disabled:bg-brand-100 disabled:cursor-not-allowed",
        ].join(" ");
      case "GrayLarge":
        return [
          "bg-gray-100 px-4 py-3 rounded-[12px]",
          "text-gray-700 text-[17px] font-500",
          "hover:bg-gray-200 focus:ring-4 focus:ring-gray-300",
          "disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed",
        ].join(" ");
      case "OutlinedLarge":
        return [
          "border-[1px] border-gray-200 bg-white px-4 py-3 rounded-[12px]",
          "text-gray-700 text-[17px] font-500",
          "hover:bg-gray-50 focus:ring-4 focus:ring-gray-200",
          "disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed",
        ].join(" ");
      case "BrandInverse":
        return [
          "bg-brand-100 px-4 py-3 rounded-[12px]",
          "text-brand-600 text-[17px] font-500",
          "hover:bg-brand-200 focus:ring-4 focus:ring-brand-200",
          "disabled:bg-brand-50 disabled:text-brand-200 disabled:cursor-not-allowed",
        ].join(" ");
      case "GrayMedium":
        return [
          "h-[40px] bg-gray-100 px-3 py-[9px] rounded-[12px]",
          "text-gray-700 text-[16px] font-500",
          "hover:bg-gray-200 focus:ring-[3px] focus:ring-gray-300",
          "disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed",
        ].join(" ");
      case "OutlinedMedium":
        return [
          "h-[40px] border-[1px] border-gray-200 bg-white px-3 py-[9px] rounded-[12px]",
          "text-gray-700 text-[16px] font-500",
          "hover:bg-gray-50 focus:ring-[3px] focus:ring-gray-200",
          "disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed",
        ].join(" ");
      default:
        return "";
    }
  };

  return (
    <button
      className={`button w-full ${getClassName()} flex items-center justify-center`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center justify-center gap-1">
        {icon && (
          <span className={`icon-left ${disabled ? "text-gray-300" : "text-gray-700"}`}>
            {icon}
          </span>
        )}
        {text}
      </div>
    </button>
  );
};

export default Button;
