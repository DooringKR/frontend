"use client";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import FlapDoorPreview from "@/components/DoorPreview/FlapDoorPreview";
import formatLocation from "@/utils/formatLocation";
import formatColor from "@/utils/formatColor";

import useItemStore from "@/store/itemStore";
import { useFlapDoorValidation } from "./hooks/useFlapDoorValidation";
import { Location } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";


// Hooks

function FlapDoorPageContent() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    // 초기값을 itemStore에서 읽어오기
    const [boringNum, setBoringNum] = useState<2 | 3 | 4>(item?.boringNum || 2);
    const [doorWidth, setDoorWidth] = useState<number | null>(item?.door_width ?? null);
    const [doorHeight, setDoorHeight] = useState<number | null>(item?.door_height ?? null);

    // boringSize 초기값 설정
    const [boringSize, setBoringSize] = useState<(number | null)[]>(item?.hinge ?? []);

    const [request, setRequest] = useState(item?.door_request ?? "");
    const [door_location, setDoorLocation] = useState(item?.door_location ?? "");
    const [addOn_hinge, setAddOn_hinge] = useState(item?.addOn_hinge ?? false);
    const [isDoorLocationSheetOpen, setIsDoorLocationSheetOpen] = useState(false);

    // 유효성 검사 훅 사용
    const { widthError, heightError, boringError, isFormValid } = useFlapDoorValidation({
        DoorWidth: doorWidth,
        DoorHeight: doorHeight,
        boringSize,
        boringNum,
    });

    // boringNum이 바뀔 때 boringSize 길이 자동 조정
    useEffect(() => {
        // 기존 값을 유지하면서 새로운 길이에 맞게 조정
        const newBoringSize = Array.from({ length: boringNum }, (_, i) =>
            boringSize && boringSize[i] !== undefined ? boringSize[i] : null,
        );
        setBoringSize(newBoringSize);
    }, [boringNum]);

    // 각 필드 변경 시 useItemStore에 저장
    const handleBoringNumChange = (newBoringNum: 2 | 3 | 4) => {
        setBoringNum(newBoringNum);
        const newBoringSize = Array.from({ length: newBoringNum }, (_, i) =>
            boringSize && boringSize[i] !== undefined ? boringSize[i] : null,
        );
        setBoringSize(newBoringSize);
        updateItem({ boringNum: newBoringNum, hinge: newBoringSize });
    };

    const handleDoorWidthChange = (newWidth: number | null) => {
        setDoorWidth(newWidth);
        updateItem({ door_width: newWidth });
    };

    const handleDoorHeightChange = (newHeight: number | null) => {
        setDoorHeight(newHeight);
        updateItem({ door_height: newHeight });
    };

    const handleBoringSizeChange = (newBoringSize: (number | null)[]) => {
        setBoringSize(newBoringSize);
        updateItem({ hinge: newBoringSize });
    };

    const handleRequestChange = (newRequest: string) => {
        setRequest(newRequest);
        updateItem({ door_request: newRequest });
    };

    const handleDoorLocationChange = (newLocation: string) => {
        setDoorLocation(newLocation);
        updateItem({ door_location: newLocation });
    };

    const handleAddOnHingeChange = (newAddOnHinge: boolean) => {
        setAddOn_hinge(newAddOnHinge);
        updateItem({ addOn_hinge: newAddOnHinge });
    };

    return (
        <div className="flex min-h-screen flex-col">
            <TopNavigator />
            <Header
                title={
                    "플랩문 정보를 입력해주세요"
                }
            />
            <div className="flex flex-1 flex-col gap-5 px-5">
                <BoxedSelect
                    label="색상"
                    options={[]}
                    value={formatColor(item?.color ?? "") || item?.door_color_direct_input || ""}
                    onClick={() => router.back()}
                    onChange={() => { }}
                    truncate={true}
                />

                {/* 플랩문 폼 내용 */}
                <BoxedInput
                    type="number"
                    label="가로 길이(mm)"
                    placeholder="가로 길이를 입력해주세요"
                    value={doorWidth}
                    onChange={e => {
                        const value = e.target.value;
                        handleDoorWidthChange(value ? Number(value) : null);
                    }}
                    error={!!widthError}
                    helperText={widthError}
                />
                <BoxedInput
                    type="number"
                    label="세로 길이(mm)"
                    placeholder="세로 길이를 입력해주세요"
                    value={doorHeight}
                    onChange={e => {
                        const value = e.target.value;
                        handleDoorHeightChange(value ? Number(value) : null);
                    }}
                    error={!!heightError}
                    helperText={heightError}
                />
                <div className="flex flex-col gap-2">
                    <div className="w-full text-[14px] font-400 text-gray-600"> 경첩</div>
                    <div className="flex flex-row gap-2">
                        <Button
                            type={boringNum == 2 ? "BrandInverse" : "GrayLarge"}
                            text={"2개"}
                            onClick={() => handleBoringNumChange(2)}
                        />
                        <Button
                            type={boringNum == 3 ? "BrandInverse" : "GrayLarge"}
                            text={"3개"}
                            onClick={() => handleBoringNumChange(3)}
                        />
                        <Button
                            type={boringNum == 4 ? "BrandInverse" : "GrayLarge"}
                            text={"4개"}
                            onClick={() => handleBoringNumChange(4)}
                        />
                    </div>
                    {boringError && <div className="px-1 text-sm text-red-500">{boringError}</div>}
                </div>
                <div className="flex items-center justify-center pt-5">
                    <FlapDoorPreview
                        DoorWidth={doorWidth}
                        DoorHeight={doorHeight}
                        boringNum={boringNum}
                        boringSize={boringSize}
                        onChangeBoringSize={handleBoringSizeChange}
                        doorColor={item?.color ?? ""}
                    />
                </div>

                <BoxedSelect
                    label="용도 ∙ 장소"
                    options={[]}
                    value={door_location ? formatLocation(door_location) : ""}
                    onClick={() => setIsDoorLocationSheetOpen(true)}
                    onChange={() => { }}
                />
                <DoorLocationSheet
                    isOpen={isDoorLocationSheetOpen}
                    onClose={() => setIsDoorLocationSheetOpen(false)}
                    value={door_location}
                    onChange={handleDoorLocationChange}
                />
                <div className="flex flex-col gap-2">
                    <div className="w-full text-[14px] font-400 text-gray-600">경첩 추가 선택</div>
                    <div className="flex flex-row gap-2">
                        <Button
                            type={addOn_hinge ? "BrandInverse" : "GrayLarge"}
                            text={"경첩도 받기"}
                            onClick={() => handleAddOnHingeChange(true)}
                        />
                        <Button
                            type={addOn_hinge ? "GrayLarge" : "BrandInverse"}
                            text={"필요 없어요"}
                            onClick={() => handleAddOnHingeChange(false)}
                        />
                    </div>
                </div>
                <BoxedInput
                    label="제작 시 요청사항"
                    placeholder="제작 시 요청사항 | 예) 시공도 필요해요, …"
                    value={request}
                    onChange={e => handleRequestChange(e.target.value)}
                />
            </div>
            <div className="h-[100px]"></div>
            {!isDoorLocationSheetOpen &&
                <div id="flap-door-next-button">
                    <BottomButton
                        type={"1button"}
                        button1Text={"다음"}
                        className="fixed bottom-0 w-full max-w-[460px]"
                        button1Disabled={isFormValid()}
                        onButton1Click={() => {
                            router.push("/door/report");
                        }}
                    />
                </div>
            }
        </div>
    );
}

function FlapDoorPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <FlapDoorPageContent />
        </Suspense>
    );
}

// 용도 및 장소 선택 시트 컴포넌트
function DoorLocationSheet({
    isOpen,
    onClose,
    value,
    onChange,
}: {
    isOpen: boolean;
    onClose: () => void;
    value: string;
    onChange: (v: string) => void;
}) {
    const options = [
        { value: Location.KITCHEN, label: "주방" },
        { value: Location.SHOES, label: "신발장" },
        { value: Location.BUILT_IN, label: "붙박이장" },
        { value: Location.BALCONY, label: "발코니 창고문" },
        { value: Location.ETC, label: "기타 수납장" },
    ];

    return (
        <BottomSheet
            isOpen={isOpen}
            title="용도 및 장소를 선택해주세요"
            contentPadding="px-1"
            children={
                <div>
                    <div>
                        {options.map(option => (
                            <SelectToggleButton
                                key={option.value}
                                label={option.label}
                                checked={value === option.value}
                                onClick={() => onChange(option.value)}
                            />
                        ))}
                        <div className="p-5">
                            <Button
                                type="Brand"
                                text="다음"
                                onClick={() => {
                                    onClose();
                                }}
                            />
                        </div>
                    </div>
                </div>
            }
            onClose={onClose}
        />
    );
}

export default FlapDoorPage;
