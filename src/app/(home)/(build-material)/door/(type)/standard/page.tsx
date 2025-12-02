"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import BoxedInput from "@/components/Input/BoxedInput";
import ImageUploadInput from "@/components/Input/ImageUploadInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import NormalDoorPreview from "@/components/DoorPreview/NormalDoorPreview";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import Checkbox from "@/components/Checkbox";
import ManWhiteIcon from "@/../public/icons/man_white";

import formatLocation from "@/utils/formatLocation";
import formatColor from "@/utils/formatColor";

import useItemStore from "@/store/itemStore";

// Hooks
import { useDoorValidation } from "./hooks/useDoorValidation";
import { HingeDirection } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { Location } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function StandardDoorPageContent() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    // 가로 입력 필드 ref
    const widthInputRef = useRef<HTMLInputElement>(null);

    // 초기값을 itemStore에서 읽어오기 (기본값 없음)
    const [boringNum, setBoringNum] = useState<2 | 3 | 4 | null>(item?.boringNum ?? null);
    const [hinge_direction, setHingeDirection] = useState<HingeDirection | null>(
        (item?.hinge_direction as HingeDirection) ?? null,
    );

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('door_standard');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    // 기본값 설정 제거 - 사용자가 명시적으로 선택해야 함
    const [door_width, setDoorWidth] = useState<number | null>(item?.door_width ?? null);
    const [door_height, setDoorHeight] = useState<number | null>(item?.door_height ?? null);

    // boringSize 초기값 설정
    const [hinge, setHinge] = useState<(number | null)[]>(item?.hinge ?? []);

    const [door_location, setDoorLocation] = useState(item?.door_location ?? "");
    const [isDoorLocationSheetOpen, setIsDoorLocationSheetOpen] = useState(false);
    
    // 체크박스 초기 상태: 명시적으로 UNKNOWN이거나 [null]인 경우만 모름 체크
    const [isDontKnowHingeCount, setIsDontKnowHingeCount] = useState(() => {
        // hinge 배열이 정확히 [null]인 경우만 모름 상태
        return item?.hinge && item.hinge.length === 1 && item.hinge[0] === null;
    });
    const [isDontKnowHingeDirection, setIsDontKnowHingeDirection] = useState(() => {
        // hinge_direction이 명시적으로 UNKNOWN인 경우만 모름 상태
        return item?.hinge_direction === HingeDirection.UNKNOWN;
    });

    // 페이지 진입 시 용도 및 장소 시트 자동 열기 (door_location이 없을 때만)
    useEffect(() => {
        if (!door_location) {
            setIsDoorLocationSheetOpen(true);
        }
    }, []);

    // boringNum이 변경되면 hinge 배열 길이 맞추기
    useEffect(() => {
        if (boringNum !== null && hinge.length !== boringNum) {
            const newBoringSize = Array.from({ length: boringNum }, (_, i) =>
                hinge && hinge[i] !== undefined ? hinge[i] : null,
            );
            setHinge(newBoringSize);
        }
    }, [boringNum]);

    // 유효성 검사 훅 사용
    const { widthError, heightError, boringError, isFormValid } = useDoorValidation({
        DoorWidth: door_width,
        DoorHeight: door_height,
        hinge,
        boringNum,
        hingeDirection: hinge_direction,
    });

    // boringNum이 바뀔 때 boringSize 길이 자동 조정
    useEffect(() => {
        if (boringNum !== null) {
            // 기존 값을 유지하면서 새로운 길이에 맞게 조정
            const newBoringSize = Array.from({ length: boringNum }, (_, i) =>
                hinge && hinge[i] !== undefined ? hinge[i] : null,
            );
            setHinge(newBoringSize);
        }
    }, [boringNum]);


    // 각 필드 변경 시 useItemStore에 저장
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
        
        // 용도 및 장소 선택 후 시트가 닫히면 가로 입력 필드로 포커스 이동
        setIsDoorLocationSheetOpen(false);
        setTimeout(() => {
            widthInputRef.current?.focus();
        }, 300); // 시트 닫히는 애니메이션 후 포커스 이동
    };

    return (
        <div className="flex min-h-screen flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={60} />
            <Header
                title={
                    "일반문 정보를 입력해주세요"
                }
            />
            <div className="flex flex-1 flex-col gap-5 px-5">
                <BoxedSelect
                    label={<><span>색상</span><span className="text-orange-500 ml-1">*</span></>}
                    options={[]}
                    value={formatColor(item?.color ?? "") || item?.door_color_direct_input || ""}
                    onClick={() => router.push("/door/color")}
                    onChange={() => { }}
                    truncate={true}
                />

                <BoxedSelect
                    default_label="용도 ∙ 장소"
                    label={<><span>용도 ∙ 장소</span><span className="text-orange-500 ml-1">*</span></>}
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

                {/* 표준문 폼 내용 */}
                <BoxedInput
                    ref={widthInputRef}
                    type="number"
                    label={<><span>가로 길이 (mm)</span><span className="text-orange-500 ml-1">*</span></>}
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
                        color: "text-emerald-500"
                    }}
                />
                <BoxedInput
                    type="number"
                    label={<><span>세로 길이 (mm)</span><span className="text-orange-500 ml-1">*</span></>}
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
                        color: "text-emerald-500"
                    }}
                />

                {/* 세로 길이가 입력된 경우에만 경첩 관련 컴포넌트 표시 */}
                {door_height !== null && door_height > 0 && (

                    <>
                        <div className="w-full text-[14px] font-400 text-gray-600"> 보링(경첩 구멍) 개수</div>
                        <div className="self-stretch inline-flex justify-center items-center gap-5">
                            <div className="flex-1 flex justify-center items-center gap-2">
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
                                    onChange={(checked) => {
                                        setIsDontKnowHingeCount(checked);
                                        if (checked) {
                                            // 모름 체크: hinge를 [null]로 설정
                                            setHinge([null]);
                                            setBoringNum(null);
                                            updateItem({ hinge: [null], boringNum: null });
                                        } else {
                                            // 모름 해제: 선택 초기화 (사용자가 직접 선택해야 함)
                                            setHinge([]);
                                            setBoringNum(null);
                                            updateItem({ hinge: [], boringNum: null });
                                        }
                                    }}
                                />
                                <div className="text-center justify-start text-gray-700 text-base font-medium font-['Pretendard'] leading-6">모름</div>
                            </div>
                        </div>

                        <div className="w-full text-[14px] font-400 text-gray-600"> 경첩 방향</div>
                        <div className="self-stretch inline-flex justify-center items-center gap-5">
                            <div className="flex-1 flex justify-center items-center gap-2">
                                <Button
                                    type={!isDontKnowHingeDirection && hinge_direction === HingeDirection.LEFT ? "BrandInverse" : "GrayLarge"}
                                    text={"좌경첩"}
                                    onClick={() => !isDontKnowHingeDirection && handleBoringDirectionChange(HingeDirection.LEFT)}
                                    disabled={isDontKnowHingeDirection}
                                />
                                <Button
                                    type={!isDontKnowHingeDirection && hinge_direction === HingeDirection.RIGHT ? "BrandInverse" : "GrayLarge"}
                                    text={"우경첩"}
                                    onClick={() => !isDontKnowHingeDirection && handleBoringDirectionChange(HingeDirection.RIGHT)}
                                    disabled={isDontKnowHingeDirection}
                                />
                            </div>
                            <div className="flex justify-start items-center gap-2">
                                <Checkbox 
                                    checked={isDontKnowHingeDirection} 
                                    onChange={(checked) => {
                                        setIsDontKnowHingeDirection(checked);
                                        if (checked) {
                                            // 모름 체크: UNKNOWN으로 설정
                                            handleBoringDirectionChange(HingeDirection.UNKNOWN);
                                        } else {
                                            // 모름 해제: 선택 초기화 (사용자가 직접 선택해야 함)
                                            handleBoringDirectionChange(null);
                                        }
                                    }}
                                />
                                <div className="text-center justify-start text-gray-700 text-base font-medium font-['Pretendard'] leading-6">모름</div>
                            </div>

                        </div>
                        {boringError && <div className="px-1 text-sm text-red-500">{boringError}</div>}

                        {/* 분기 1: 경첩 개수도 알고 방향도 아는 경우 (기본 케이스) */}
                        {!isDontKnowHingeCount && !isDontKnowHingeDirection && boringNum !== null && hinge_direction !== null && (
                            <div>
                                <div className="w-full flex items-center justify-center px-5 pt-5">
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

                                <div className="w-full px-5 pt-3 flex flex-col justify-start items-center gap-2.5">
                                    <div className="w-full px-4 py-3 bg-gray-50 rounded-2xl flex justify-center items-center gap-2">
                                        <div className="w-9 h-9 relative bg-blue-100 rounded-xl flex items-center justify-center">
                                            <ManWhiteIcon />
                                        </div>
                                        <div className="flex-1 inline-flex flex-col justify-start items-start">
                                            <div className="self-stretch justify-start text-gray-700 text-base font-medium font-['Pretendard'] leading-5">경첩 치수 모르면 입력하지 않아도 돼요</div>
                                            <div className="self-stretch justify-start text-blue-500 text-sm font-normal font-['Pretendard'] leading-5">주문이 접수되면 상담으로 안내해드려요.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            

                        )}

                        {/* 분기 2: 경첩 개수만 모르는 경우 */}
                        {isDontKnowHingeCount && !isDontKnowHingeDirection && (
                            <div className="w-full px-5 pt-3 flex flex-col justify-start items-center gap-2.5">
                                <div className="w-full px-4 py-3 bg-gray-50 rounded-2xl flex justify-center items-center gap-2">
                                    <div className="w-9 h-9 relative bg-blue-100 rounded-xl flex items-center justify-center">
                                        <ManWhiteIcon />
                                    </div>
                                    <div className="flex-1 inline-flex flex-col justify-start items-start">
                                        <div className="self-stretch justify-start text-gray-700 text-base font-medium font-['Pretendard'] leading-5">보링 개수 몰라도 괜찮아요</div>
                                        <div className="self-stretch justify-start text-blue-500 text-sm font-normal font-['Pretendard'] leading-5">주문이 접수되면 상담으로 안내해드려요.</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 분기 3: 경첩 방향만 모르는 경우 */}
                        {!isDontKnowHingeCount && isDontKnowHingeDirection && (
                            <div className="w-full px-5 pt-3 flex flex-col justify-start items-center gap-2.5">
                                <div className="w-full px-4 py-3 bg-gray-50 rounded-2xl flex justify-center items-center gap-2">
                                    <div className="w-9 h-9 relative bg-blue-100 rounded-xl flex items-center justify-center">
                                        <ManWhiteIcon />
                                    </div>
                                    <div className="flex-1 inline-flex flex-col justify-start items-start">
                                        <div className="self-stretch justify-start text-gray-700 text-base font-medium font-['Pretendard'] leading-5">경첩 방향 몰라도 괜찮아요</div>
                                        <div className="self-stretch justify-start text-blue-500 text-sm font-normal font-['Pretendard'] leading-5">주문이 접수되면 상담으로 안내해드려요.</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 분기 4: 경첩 개수도 방향도 모르는 경우 */}
                        {isDontKnowHingeCount && isDontKnowHingeDirection && (
                            <div className="w-full px-5 pt-3 flex flex-col justify-start items-center gap-2.5">
                                <div className="w-full px-4 py-3 bg-gray-50 rounded-2xl flex justify-center items-center gap-2">
                                    <div className="w-9 h-9 relative bg-blue-100 rounded-xl flex items-center justify-center">
                                        <ManWhiteIcon />
                                    </div>
                                    <div className="flex-1 inline-flex flex-col justify-start items-start">
                                        <div className="self-stretch justify-start text-gray-700 text-base font-medium font-['Pretendard'] leading-5">경첩 방향, 보링 개수 몰라도 괜찮아요</div>
                                        <div className="self-stretch justify-start text-blue-500 text-sm font-normal font-['Pretendard'] leading-5">주문이 접수되면 상담으로 안내해드려요.</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        
                    </>
                )}
            </div>
            <div className="h-[100px]"></div>
            {!isDoorLocationSheetOpen &&
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
                            router.push("/door/standard/additional");
                        }}
                    />
                </div>
            }
        </div>
    );
}

function StandardDoorPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <StandardDoorPageContent />
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

export default StandardDoorPage;
