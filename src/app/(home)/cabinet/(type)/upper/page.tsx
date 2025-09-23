"use client";

import { BODY_MATERIAL_LIST } from "@/constants/colorList";
import { useCabinetValidation } from "./hooks/useCabinetValidation";


import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import UpperCabinetForm from "@/app/(home)/order/cabinet/_components/UpperCabinetForm";


import useItemStore from "@/store/Items/itemStore";
import formatLocation from "@/utils/formatLocation";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import GrayVerticalLine from "@/components/GrayVerticalLine/GrayVerticalLine";
import BoxedInput from "@/components/Input/BoxedInput";
function UpperCabinetPageContent() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    // 상태 관리 (itemStore 기반)
    const [DoorWidth, setDoorWidth] = useState<number | null>(item?.width ?? null);
    const [DoorHeight, setDoorHeight] = useState<number | null>(item?.height ?? null);
    const [DoorDepth, setDoorDepth] = useState<number | null>(item?.depth ?? null);
    const [color, setColor] = useState(item?.color ?? "");
    const [bodyMaterial, setBodyMaterial] = useState(item?.bodyMaterial ?? "");
    const [handleType, setHandleType] = useState(item?.handleType ?? "");
    const [finishType, setFinishType] = useState(item?.finishType ?? "");
    const [request, setRequest] = useState(item?.request ?? "");
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

    // 값 변경 시 itemStore에 동기화
    useEffect(() => { updateItem({ width: DoorWidth }); }, [DoorWidth]);
    useEffect(() => { updateItem({ height: DoorHeight }); }, [DoorHeight]);
    useEffect(() => { updateItem({ depth: DoorDepth }); }, [DoorDepth]);
    useEffect(() => { updateItem({ color }); }, [color]);
    useEffect(() => { updateItem({ bodyMaterial }); }, [bodyMaterial]);
    useEffect(() => { updateItem({ handleType }); }, [handleType]);
    useEffect(() => { updateItem({ finishType }); }, [finishType]);
    useEffect(() => { updateItem({ request }); }, [request]);

    // validation
    const { widthError, heightError, depthError, isFormValid } = useCabinetValidation({
        DoorWidth,
        DoorHeight,
        DoorDepth,
    });
    // 버튼 활성화 조건 (order/cabinet upper와 동일)
    const button1Disabled = isFormValid() || bodyMaterial === "" || !handleType || !finishType;

    return (
        <div className="flex flex-col">
            <TopNavigator />
            <Header title="상부장 정보를 입력해주세요" />
            <div className="h-5" />
            <UpperCabinetForm
                color={color}
                bodyMaterial={bodyMaterial}
                DoorWidth={DoorWidth}
                DoorHeight={DoorHeight}
                DoorDepth={DoorDepth}
                request={request}
                handleType={handleType}
                finishType={finishType}
                setDoorWidth={setDoorWidth}
                setDoorHeight={setDoorHeight}
                setDoorDepth={setDoorDepth}
                setRequest={setRequest}
                setBodyMaterial={setBodyMaterial}
                setIsBottomSheetOpen={setIsBottomSheetOpen}
                setHandleType={setHandleType}
                setFinishType={setFinishType}
                router={router}
                widthError={widthError}
                heightError={heightError}
                depthError={depthError}
            />
            <div className="h-5" />
            <BodyMaterialManualInputSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                value={bodyMaterial}
                onChange={setBodyMaterial}
            />
            <div className="h-[100px]" />
            {!isBottomSheetOpen && (
                <div id="cabinet-next-button">
                    <BottomButton
                        type={"1button"}
                        button1Text={"다음"}
                        className="fixed bottom-0 w-full max-w-[460px]"
                        button1Disabled={button1Disabled}
                        onButton1Click={() => {
                            // itemStore 값만 활용
                            router.push("/cabinet/report");
                        }}
                    />
                </div>
            )}
        </div>
    );
}
// 아래는 바텀시트 컴포넌트들 (원본 /order/cabinet 참고, 옵션/직접입력 구조)
function BodyMaterialManualInputSheet({ isOpen, onClose, value, onChange }: { isOpen: boolean; onClose: () => void; value: string; onChange: (v: string) => void; }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const options = BODY_MATERIAL_LIST;
    return (
        <BottomSheet
            isOpen={isOpen}
            title="몸통 소재 및 두께를 선택해주세요"
            contentPadding="px-1"
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
                                onChange("");
                                setTimeout(() => inputRef.current?.focus(), 0);
                            }}
                        />
                        {options.every(opt => value !== opt) && (
                            <div className="flex items-center gap-2 px-4 pb-3">
                                <GrayVerticalLine />
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
                </div>
            }
            onClose={onClose}
            buttonArea={
                <div className="p-5">
                    <Button type="Brand" text="다음" onClick={onClose} />
                </div>
            }
        />
    );
}

