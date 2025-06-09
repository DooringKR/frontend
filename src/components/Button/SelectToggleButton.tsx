import InfoIcon from "public/icons/Info";
import CheckIcon from "public/icons/check";
import React from "react";

interface SelectToggleButtonProps {
  imageSrc?: string; // 버튼에 표시될 이미지 경로
  label: string; // 버튼의 레이블
  description?: string; // 버튼의 디스크립션
  checked?: boolean | undefined; // 체크 여부 (null일 경우 아이콘 숨김)
  onClick: () => void; // 버튼 클릭 핸들러
}

const SelectToggleButton: React.FC<SelectToggleButtonProps> = ({
  imageSrc,
  label,
  description,
  checked,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      //   onClick={() => {
      //     console.log("button clicked");
      //     console.log(checked);
      //   }}
      className={`flex w-full items-center gap-3 rounded-[12px] px-4 py-3 transition hover:bg-gray-50`}
    >
      {/* 이미지 */}
      {imageSrc && <div className="h-8 w-8 rounded-[4px] bg-yellow-100"></div>}
      {/* <img src={imageSrc} alt={label} className="h-8 w-8 rounded-full object-cover" /> */}
      <div className="flex items-center gap-1">
        <div className="text-[17px] font-500 text-gray-600">{label}</div>
        {description && <InfoIcon />}
      </div>
      {description && <div className="text-[17px] font-400 text-gray-400">{description}</div>}
      {/* 체크박스 아이콘 */}
      {checked !== undefined && (
        <div className="ml-auto">
          <CheckIcon checked={!!checked} />
        </div>
      )}
    </button>
  );
};

export default SelectToggleButton;
