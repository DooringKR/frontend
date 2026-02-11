import React, { useEffect, useRef } from "react";

import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import BoxedInput from "@/components/Input/BoxedInput";

interface ColorManualInputSheetProps {
    isOpen: boolean;
    onClose: () => void;
    value: string;
    onChange: (v: string) => void;
    type: string;
    onNext: () => void;
}

const ColorManualInputSheet: React.FC<ColorManualInputSheetProps> = ({
    isOpen,
    onClose,
    value,
    onChange,
    type,
    onNext,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    return (
        <BottomSheet
            isOpen={isOpen}
            title="색상을 직접 입력해주세요"
            description="브랜드명, 색상명 등 색상 정보를 꼼꼼히 입력해주세요."
            onClose={onClose}
        >
            <BoxedInput
                ref={inputRef}
                type="text"
                placeholder="색상 정보를 입력해주세요"
                className="pt-5"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
            <div className="py-5">
                <Button
                    type="Brand"
                    text="다음"
                    onClick={() => {
                        onNext();
                    }}
                />
            </div>
        </BottomSheet>
    );
};

export default ColorManualInputSheet;


