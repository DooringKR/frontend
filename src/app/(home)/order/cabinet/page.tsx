"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { CABINET_CATEGORY_LIST } from "@/constants/category";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import SelectToggleButton from "@/components/Button/SelectToggleButton";

function DoorInfoInputPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [DoorWidth, setDoorWidth] = useState<number | null>(null);
    const [DoorHeight, setDoorHeight] = useState<number | null>(null);
    const [DoorDepth, setDoorDepth] = useState<number | null>(null);
    const [request, setRequest] = useState("");
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [bodyMaterial, setBodyMaterial] = useState("");

    const color = searchParams.get("color") ?? "";
    const category = searchParams.get("category") ?? "";

    // category(slug)에 맞는 header 값 찾기
    const currentCategory = CABINET_CATEGORY_LIST.find(item => item.slug === category);
    const headerTitle = currentCategory?.header || category;

    return (
        <div className="flex flex-col">
            <TopNavigator />
            <Header title={`${headerTitle} 정보를 입력해주세요`} />
            <div className="h-5" />
            <div className="flex flex-col gap-5 px-5">
                <BoxedSelect
                    label="도어 색상"
                    options={[]}
                    value={color}
                    onClick={() => router.back()}
                    onChange={() => { }}
                />
                <BoxedSelect
                    label="몸통 소재 및 두께"
                    options={[]}
                    value={bodyMaterial}
                    onClick={() => {
                        setIsBottomSheetOpen(true);
                    }}
                    onChange={() => { }}
                />
                <BoxedInput
                    type="text"
                    label="가로 길이(mm)"
                    placeholder="가로 길이를 입력해주세요"
                    value={DoorWidth !== null ? `${DoorWidth}mm` : ""}
                    onChange={e => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setDoorWidth(value ? Number(value) : null);
                    }}
                />
                <BoxedInput
                    type="text"
                    label="세로 길이(mm)"
                    placeholder="세로 길이를 입력해주세요"
                    value={DoorHeight !== null ? `${DoorHeight}mm` : ""}
                    onChange={e => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setDoorHeight(value ? Number(value) : null);
                    }}
                />
                <BoxedInput
                    label="제작 시 요청사항"
                    placeholder="제작 시 요청사항을 입력해주세요"
                    value={request}
                    onChange={e => setRequest(e.target.value)}
                />
            </div>
            <BodyMaterialManualInputSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                value={bodyMaterial}
                onChange={setBodyMaterial}
                searchParams={searchParams}
            />
            <BottomButton
                type={"1button"}
                button1Text={"다음"}
                className="px-5 pb-5"
                button1Disabled={DoorWidth === null || DoorHeight === null || DoorDepth === null}
                onButton1Click={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("width", DoorWidth?.toString() ?? "");
                    params.set("height", DoorHeight?.toString() ?? "");
                    params.set("depth", DoorDepth?.toString() ?? "");
                    params.set("request", request);
                    router.push(`/order/cabinet/confirm?${params.toString()}`);
                }}
            />
        </div>
    );
}

export default DoorInfoInputPage;

// 직접입력 BottomSheet 컴포넌트
function BodyMaterialManualInputSheet({ isOpen, onClose, value, onChange, searchParams }: {
    isOpen: boolean,
    onClose: () => void,
    value: string,
    onChange: (v: string) => void,
    searchParams: ReturnType<typeof useSearchParams>,
}) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    // 미리 정의된 옵션
    const options = [
        "헤링본 PP 15T",
        "헤링본 PP 18T",
        "파타고니아 크림 LPM 18T",
    ];

    return (
        <BottomSheet
            isOpen={isOpen}
            title="몸통 소재 및 두께를 선택해주세요"
            children={
                <div>
                    {options.map(option => (
                        <SelectToggleButton
                            key={option}
                            label={option}
                            checked={value === option}
                            onClick={() => onChange(option)}
                        />
                    ))}
                    <div className="flex flex-col">
                        <SelectToggleButton
                            label="직접 입력"
                            checked={options.every(opt => value !== opt)}
                            onClick={() => {
                                onChange(""); // 입력창을 비우고 포커스
                                setTimeout(() => inputRef.current?.focus(), 0);
                            }}
                        />
                        {options.every(opt => value !== opt) && (
                            <div className="flex gap-2 items-center px-4 pb-3">
                                <div className="w-[4px] h-full min-h-[48px] rounded-[9999px] bg-gray-200 mx-2"></div>
                                <BoxedInput
                                    ref={inputRef}
                                    type="text"
                                    placeholder="브랜드, 소재, 두께 등"
                                    className="w-full"
                                    value={value}
                                    onChange={e => onChange(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <BottomButton
                        type={"1button"}
                        button1Text={"다음"}
                        className="px-5 pb-5"
                        button1Disabled={!value}
                        onButton1Click={() => {
                            onClose();
                        }}
                    />
                </div>
            }
            onClose={onClose}
        />
    );
}
