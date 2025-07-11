import BottomSheet from "@/components/BottomSheet/BottomSheet";
import BoxedInput from "@/components/Input/BoxedInput";
import BottomButton from "@/components/BottomButton/BottomButton";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { navigateWithAllParams } from "../utils/navigateWithAllParams";

interface ColorManualInputSheetProps {
    isOpen: boolean;
    onClose: () => void;
    value: string;
    onChange: (v: string) => void;
    searchParams: ReturnType<typeof useSearchParams>;
    type: string;
}

const ColorManualInputSheet: React.FC<ColorManualInputSheetProps> = ({
    isOpen,
    onClose,
    value,
    onChange,
    searchParams,
    type,
}) => {
    const router = useRouter();
    return (
        <BottomSheet
            isOpen={isOpen}
            title="색상을 직접 입력해주세요"
            description="브랜드명, 색상명 등 색상 정보를 꼼꼼히 입력해주세요."
            onClose={onClose}
        >
            <BoxedInput
                type="text"
                placeholder="색상 정보를 입력해주세요"
                className="pt-5"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
            <div>
                <BottomButton
                    type={"1button"}
                    button1Text={"다음"}
                    className="px-5 pb-5"
                    onButton1Click={() => {
                        if (value) {
                            navigateWithAllParams({
                                router,
                                searchParams,
                                type,
                                category: searchParams.get("category"),
                                color: value,
                            });
                        }
                    }}
                />
            </div>
        </BottomSheet>
    );
};

export default ColorManualInputSheet; 