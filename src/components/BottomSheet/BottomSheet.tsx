import React, { useEffect } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  title: string | React.ReactNode;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode; // For additional elements like agreement, select options, etc.
  buttonArea?: React.ReactNode; // 버튼 영역을 외부에서 주입
  headerButtonText?: string;
  onHeaderButtonClick?: () => void;
  contentPadding?: string; // content 영역의 padding을 조절할 수 있는 prop 추가
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  title,
  description,
  onClose,
  children,
  buttonArea,
  headerButtonText,
  onHeaderButtonClick,
  contentPadding = "px-5", // 기본값은 px-5
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center">
        {/* 오버레이 배경: 가운데 500px만 적용 */}
        <div className="h-full w-full max-w-[460px] bg-black bg-opacity-20" onClick={onClose}></div>
      </div>
      <div
        className="fixed bottom-[10px] left-1/2 flex w-[calc(100%-20px)] max-w-[460px] -translate-x-1/2 flex-col rounded-[24px] bg-white"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the container
      >
        <div className="flex justify-center px-5 py-3">
          <div className="h-[4px] w-[40px] rounded-[9999px] bg-gray-200"></div>
        </div>
        <div className="flex flex-col items-start gap-1 px-5 pt-2">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-[20px]/[28px] font-700 text-gray-900">
              {typeof title === "string"
                ? title.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < title.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))
                : title}
            </h2>
            {headerButtonText && (
              <div
                onClick={onHeaderButtonClick}
                className="cursor-pointer text-[15px]/[22px] font-500 text-gray-400"
              >
                {headerButtonText}
              </div>
            )}
          </div>
          <p className="text-[16px]/[22px] font-400 text-gray-500">{description}</p>
        </div>
        {children && <div className={contentPadding}>{children}</div>}
        {buttonArea && <div>{buttonArea}</div>}
      </div>
    </div>
  );
};

export default BottomSheet;
