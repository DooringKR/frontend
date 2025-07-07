"use client";

import { DOOR_CATEGORY_LIST, CABINET_CATEGORY_LIST, ACCESSORY_CATEGORY_LIST, HARDWARE_CATEGORY_LIST } from "@/constants/category";
import { COLOR_LIST } from "@/constants/colorList";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import FileIcon from "public/icons/file";
import { useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";



function ColorList() {
    if (typeof window === "undefined") return null;
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get("type");
    const category = searchParams.get("category"); // 쿼리스트링에서 category 가져오기
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

    const categoryList =
        type === "door" ? DOOR_CATEGORY_LIST :
            type === "cabinet" ? CABINET_CATEGORY_LIST :
                type === "accessory" ? ACCESSORY_CATEGORY_LIST :
                    type === "hardware" ? HARDWARE_CATEGORY_LIST :
                        []; // 필요시 finish 등 추가

    const currentCategory = categoryList.find(item => item.slug === category);
    let header = currentCategory?.header ?? "";

    const filteredColors = COLOR_LIST.filter(item =>
        item.name.toLowerCase().includes(searchKeyword.toLowerCase()),
    );

    return (
        <div className="flex flex-col">
            <TopNavigator />
            <Header size="Large" title={`${header} 색상을 선택해주세요`} />
            <BoxedInput
                type="text"
                className={"px-5 py-3"}
                placeholder="색상 이름으로 검색"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
            />
            <ColorSelectList filteredColors={filteredColors} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
            {!isBottomSheetOpen && <ColorManualInputGuide selectedColor={selectedColor} onClick={() => setIsBottomSheetOpen(true)} />}
            <ColorManualInputSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                value={selectedColor ?? ""}
                onChange={setSelectedColor}
                searchParams={searchParams}
            />
            {!isBottomSheetOpen && <ColorSelectBottomButton
                selectedColor={selectedColor}
                searchParams={searchParams}
                onClick={() => {
                    if (selectedColor) {
                        const params = new URLSearchParams(searchParams);
                        params.set("color", selectedColor);
                        if (type === "door") {
                            router.push(`/order/door?${params.toString()}`);
                        } else if (type === "cabinet") {
                            router.push(`/order/cabinet?${params.toString()}`);
                        } else if (type === "accessory") {
                            router.push(`/order/accessory?${params.toString()}`);
                        } else if (type === "hardware") {
                            router.push(`/order/hardware?${params.toString()}`);
                        }
                    }
                }}
            />}
        </div>
    );
}

export default ColorList;

// 색상 리스트 컴포넌트
function ColorSelectList({ filteredColors, selectedColor, setSelectedColor }: {
    filteredColors: any[],
    selectedColor: string | null,
    setSelectedColor: (name: string) => void
}) {
    return (
        <div className="flex flex-col gap-2 px-1 pb-5 pt-3">
            {filteredColors.length === 0 ? (
                <div className="flex items-center justify-center px-4 py-3 text-center text-[17px]/[24px] font-400 text-gray-400">
                    검색 결과가 없어요
                </div>
            ) : (
                filteredColors.map((item, idx) => {
                    const nameParts = item.name.split(",").map((s: string) => s.trim());
                    const label = [nameParts[1], nameParts[3]].filter(Boolean).join(" ");
                    const description = [nameParts[0], nameParts[2]].filter(Boolean).join(" ∙ ");
                    return (
                        <div key={idx}>
                            <SelectToggleButton
                                label={label}
                                description={description}
                                showInfoIcon={nameParts[3] == "헤링본 - 미백색" ? true : false}
                                checked={selectedColor === item.name ? true : undefined}
                                imageSrc={item.image}
                                onClick={() => {
                                    setSelectedColor(item.name);
                                }}
                            />
                        </div>
                    );
                })
            )}
        </div>
    );
}

// 색상 직접입력 안내 컴포넌트
function ColorManualInputGuide({ selectedColor, onClick }: { selectedColor: string | null, onClick: () => void }) {
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
            <Button
                type={"OutlinedMedium"}
                text={"색상 직접 입력"}
                className="w-fit"
                onClick={onClick}
            />
        </div>
    );
}

// 직접입력 BottomSheet 컴포넌트
function ColorManualInputSheet({ isOpen, onClose, value, onChange, searchParams }: {
    isOpen: boolean,
    onClose: () => void,
    value: string,
    onChange: (v: string) => void,
    searchParams: ReturnType<typeof useSearchParams>,
}) {
    const router = useRouter();
    return (
        <BottomSheet
            isOpen={isOpen}
            title="색상을 직접 입력해주세요"
            description="브랜드명, 색상명 등 색상 정보를 꼼꼼히 입력해주세요."
            children={
                <BoxedInput
                    type="text"
                    placeholder="색상 정보를 입력해주세요"
                    className="pt-5"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
            }
            buttonArea={
                <BottomButton
                    type={"1button"}
                    button1Text={"다음"}
                    className="px-5 pb-5"
                    onButton1Click={() => {
                        if (value) {
                            const params = new URLSearchParams(searchParams);
                            params.set("color", value);
                            router.push(`/order/door/input?${params.toString()}`);
                        }
                    }}
                />
            }
            onClose={onClose}
        />
    );
}

// 하단 BottomButton 컴포넌트
function ColorSelectBottomButton({ selectedColor, searchParams, onClick }: {
    selectedColor: string | null,
    searchParams: ReturnType<typeof useSearchParams>,
    onClick: () => void
}) {
    return (
        <BottomButton
            children={
                selectedColor && (
                    <div className="flex items-center justify-center gap-2 px-5 pb-4 pt-2 bg-white">
                        <Image
                            src={COLOR_LIST.find(item => item.name === selectedColor)?.image || ""}
                            alt={selectedColor}
                            width={20}
                            height={20}
                            className="border-1 h-5 w-5 rounded-[4px] border-[#030712]/5 object-cover"
                        />
                        <div className="text-[16px]/[22px] font-500 text-[#3B82F6]">
                            {(() => {
                                const nameParts = selectedColor.split(",").map(s => s.trim());
                                const label = [nameParts[1], nameParts[3]].filter(Boolean).join(" ");
                                const description = [nameParts[0], nameParts[2]].filter(Boolean).join(" ∙ ");
                                return `${label} (${description}) 선택됨`;
                            })()}
                        </div>
                    </div>
                )
            }
            type={"1button"}
            button1Text={"다음"}
            className="fixed bottom-0 w-full max-w-[500px] px-5 pb-5 bg-white"
            button1Disabled={!selectedColor}
            onButton1Click={onClick}
        />
    );
}