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
            className="flex flex-col items-center justify-center gap-3 bg-gray-50 px-5 py-10"
            style={{ marginBottom: selectedColor ? "134px" : "88px" }}
        >
            <FileIcon />
            <p className="text-center text-[16px]/[22px] font-400 text-gray-500">
                찾는 색상이 없다면
                <br />
                색상을 직접 입력해주세요
            </p>
            <Button type={"OutlinedMedium"} text={"색상 직접 입력"} className="w-fit" onClick={onClick} />
        </div>
    );
};

export default ColorManualInputGuide; 