function HandleTypeInputSheet({ isOpen, onClose, value, onChange }: { isOpen: boolean; onClose: () => void; value: string; onChange: (v: string) => void; }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const options: string[] = [];
    return (
        <BottomSheet
            isOpen={isOpen}
            title="손잡이 종류를 선택해주세요"
            contentPadding="px-1"
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
                                onChange("");
                                setTimeout(() => inputRef.current?.focus(), 0);
                            }}
                        />
                        {options.every(opt => value !== opt) && (
                            <div className="flex items-center gap-2 px-4 pb-3">
                                <GrayVerticalLine />
                                <BoxedInput
                                    ref={inputRef}
                                    type="text"
                                    placeholder="손잡이 종류를 입력해주세요"
                                    className="w-full"
                                    value={value}
                                    onChange={e => onChange(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            }
            onClose={onClose}
            buttonArea={
                <div className="p-5">
                    <Button type="Brand" text="다음" onClick={onClose} />
                </div>
            }
        />
    );
}

function FinishTypeInputSheet({ isOpen, onClose, value, onChange }: { isOpen: boolean; onClose: () => void; value: string; onChange: (v: string) => void; }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const options: string[] = [];
    return (
        <BottomSheet
            isOpen={isOpen}
            title="마감재를 선택해주세요"
            contentPadding="px-1"
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
                                onChange("");
                                setTimeout(() => inputRef.current?.focus(), 0);
                            }}
                        />
                        {options.every(opt => value !== opt) && (
                            <div className="flex items-center gap-2 px-4 pb-3">
                                <GrayVerticalLine />
                                <BoxedInput
                                    ref={inputRef}
                                    type="text"
                                    placeholder="마감재를 입력해주세요"
                                    className="w-full"
                                    value={value}
                                    onChange={e => onChange(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            }
            onClose={onClose}
            buttonArea={
                <div className="p-5">
                    <Button type="Brand" text="다음" onClick={onClose} />
                </div>
            }
        />
    );
}

function LegTypeInputSheet({ isOpen, onClose, value, onChange }: { isOpen: boolean; onClose: () => void; value: string; onChange: (v: string) => void; }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const options = [
        "150 다리 (걸레받이)",
        "120 다리 (걸레받이)",
        "다리발 없음 (60 속걸레받이)",
    ];
    return (
        <BottomSheet
            isOpen={isOpen}
            title="다리발 종류를 선택해주세요"
            contentPadding="px-1"
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
                                onChange("");
                                setTimeout(() => inputRef.current?.focus(), 0);
                            }}
                        />
                        {options.every(opt => value !== opt) && (
                            <div className="flex items-center gap-2 px-4 pb-3">
                                <GrayVerticalLine />
                                <BoxedInput
                                    ref={inputRef}
                                    type="text"
                                    placeholder="다리발 종류를 입력해주세요"
                                    className="w-full"
                                    value={value}
                                    onChange={e => onChange(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            }
            onClose={onClose}
            buttonArea={
                <div className="p-5">
                    <Button type="Brand" text="다음" onClick={onClose} />
                </div>
            }
        />
    );
}
// 불필요한 CabinetLocationSheet, UpperCabinetPageContent 중복 선언 제거

function UpperCabinetPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <UpperCabinetPageContent />
        </Suspense>
    );
}

export default UpperCabinetPage;
