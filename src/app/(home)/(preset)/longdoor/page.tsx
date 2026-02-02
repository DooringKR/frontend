"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import ImageButton from "@/components/Button/ImageButton";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import NormalDoorPreview from "@/components/DoorPreview/NormalDoorPreview";
import Checkbox from "@/components/Checkbox";
import ManWhiteIcon from "public/icons/man_white";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";

import formatLocation from "@/utils/formatLocation";
import formatColor from "@/utils/formatColor";

import useItemStore from "@/store/itemStore";
import { DOOR_COLOR_LIST } from "@/constants/colorList";

import { useDoorValidation } from "./hooks/useDoorValidation";
import { HingeDirection, Location, CabinetHandleType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

function LongDoorPageContent() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    const selectedDoorColorName = item?.color ?? null;
    const selectedDoorColorImage =
        selectedDoorColorName ? DOOR_COLOR_LIST.find(c => c.name === selectedDoorColorName)?.image : undefined;

    // 문짝 개별 속성 타입 정의
    type DoorItem = {
        door_width: number | null;
        hinge_direction: HingeDirection | null;
    };

    // 문짝 수량(기본 1)
    const [quantity, setQuantity] = useState<number>(item?.quantity ?? 1);

    // doors 배열 초기화: item에서 기존 doors 배열이 있으면 사용, 없으면 수량에 맞춰 생성
    const initializeDoors = (qty: number): DoorItem[] => {
        const existingDoors = item?.doors as DoorItem[] | undefined;
        if (existingDoors && Array.isArray(existingDoors) && existingDoors.length === qty) {
            return existingDoors;
        }
        // 기존 데이터가 없거나 수량이 맞지 않으면 새로 생성
        // 기존 door_width, hinge_direction이 있으면 첫 번째 문에 적용
        const defaultWidth = item?.door_width ?? null;
        const defaultDirection = (item?.hinge_direction as HingeDirection) ?? null;
        return Array.from({ length: qty }, (_, idx) => ({
            door_width: idx === 0 ? defaultWidth : null,
            hinge_direction: idx === 0 ? defaultDirection : null,
        }));
    };

    const [doors, setDoors] = useState<DoorItem[]>(() => initializeDoors(item?.quantity ?? 1));

    // 선택된 문 인덱스 (미리보기에서 클릭한 문)
    const [selectedDoorIndex, setSelectedDoorIndex] = useState<number | null>(null);

    const canSelectLastDoorHingeDirection = quantity % 2 === 1;

    const [boringNum, setBoringNum] = useState<2 | 3 | 4 | null>(item?.boringNum ?? null);

    useEffect(() => {
        setScreenName("preset_longdoor");
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    // 롱문은 양문 선택 옵션을 제공하지 않으므로 항상 단문으로 고정
    useEffect(() => {
        if (item?.is_pair_door) {
            updateItem({ is_pair_door: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 수량 변경 시 doors 배열 동기화 및 store에 저장
    useEffect(() => {
        // 1~10 범위 고정
        const clamped = Math.min(10, Math.max(1, quantity));
        if (clamped !== quantity) {
            setQuantity(clamped);
            return;
        }

        // doors 배열 크기 조정
        const newDoors: DoorItem[] = Array.from({ length: clamped }, (_, idx) => {
            const isLastDoor = idx === clamped - 1;
            const existingDoor = doors[idx];

            // 마지막 문이 아니면 좌경, 우경을 번갈아가며 자동 설정
            if (!isLastDoor) {
                // 기존 가로 길이는 유지, 경첩 방향은 자동 설정 (좌, 우, 좌, 우...)
                return {
                    door_width: existingDoor?.door_width ?? doors[0]?.door_width ?? null,
                    hinge_direction: idx % 2 === 0 ? HingeDirection.LEFT : HingeDirection.RIGHT,
                };
            }

            // 마지막 문
            // - 짝수 개수: 자동 적용(선택 불가) → 기존 값 무시하고 좌/우 패턴으로 강제
            // - 홀수 개수: 선택 가능 → 기존 값 유지(없으면 자동)
            if (clamped % 2 === 0) {
                return {
                    door_width: existingDoor?.door_width ?? doors[0]?.door_width ?? null,
                    hinge_direction: idx % 2 === 0 ? HingeDirection.LEFT : HingeDirection.RIGHT,
                };
            }

            // 홀수 개수: 마지막 문은 기존 경첩 방향 유지 (없으면 자동 설정)
            return {
                door_width: existingDoor?.door_width ?? doors[0]?.door_width ?? null,
                hinge_direction: existingDoor?.hinge_direction ?? (idx % 2 === 0 ? HingeDirection.LEFT : HingeDirection.RIGHT),
            };
        });

        setDoors(newDoors);
        updateItem({ quantity: clamped, doors: newDoors });

        // 짝수 개수로 바뀌면(마지막 문 선택 불가) '모름' 상태도 해제
        if (clamped % 2 === 0 && isDontKnowHingeDirection) {
            setIsDontKnowHingeDirection(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quantity]);

    // 첫 번째 문의 가로 길이 (UI 편의를 위한 상태, 실제는 doors[0].door_width 사용)
    const [door_width, setDoorWidth] = useState<number | null>(doors[0]?.door_width ?? null);
    const [door_height, setDoorHeight] = useState<number | null>(item?.door_height ?? null);
    const [hinge, setHinge] = useState<(number | null)[]>(item?.hinge ?? []);

    const [door_location, setDoorLocation] = useState(item?.door_location ?? "");
    const [isDoorLocationSheetOpen, setIsDoorLocationSheetOpen] = useState(false);

    // 손잡이 종류 상태 관리
    const [handleType, setHandleType] = useState<CabinetHandleType | "">(
        item && item.handleType && Object.values(CabinetHandleType).includes(item.handleType as CabinetHandleType)
            ? (item.handleType as CabinetHandleType)
            : ""
    );

    const [isDontKnowHingeCount, setIsDontKnowHingeCount] = useState(() => {
        return item?.hinge && item.hinge.length === 1 && item.hinge[0] === null;
    });
    const [isDontKnowHingeDirection, setIsDontKnowHingeDirection] = useState(() => {
        return item?.hinge_direction === HingeDirection.UNKNOWN;
    });

    useEffect(() => {
        if (!door_location) {
            setIsDoorLocationSheetOpen(true);
        }
    }, []);

    useEffect(() => {
        if (boringNum !== null && hinge.length !== boringNum) {
            const newBoringSize = Array.from({ length: boringNum }, (_, i) =>
                hinge && hinge[i] !== undefined ? hinge[i] : null,
            );
            setHinge(newBoringSize);
        }
    }, [boringNum]);

    // 첫 번째 문의 가로 길이와 경첩 방향 (validation용)
    const firstDoorWidth = doors[0]?.door_width ?? null;
    const firstDoorHingeDirection = doors[0]?.hinge_direction ?? null;

    const { widthError, heightError, boringError, isFormValid } = useDoorValidation({
        DoorWidth: firstDoorWidth,
        DoorHeight: door_height,
        hinge,
        boringNum,
        hingeDirection: firstDoorHingeDirection,
        isPairDoor: false,
    });

    const handleBoringNumChange = (newBoringNum: 2 | 3 | 4 | null) => {
        setBoringNum(newBoringNum);
        if (newBoringNum !== null) {
            const newBoringSize = Array.from({ length: newBoringNum }, (_, i) =>
                hinge && hinge[i] !== undefined ? hinge[i] : null,
            );
            setHinge(newBoringSize);
            updateItem({ boringNum: newBoringNum, hinge: newBoringSize });
        } else {
            updateItem({ boringNum: null, hinge: [] });
        }
    };

    // 마지막 문의 경첩 방향 변경 (마지막 문만 선택 가능)
    const handleLastDoorHingeDirectionChange = (newDirection: HingeDirection | null) => {
        const lastIndex = quantity - 1;
        const newDoors = [...doors];
        newDoors[lastIndex] = { ...newDoors[lastIndex], hinge_direction: newDirection };
        setDoors(newDoors);
        updateItem({ doors: newDoors });
    };

    // 개별 문의 가로 길이 변경
    const handleDoorWidthChange = (doorIndex: number, newWidth: number | null) => {
        const newDoors = [...doors];
        newDoors[doorIndex] = { ...newDoors[doorIndex], door_width: newWidth };
        setDoors(newDoors);
        updateItem({ doors: newDoors });

        // 첫 번째 문의 가로 길이 변경 시 UI 상태도 업데이트 (하위 호환성)
        if (doorIndex === 0) {
            setDoorWidth(newWidth);
        }
    };

    // 가로 길이 일괄 입력: 모든 문에 동일 값 적용
    const handleBulkDoorWidthChange = (newWidth: number | null) => {
        const newDoors = doors.map(d => ({ ...d, door_width: newWidth }));
        setDoors(newDoors);
        updateItem({ doors: newDoors });
        setDoorWidth(newWidth);
    };

    const handleDoorHeightChange = (newHeight: number | null) => {
        setDoorHeight(newHeight);
        updateItem({ door_height: newHeight });
    };

    const handleBoringSizeChange = (newBoringSize: (number | null)[]) => {
        setHinge(newBoringSize);
        updateItem({ hinge: newBoringSize });
    };

    const handleDoorLocationChange = (newLocation: string) => {
        setDoorLocation(newLocation);
        updateItem({ door_location: newLocation });

        setIsDoorLocationSheetOpen(false);
    };

    // 손잡이 종류 변경 시 store에 저장
    useEffect(() => {
        updateItem({ handleType });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleType]);

    return (
        <div className="flex min-h-screen flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={60} />
            <Header title={"롱문 정보를 입력해주세요"} />
            <div className="flex flex-1 flex-col gap-5 px-5">
                <BoxedSelect
                    label={
                        <>
                            <span>색상</span>
                            <span className="text-orange-500 ml-1">*</span>
                        </>
                    }
                    options={[]}
                    value={formatColor(item?.color ?? "") || item?.door_color_direct_input || ""}
                    onClick={() => router.push("/longdoor/color")}
                    onChange={() => { }}
                    truncate={true}
                />

                <BoxedSelect
                    default_label="용도 ∙ 장소"
                    label={
                        <>
                            <span>용도 ∙ 장소</span>
                            <span className="text-orange-500 ml-1">*</span>
                        </>
                    }
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

                {/* 손잡이 종류 */}
                <div className="flex flex-col gap-2">
                    <div className="text-[14px]/[20px] font-400 text-gray-600">
                        손잡이 종류
                        <span className="text-orange-500 ml-1">*</span>
                    </div>
                    <div className="flex w-full gap-2">
                        {Object.values(CabinetHandleType)
                            .filter(opt => opt == CabinetHandleType.OUTER || opt == CabinetHandleType.SMART_BAR || opt == CabinetHandleType.PUSH)
                            .map(opt => (
                                <Button
                                    key={opt}
                                    type={handleType === opt ? "BrandInverse" : "GrayLarge"}
                                    text={opt}
                                    onClick={() => setHandleType(opt)}
                                />
                            ))}
                    </div>
                </div>

                {/* 문짝 개수 */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
                    <div className="text-[16px]/[22px] font-600 text-gray-800">문짝 개수</div>
                    <QuantitySelector
                        quantity={quantity}
                        trashable={false}
                        onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
                        onIncrease={() => setQuantity(q => Math.min(10, q + 1))}
                    />
                </div>

                <BoxedInput
                    type="number"
                    label={
                        <>
                            <span>문 1개의 가로 길이</span>
                            <span className="text-orange-500 ml-1">*</span>
                        </>
                    }
                    placeholder="가로 길이를 입력해주세요"
                    value={doors[0]?.door_width ?? null}
                    onChange={e => {
                        const value = e.target.value;
                        handleBulkDoorWidthChange(value ? Number(value) : null);
                    }}
                    error={!!widthError}
                    helperText={widthError}
                    inputGuide={{
                        text: "가로 스끼(문틈) 값을 빼고 입력해주세요.",
                        state: "default",
                        color: "text-emerald-500",
                    }}
                />

                <BoxedInput
                    type="number"
                    label={
                        <>
                            <span>세로 길이 (mm)</span>
                            <span className="text-orange-500 ml-1">*</span>
                        </>
                    }
                    placeholder="세로 길이를 입력해주세요"
                    value={door_height}
                    onChange={e => {
                        const value = e.target.value;
                        handleDoorHeightChange(value ? Number(value) : null);
                    }}
                    error={!!heightError}
                    helperText={heightError}
                    inputGuide={{
                        text: "세로 스끼(문틈) 값을 빼고 입력해주세요.",
                        state: "default",
                        color: "text-emerald-500",
                    }}
                />

                {/* 문짝 미리보기(5개씩 2줄 배치) */}
                <div className="w-full">
                    <div className="mb-3 flex items-end justify-between">
                        <div className="text-[14px] font-400 text-gray-600 whitespace-pre-line">
                            {"문을 클릭하면 각 문의 가로 길이를 설정할 수 있어요."}
                        </div>
                        {/* <div className="text-[16px] font-600 text-blue-500 whitespace-pre-line text-right">
                            {"문을 클릭하면\n개별 문의 가로 길이를 설정할 수 있어요."}
                        </div> */}
                    </div>
                    <div className="grid w-full grid-cols-5 gap-3 p-3 rounded-xl border border-gray-300 bg-gray-50">
                        {Array.from({ length: 10 }).map((_, idx) => {
                            const isActive = idx < quantity;
                            const isSelected = selectedDoorIndex === idx;
                            // 미리보기용 표시 규칙:
                            // - 좌/우 번갈아(좌,우,좌,우...)
                            // - 홀수인 경우 마지막 1개는 라벨 표시 안 함
                            // 실제 doors 배열에서 경첩 방향 가져오기
                            const doorHingeDirection = isActive && doors[idx]?.hinge_direction;
                            const hingeLabel = isActive && doorHingeDirection
                                ? (doorHingeDirection === HingeDirection.LEFT ? "좌" : "우")
                                : null;
                            return (
                                <div
                                    key={idx}
                                    onClick={() => isActive && setSelectedDoorIndex(idx === selectedDoorIndex ? null : idx)}
                                    className={`flex h-[92px] items-stretch justify-center rounded-lg cursor-pointer transition-all duration-200 ${isActive
                                        ? isSelected
                                            ? "bg-white border-2 border-blue-500 shadow-lg scale-[1.03] ring-2 ring-blue-200"
                                            : "bg-white border border-gray-300 hover:border-blue-300 hover:shadow-md"
                                        : "bg-gray-100 border border-gray-200 opacity-50"
                                        }`}
                                >
                                    <div
                                        className={`relative h-full w-full rounded-md ${isActive ? "bg-white" : "bg-gray-100"}`}
                                        style={
                                            isActive && selectedDoorColorImage
                                                ? {
                                                    backgroundImage: `url(${selectedDoorColorImage})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                }
                                                : undefined
                                        }
                                    >
                                        {hingeLabel && (
                                            <div className="absolute inset-x-0 bottom-1 flex items-center justify-center">
                                                <div
                                                    className={`rounded-md px-2 py-[2px] text-[16px] font-700 ${isSelected ? "bg-blue-50 text-blue-700" : "bg-white/80 text-gray-800"
                                                        }`}
                                                >
                                                    {hingeLabel}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-2 text-[12px]/[16px] font-400 text-gray-500">
                        최소 1개 ~ 최대 10개까지 선택할 수 있어요.
                    </div>
                </div>

                {/* 선택된 문 상세 보기 */}
                {selectedDoorIndex !== null && selectedDoorIndex < quantity && (
                    <div className="w-full rounded-2xl border-2 border-blue-300 bg-blue-50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="text-[16px] font-700 text-blue-800">{selectedDoorIndex + 1}번 문 상세 정보</div>
                            <button
                                onClick={() => setSelectedDoorIndex(null)}
                                className="text-[14px] font-500 text-blue-600 hover:text-blue-800"
                            >
                                닫기
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {/* 선택된 문 크게 보기 */}
                            <div className="flex items-center justify-center rounded-lg bg-white p-6">
                                {/* 겹침 방지: 레이아웃을 분리해서 세로 라벨이 절대 겹치지 않게 처리 */}
                                <div className="flex flex-col items-center gap-2">
                                    {/* 문 그림이 화면 정가운데 오도록 좌/우 동일 폭 스페이서 사용 */}
                                    <div className="grid grid-cols-[60px_auto_60px] items-center gap-3">
                                        <div />
                                        <div
                                            className="relative flex h-[200px] w-[120px] items-center justify-center overflow-hidden rounded-md border-2 border-gray-300 bg-white"
                                            style={
                                                selectedDoorColorImage
                                                    ? {
                                                        backgroundImage: `url(${selectedDoorColorImage})`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center",
                                                    }
                                                    : undefined
                                            }
                                        >
                                            {/* 경첩 방향 표시는 그림 안에만 노출 */}
                                            <div className="absolute inset-x-0 bottom-2 flex items-center justify-center">
                                                <div className="rounded-md bg-white/85 px-2 py-[2px] text-[13px] font-700 text-gray-800">
                                                    {doors[selectedDoorIndex]?.hinge_direction === HingeDirection.LEFT
                                                        ? "좌경"
                                                        : doors[selectedDoorIndex]?.hinge_direction === HingeDirection.RIGHT
                                                            ? "우경"
                                                            : "미설정"}
                                                </div>
                                            </div>
                                        </div>
                                        {/* 세로 길이: 그림 우측에 별도 영역으로 고정 (우측 칼럼) */}
                                        <div className="flex h-[200px] w-[60px] items-center justify-center">
                                            {door_height ? (
                                                <div className="rounded-md bg-white/85 px-2 py-1 text-[12px] font-700 text-gray-800">
                                                    {door_height}mm
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* 가로 길이: 그림 아래 별도 영역 */}
                                    {doors[selectedDoorIndex]?.door_width ? (
                                        <div className="rounded-md bg-white/85 px-2 py-1 text-[12px] font-700 text-gray-800">
                                            {doors[selectedDoorIndex]!.door_width}mm
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            {/* 선택된 문 정보 */}
                            <div className="space-y-2 rounded-lg bg-white p-3">
                                <BoxedInput
                                    type="number"
                                    label={
                                        <>
                                            <span>가로 길이 (mm)</span>
                                            <span className="text-orange-500 ml-1">*</span>
                                        </>
                                    }
                                    placeholder="가로 길이를 입력해주세요"
                                    value={doors[selectedDoorIndex]?.door_width ?? null}
                                    onChange={e => {
                                        const value = e.target.value;
                                        handleDoorWidthChange(selectedDoorIndex, value ? Number(value) : null);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* <div className="flex flex-row gap-2">
                    <ImageButton
                        imageSrc="/img/door-pair/single.svg"
                        imageAlt="단일문"
                        description="한쪽 문만 주문"
                        onClick={() => {
                            updateItem({ is_pair_door: false });
                        }}
                        className="flex-1"
                        imageWidth={160}
                        imageHeight={100}
                    />
                </div> */}

                {door_height !== null && door_height > 0 && (
                    <>
                        {canSelectLastDoorHingeDirection && (
                            <>
                                <div className="w-full text-[14px] font-400 text-gray-600">
                                    마지막 문 경첩 방향
                                </div>
                                <div className="self-stretch inline-flex justify-center items-center gap-5">
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <Button
                                            type={
                                                !isDontKnowHingeDirection && doors[quantity - 1]?.hinge_direction === HingeDirection.LEFT
                                                    ? "BrandInverse"
                                                    : "GrayLarge"
                                            }
                                            text={"좌경첩"}
                                            onClick={() => !isDontKnowHingeDirection && handleLastDoorHingeDirectionChange(HingeDirection.LEFT)}
                                            disabled={isDontKnowHingeDirection}
                                        />
                                        <Button
                                            type={
                                                !isDontKnowHingeDirection && doors[quantity - 1]?.hinge_direction === HingeDirection.RIGHT
                                                    ? "BrandInverse"
                                                    : "GrayLarge"
                                            }
                                            text={"우경첩"}
                                            onClick={() => !isDontKnowHingeDirection && handleLastDoorHingeDirectionChange(HingeDirection.RIGHT)}
                                            disabled={isDontKnowHingeDirection}
                                        />
                                    </div>
                                    <div className="flex justify-start items-center gap-2">
                                        <Checkbox
                                            checked={isDontKnowHingeDirection}
                                            onChange={checked => {
                                                setIsDontKnowHingeDirection(checked);
                                                if (checked) {
                                                    // 모든 문의 경첩 방향을 UNKNOWN으로 설정
                                                    const newDoors = doors.map(door => ({ ...door, hinge_direction: HingeDirection.UNKNOWN }));
                                                    setDoors(newDoors);
                                                    updateItem({ doors: newDoors });
                                                } else {
                                                    // 모든 문의 경첩 방향을 null로 설정
                                                    const newDoors = doors.map(door => ({ ...door, hinge_direction: null }));
                                                    setDoors(newDoors);
                                                    updateItem({ doors: newDoors });
                                                }
                                            }}
                                        />
                                        <div className="text-center justify-start text-gray-700 text-base font-medium font-['Pretendard'] leading-6">
                                            모름
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="w-full text-[14px] font-400 text-gray-600"> 보링(경첩 구멍) 개수</div>
                        <div className="self-stretch inline-flex justify-center items-center gap-5">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                                <Button
                                    type={!isDontKnowHingeCount && boringNum == 2 ? "BrandInverse" : "GrayLarge"}
                                    text={"2개"}
                                    onClick={() => !isDontKnowHingeCount && handleBoringNumChange(2)}
                                    disabled={isDontKnowHingeCount}
                                />
                                <Button
                                    type={!isDontKnowHingeCount && boringNum == 3 ? "BrandInverse" : "GrayLarge"}
                                    text={"3개"}
                                    onClick={() => !isDontKnowHingeCount && handleBoringNumChange(3)}
                                    disabled={isDontKnowHingeCount}
                                />
                                <Button
                                    type={!isDontKnowHingeCount && boringNum == 4 ? "BrandInverse" : "GrayLarge"}
                                    text={"4개"}
                                    onClick={() => !isDontKnowHingeCount && handleBoringNumChange(4)}
                                    disabled={isDontKnowHingeCount}
                                />
                            </div>
                            <div className="flex justify-start items-center gap-2">
                                <Checkbox
                                    checked={isDontKnowHingeCount}
                                    onChange={checked => {
                                        setIsDontKnowHingeCount(checked);
                                        if (checked) {
                                            setHinge([null]);
                                            setBoringNum(null);
                                            updateItem({ hinge: [null], boringNum: null });
                                        } else {
                                            setHinge([]);
                                            setBoringNum(null);
                                            updateItem({ hinge: [], boringNum: null });
                                        }
                                    }}
                                />
                                <div className="text-center justify-start text-gray-700 text-base font-medium font-['Pretendard'] leading-6">
                                    모름
                                </div>
                            </div>
                        </div>
                        {boringError && <div className="px-1 text-sm text-red-500">{boringError}</div>}

                        {!isDontKnowHingeCount &&
                            !isDontKnowHingeDirection &&
                            boringNum !== null &&
                            firstDoorHingeDirection !== null && (
                                <div>
                                    <div className="w-full flex items-center justify-center pt-5">
                                        <NormalDoorPreview
                                            // DoorWidth={firstDoorWidth}
                                            // DoorHeight={door_height}
                                            boringDirection={firstDoorHingeDirection}
                                            boringNum={boringNum}
                                            boringSize={hinge}
                                            onChangeBoringSize={handleBoringSizeChange}
                                            doorColor={item?.color ?? ""}
                                        />
                                    </div>

                                    {hinge.some(h => h === null || h === undefined) && (
                                        <div className="w-full px-5 pt-3 flex flex-col justify-start items-center gap-2.5">
                                            <div className="w-full px-4 py-3 bg-gray-50 rounded-2xl flex justify-center items-center gap-2">
                                                <div className="w-9 h-9 relative bg-blue-100 rounded-xl flex items-center justify-center">
                                                    <ManWhiteIcon />
                                                </div>
                                                <div className="flex-1 inline-flex flex-col justify-start items-start">
                                                    <div className="self-stretch justify-start text-gray-700 text-base font-medium font-['Pretendard'] leading-5">
                                                        경첩 치수 모르면 입력하지 않아도 돼요
                                                    </div>
                                                    <div className="self-stretch justify-start text-blue-500 text-sm font-normal font-['Pretendard'] leading-5">
                                                        주문이 접수되면 상담으로 안내해드려요.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        {isDontKnowHingeCount && !isDontKnowHingeDirection && (
                            <div className="w-full px-5 pt-3 flex flex-col justify-start items-center gap-2.5">
                                <div className="w-full px-4 py-3 bg-gray-50 rounded-2xl flex justify-center items-center gap-2">
                                    <div className="w-9 h-9 relative bg-blue-100 rounded-xl flex items-center justify-center">
                                        <ManWhiteIcon />
                                    </div>
                                    <div className="flex-1 inline-flex flex-col justify-start items-start">
                                        <div className="self-stretch justify-start text-gray-700 text-base font-medium font-['Pretendard'] leading-5">
                                            보링 개수 몰라도 괜찮아요
                                        </div>
                                        <div className="self-stretch justify-start text-blue-500 text-sm font-normal font-['Pretendard'] leading-5">
                                            주문이 접수되면 상담으로 안내해드려요.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 검증용: itemStore 정보 표시 */}
            {/* <div className="mt-8 mb-4 rounded-2xl border-2 border-blue-300 bg-blue-50 p-4">
                <div className="mb-3 text-[16px] font-700 text-blue-800">🔍 ItemStore 검증 정보</div>

                <div className="mb-4 space-y-2">
                    <div className="text-[14px] font-600 text-gray-800">공통 속성</div>
                    <div className="rounded-lg bg-white p-3 text-[12px] font-400 text-gray-700">
                        <div>색상: {item?.color || item?.door_color_direct_input || "미입력"}</div>
                        <div>용도/장소: {door_location || "미입력"}</div>
                        <div>손잡이 종류: {handleType || "미입력"}</div>
                        <div>세로 길이: {door_height ? `${door_height}mm` : "미입력"}</div>
                        <div>보링 개수: {boringNum ? `${boringNum}개` : "미입력"}</div>
                        <div>보링 치수: {hinge.length > 0 ? `[${hinge.map(h => h ?? "null").join(", ")}]` : "미입력"}</div>
                        <div>문짝 수량: {quantity}개</div>
                    </div>
                </div>

                <div className="mb-4 space-y-2">
                    <div className="text-[14px] font-600 text-gray-800">개별 문 정보 (doors 배열)</div>
                    <div className="space-y-2">
                        {doors.map((door, idx) => (
                            <div key={idx} className="rounded-lg bg-white p-3 text-[12px] font-400 text-gray-700">
                                <div className="mb-1 font-600 text-gray-800">문 {idx + 1}</div>
                                <div>가로 길이: {door.door_width ? `${door.door_width}mm` : "미입력"}</div>
                                <div>경첩 방향: {
                                    door.hinge_direction === HingeDirection.LEFT ? "좌경첩" :
                                        door.hinge_direction === HingeDirection.RIGHT ? "우경첩" :
                                            door.hinge_direction === HingeDirection.UNKNOWN ? "모름" :
                                                "미입력"
                                }</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-[14px] font-600 text-gray-800">전체 ItemStore JSON</div>
                    <div className="max-h-[300px] overflow-auto rounded-lg bg-white p-3">
                        <pre className="text-[10px] font-400 text-gray-700 whitespace-pre-wrap break-words">
                            {JSON.stringify(item, null, 2)}
                        </pre>
                    </div>
                </div>
            </div> */}

            <div className="h-[100px]"></div>

            {!isDoorLocationSheetOpen && (
                <div id="door-next-button">
                    <BottomButton
                        type={"1button"}
                        button1Text={"다음"}
                        className="fixed bottom-0 w-full max-w-[460px]"
                        button1Disabled={
                            isFormValid() ||
                            !door_location ||
                            !handleType ||
                            doors.some(door => !door.door_width || door.hinge_direction === null || door.hinge_direction === HingeDirection.UNKNOWN)
                        }
                        onButton1Click={() => {
                            trackClick({
                                object_type: "button",
                                object_name: "confirm",
                                current_page: getScreenName(),
                                modal_name: null,
                            });
                            router.push("/longdoor/additional");
                        }}
                    />
                </div>
            )}
        </div>
    );
}

function LongDoorPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <LongDoorPageContent />
        </Suspense>
    );
}

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
                        <div className="pb-5" />
                    </div>
                </div>
            }
            onClose={onClose}
        />
    );
}

export default LongDoorPage;


