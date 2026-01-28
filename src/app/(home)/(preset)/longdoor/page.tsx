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

import { useDoorValidation } from "./hooks/useDoorValidation";
import { HingeDirection, Location, CabinetHandleType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

function LongDoorPageContent() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    const widthInputRef = useRef<HTMLInputElement>(null);

    // 문짝 수량(기본 1)
    const [quantity, setQuantity] = useState<number>(item?.quantity ?? 1);

    const [boringNum, setBoringNum] = useState<2 | 3 | 4 | null>(item?.boringNum ?? null);
    const [hinge_direction, setHingeDirection] = useState<HingeDirection | null>(
        (item?.hinge_direction as HingeDirection) ?? null,
    );

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

    // 수량 변경 시 store에 저장
    useEffect(() => {
        // 1~10 범위 고정
        const clamped = Math.min(10, Math.max(1, quantity));
        if (clamped !== quantity) {
            setQuantity(clamped);
            return;
        }
        updateItem({ quantity: clamped });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quantity]);

    const [door_width, setDoorWidth] = useState<number | null>(item?.door_width ?? null);
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

    const { widthError, heightError, boringError, isFormValid } = useDoorValidation({
        DoorWidth: door_width,
        DoorHeight: door_height,
        hinge,
        boringNum,
        hingeDirection: hinge_direction,
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

    const handleBoringDirectionChange = (newBoringDirection: HingeDirection | null) => {
        setHingeDirection(newBoringDirection);
        updateItem({ hinge_direction: newBoringDirection });
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
        setHinge(newBoringSize);
        updateItem({ hinge: newBoringSize });
    };

    const handleDoorLocationChange = (newLocation: string) => {
        setDoorLocation(newLocation);
        updateItem({ door_location: newLocation });

        setIsDoorLocationSheetOpen(false);
        setTimeout(() => {
            widthInputRef.current?.focus();
        }, 300);
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

                {/* 문짝 미리보기(따닥따닥 고정 10칸) */}
                <div className="w-full">
                    <div className="mb-2 text-[14px] font-400 text-gray-600">문짝 미리보기</div>
                    <div className="grid w-full grid-cols-10 gap-0 overflow-hidden border border-gray-300 bg-white">
                        {Array.from({ length: 10 }).map((_, idx) => {
                            const isActive = idx < quantity;
                            // 미리보기용 표시 규칙:
                            // - 좌/우 번갈아(좌,우,좌,우...)
                            // - 홀수인 경우 마지막 1개는 라벨 표시 안 함
                            const isLastWhenOdd = quantity % 2 === 1 && idx === quantity - 1;
                            const hingeLabel = isActive && !isLastWhenOdd ? (idx % 2 === 0 ? "좌" : "우") : null;
                            return (
                                <div
                                    key={idx}
                                    className={`flex h-[56px] items-stretch justify-center border-r border-gray-300 last:border-r-0 ${isActive ? "bg-white" : "bg-gray-50"
                                        }`}
                                >
                                    <div
                                        className={`relative h-full w-full ${isActive ? "bg-white outline outline-1 outline-gray-300 -outline-offset-1" : "bg-gray-100"
                                            }`}
                                    >
                                        {hingeLabel && (
                                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-[2px] text-[11px] font-600 text-gray-700">
                                                {hingeLabel}경
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-[12px]/[16px] font-400 text-gray-500">
                        최소 1개 ~ 최대 10개까지 선택할 수 있어요.
                    </div>
                </div>

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

                <BoxedInput
                    ref={widthInputRef}
                    type="number"
                    label={
                        <>
                            <span>가로 길이 (mm)</span>
                            <span className="text-orange-500 ml-1">*</span>
                        </>
                    }
                    placeholder="가로 길이를 입력해주세요"
                    value={door_width}
                    onChange={e => {
                        const value = e.target.value;
                        handleDoorWidthChange(value ? Number(value) : null);
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

                {door_height !== null && door_height > 0 && (
                    <>
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

                        <div className="w-full text-[14px] font-400 text-gray-600">마지막 문 경첩 방향</div>
                        <div className="self-stretch inline-flex justify-center items-center gap-5">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                <Button
                                    type={
                                        !isDontKnowHingeDirection && hinge_direction === HingeDirection.LEFT
                                            ? "BrandInverse"
                                            : "GrayLarge"
                                    }
                                    text={"좌경첩"}
                                    onClick={() => !isDontKnowHingeDirection && handleBoringDirectionChange(HingeDirection.LEFT)}
                                    disabled={isDontKnowHingeDirection}
                                />
                                <Button
                                    type={
                                        !isDontKnowHingeDirection && hinge_direction === HingeDirection.RIGHT
                                            ? "BrandInverse"
                                            : "GrayLarge"
                                    }
                                    text={"우경첩"}
                                    onClick={() => !isDontKnowHingeDirection && handleBoringDirectionChange(HingeDirection.RIGHT)}
                                    disabled={isDontKnowHingeDirection}
                                />
                            </div>
                            <div className="flex justify-start items-center gap-2">
                                <Checkbox
                                    checked={isDontKnowHingeDirection}
                                    onChange={checked => {
                                        setIsDontKnowHingeDirection(checked);
                                        if (checked) {
                                            handleBoringDirectionChange(HingeDirection.UNKNOWN);
                                        } else {
                                            handleBoringDirectionChange(null);
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
                            hinge_direction !== null && (
                                <div>
                                    <div className="w-full flex items-center justify-center pt-5">
                                        <NormalDoorPreview
                                            DoorWidth={door_width}
                                            DoorHeight={door_height}
                                            boringDirection={hinge_direction}
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

            <div className="h-[100px]"></div>

            {!isDoorLocationSheetOpen && (
                <div id="door-next-button">
                    <BottomButton
                        type={"1button"}
                        button1Text={"다음"}
                        className="fixed bottom-0 w-full max-w-[460px]"
                        button1Disabled={isFormValid() || !door_location}
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


