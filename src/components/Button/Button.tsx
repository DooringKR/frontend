import React from "react";
import Image from "next/image";

interface IconProps {
  icon?: React.ReactNode;
  iconSrc?: string; // 이미지 아이콘을 위한 src 추가
  iconWidth?: number; // 이미지 너비 설정
  iconHeight?: number; // 이미지 높이 설정
  useOriginalSize?: boolean; // 원본 크기 사용 여부
}

interface ButtonProps extends IconProps {
  type: "Brand" | "GrayLarge" | "OutlinedLarge" | "BrandInverse" | "GrayMedium" | "OutlinedMedium";
  text: string;
  description?: string; // description 속성 추가
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  type, 
  text, 
  description, 
  onClick, 
  disabled, 
  icon, 
  iconSrc, 
  iconWidth = 24, 
  iconHeight = 24, 
  useOriginalSize = false,
  className
}) => {
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
    <div className="flex flex-col items-center">
      <button
        className={`button ${getClassName()} flex items-center justify-center w-full ${className || ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="flex items-center justify-center gap-1">
          {iconSrc && (
            <Image 
              src={iconSrc} 
              alt={text || "button-icon"}
              width={useOriginalSize ? 200 : iconWidth}
              height={useOriginalSize ? 200 : iconHeight}
              className={`${disabled ? "opacity-30" : ""}`}
              style={{ 
                width: useOriginalSize ? 'auto' : `${iconWidth}px`, 
                height: useOriginalSize ? 'auto' : `${iconHeight}px`,
                maxWidth: useOriginalSize ? '200px' : `${iconWidth}px`,
                maxHeight: useOriginalSize ? '200px' : `${iconHeight}px`
              }}
              unoptimized={true}
            />
          )}
          {!iconSrc && icon && (
            <span className={`icon-left ${disabled ? "text-gray-300" : "text-gray-700"}`}>
              {icon}
            </span>
          )}
          {text && text}
        </div>
      </button>
      {description && (
        <div className={`mt-2 text-sm text-center ${disabled ? "text-gray-300" : "text-gray-600"}`}>
          {description}
        </div>
      )}
    </div>
  );
};

export default Button;
