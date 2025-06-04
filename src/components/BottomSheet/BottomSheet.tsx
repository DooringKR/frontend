import React from 'react';

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
            <div
                className="fixed inset-0 bg-black bg-opacity-20"
                onClick={onClose}
            ></div>
            <div
                //좌우 마진 10px추가 적용이 되지 않아 max-w-[480px]로 설정
                className="fixed left-1/2 -translate-x-1/2 bottom-[10px] w-full max-w-[480px] flex flex-col bg-white rounded-[24px]"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the container
            >
                <div className='flex justify-center px-5 py-3'>
                    <div className='h-[4px] w-[40px] rounded-[9999px] bg-gray-200'></div>
                </div>
                <div className='px-5 pt-2 gap-1 flex flex-col items-start'>
                    <h2 className="text-[20px] font-700 text-gray-900">{title}</h2>
                    <p className="text-[16px] text-gray-500 font-400">{description}</p>
                </div>
                {children && <div className="px-5">{children}</div>}
                {buttonArea && <div className="mt-5">{buttonArea}</div>}
            </div>
        </>
    );
};

export default BottomSheet;