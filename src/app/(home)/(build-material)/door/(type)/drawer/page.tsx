"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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

import formatLocation from "@/utils/formatLocation";
import formatColor from "@/utils/formatColor";

import useItemStore from "@/store/itemStore";
import { Location } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useDrawerDoorValidation } from "./hooks/useDrawerDoorValidation";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function DrawerDoorPageContent() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    // 초기값을 itemStore에서 읽어오기
    const [doorWidth, setDoorWidth] = useState<number | null>(item?.door_width ?? null);
    const [doorHeight, setDoorHeight] = useState<number | null>(item?.door_height ?? null);

    const [request, setRequest] = useState(item?.door_request ?? "");
    const [door_location, setDoorLocation] = useState(item?.door_location ?? "");
    const [isDoorLocationSheetOpen, setIsDoorLocationSheetOpen] = useState(false);
    const [images, setImages] = useState<File[]>(item?.raw_images || []);

    // 유효성 검사 훅 사용
    const { widthError, heightError, isFormValid } = useDrawerDoorValidation({
        DoorWidth: doorWidth,
        DoorHeight: doorHeight,
    });

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('door_drawer');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    // 각 필드 변경 시 useItemStore에 저장
    const handleDoorWidthChange = (newWidth: number | null) => {
        setDoorWidth(newWidth);
        updateItem({ door_width: newWidth });
    };

    const handleDoorHeightChange = (newHeight: number | null) => {
        setDoorHeight(newHeight);
        updateItem({ door_height: newHeight });
    };

    const handleRequestChange = (newRequest: string) => {
        setRequest(newRequest);
        updateItem({ door_request: newRequest });
    };

    const handleDoorLocationChange = (newLocation: string) => {
        setDoorLocation(newLocation);
        updateItem({ door_location: newLocation });
    };

    const handleImagesChange = (newImages: File[]) => {
        setImages(newImages);
        updateItem({ raw_images: newImages });
        console.log('이미지 업로드됨:', newImages.length, '개');
    };

    return (
        <div className="flex min-h-screen flex-col">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={80} />
            <Header
                title={
                    "서랍 마에다 정보를 입력해주세요"
                }
            />
            <div className="flex flex-1 flex-col gap-5 px-5">
                <BoxedSelect
                    label={<><span>색상</span><span className="text-orange-500 ml-1">*</span></>}
                    options={[]}
                    value={formatColor(item?.color ?? "") || item?.door_color_direct_input || ""}
                    onClick={() => router.back()}
                    onChange={() => { }}
                    truncate={true}
                />

                {/* 서랍 폼 내용 */}
                <BoxedInput
                    type="number"
                    label={<><span>가로 길이(mm)</span><span className="text-orange-500 ml-1">*</span></>}
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
                    label={<><span>세로 길이(mm)</span><span className="text-orange-500 ml-1">*</span></>}
                    placeholder="세로 길이를 입력해주세요"
                    value={doorHeight}
                    onChange={e => {
                        const value = e.target.value;
                        handleDoorHeightChange(value ? Number(value) : null);
                    }}
                    error={!!heightError}
                    helperText={heightError}
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
                <BoxedInput
                    label="제작 시 요청사항"
                    placeholder="제작 시 요청사항 | 예) 시공도 필요해요, …"
                    value={request}
                    onChange={e => handleRequestChange(e.target.value)}
                />
                <ImageUploadInput
                    label="이미지 첨부"
                    placeholder="이미지를 첨부해주세요"
                    value={images}
                    onChange={handleImagesChange}
                />
            </div>
            <div className="h-[100px]"></div>
            {!isDoorLocationSheetOpen &&
                <div id="drawer-door-next-button">
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
                            router.push("/door/report");
                        }}
                    />
                </div>
            }
        </div>
    );
}

function DrawerDoorPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <DrawerDoorPageContent />
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

export default DrawerDoorPage;
