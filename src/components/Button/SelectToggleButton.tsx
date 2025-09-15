import Image from "next/image";
import InfoIcon from "public/icons/Info";
import CheckIcon from "public/icons/check";
import React from "react";

interface SelectToggleButtonProps {
  imageSrc?: string; // 버튼에 표시될 이미지 경로
  label: string; // 버튼의 레이블
  description?: string; // 버튼의 디스크립션
  checked?: boolean | undefined; // 체크 여부 (null일 경우 아이콘 숨김)
  showInfoIcon?: boolean; // InfoIcon 표시 여부
  customIcon?: React.ReactNode; // 커스텀 아이콘 (기본값: CheckIcon)
  onClick: () => void; // 버튼 클릭 핸들러
}

const SelectToggleButton: React.FC<SelectToggleButtonProps> = ({
  imageSrc,
  label,
  description,
  checked,
  showInfoIcon = false,
  customIcon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      //   onClick={() => {
      //     console.log("button clicked");
      //     console.log(checked);
      //   }}
      className={`flex h-[48px] w-full items-center gap-3 rounded-[12px] px-4 py-3 transition hover:bg-gray-50`}
    >
      {/* 이미지 TODO: 컬러 constant 추가가 필요합니다. 지금 전부 체크박스로 보이네요*/}
      {imageSrc && (
        <div className="relative h-6 w-6">
          <Image
            src={imageSrc}
            alt={label}
            width={24}
            height={24}
            className="h-6 w-6 rounded-[4px] border-1 border-[#030712]/5 object-cover"
          />
          <div
            className="absolute top-0 left-0 h-6 w-6 rounded-[4px] pointer-events-none"
            style={{ boxShadow: "inset 0px 0px 0px 1px rgba(3,7,18,0.05)" }}
          />
        </div>
      )}
      <div className="flex items-center gap-1">
        <div className="text-[17px]/[24px] font-500 text-gray-600">{label}</div>
        {showInfoIcon && <InfoIcon />}
      </div>
      {description && (
        <div className="flex items-center text-[14px]/[20px] font-400 text-gray-400">
          {description}
        </div>
      )}
      {/* 체크박스 아이콘 */}
      {checked !== undefined && (
        <div className="ml-auto">{customIcon || <CheckIcon checked={!!checked} />}</div>
      )}
    </button>
  );
};

export default SelectToggleButton;
