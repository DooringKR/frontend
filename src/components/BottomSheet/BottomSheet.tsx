import React from "react";

interface BottomSheetProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode; // For additional elements like agreement, select options, etc.
  buttonArea?: React.ReactNode; // 버튼 영역을 외부에서 주입
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  title,
  description,
  onClose,
  children,
  buttonArea,
}) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        {/* 오버레이 배경: 가운데 500px만 적용 */}
        <div
          className="w-full max-w-[500px] bg-black bg-opacity-20"
          onClick={onClose}
          style={{ minHeight: "100vh" }}
        ></div>
      </div>
      <div
        className="fixed bottom-[10px] left-1/2 flex w-[calc(100%-20px)] max-w-[500px] -translate-x-1/2 flex-col rounded-[24px] bg-white"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the container
      >
        <div className="flex justify-center px-5 py-3">
          <div className="h-[4px] w-[40px] rounded-[9999px] bg-gray-200"></div>
        </div>
        <div className="flex flex-col items-start gap-1 px-5 pt-2">
          <h2 className="text-[20px] font-700 text-gray-900">{title}</h2>
          <p className="text-[16px] font-400 text-gray-500">{description}</p>
        </div>
        {children && <div className="px-5">{children}</div>}
        {buttonArea && <div className="mt-5">{buttonArea}</div>}
      </div>
    </>
  );
};

export default BottomSheet;
