import Button from "@/components/Button/Button";
import FileIcon from "public/icons/file";
import React from "react";

interface ColorManualInputGuideProps {
    selectedColor: string | null;
    onClick: () => void;
}

const ColorManualInputGuide: React.FC<ColorManualInputGuideProps> = ({ selectedColor, onClick }) => {
    return (
        <div
            className="flex flex-col items-start
             justify-center gap-3 rounded-[16px]
             p-5 mx-5 mx-3 border border-[#FFD6A7] bg-[#FFF7ED]"
        // style={{ marginBottom: selectedColor ? "134px" : "88px" }}
        >
            <div className="gap-1">
                <p className="text-[17px]/[24px] font-600 text-gray-800">
                    원하는 색상이 없어도   <br />
                    직접 입력할 수 있어요
                </p>
                <p className="text-[14px]/[20px] font-500 text-gray-500">원하는 브랜드, 색상, 두께를 입력하시면 확인 후 가능 여부를 안내드릴게요</p>
            </div>
            <Button type={"OutlinedMedium"} text={"색상 직접 입력"} className="w-full" onClick={onClick} />
        </div>
    );
};

export default ColorManualInputGuide; 