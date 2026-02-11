"use client";

import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { CABINET_COLOR_LIST } from "@/constants/colorList";
import { ABSORBER_TYPE_LIST } from "@/constants/absorbertype";
import { useCabinetValidation } from "./hooks/useCabinetValidation";


import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import { CabinetHandleType, CabinetBehindType, Location, CabinetLegType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import ImageUploadInput from "@/components/Input/ImageUploadInput";


import useItemStore from "@/store/itemStore";
import formatLocation from "@/utils/formatLocation";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import GrayVerticalLine from "@/components/GrayVerticalLine/GrayVerticalLine";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import formatColor from "@/utils/formatColor";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function FlapCabinetPageContent() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    // 상태 관리 (itemStore 기반)
    const [DoorWidth, setDoorWidth] = useState<number | null>(item?.width ?? null);
    const [DoorHeight, setDoorHeight] = useState<number | null>(item?.height ?? null);
    const [DoorDepth, setDoorDepth] = useState<number | null>(item?.depth ?? null);
    const [color, setColor] = useState(item?.color ?? "");
    const [isColorSheetOpen, setIsColorSheetOpen] = useState(false);
    // bodyMaterial을 id(number) 또는 직접입력 string으로 관리
    const [bodyMaterial, setBodyMaterial] = useState<number | null>(typeof item?.bodyMaterial === "number" ? item.bodyMaterial : null);
    const [bodyMaterialDirectInput, setBodyMaterialDirectInput] = useState(item?.body_material_direct_input ?? "");
    // robust: enum 기반 상태 관리
    const [handleType, setHandleType] = useState<CabinetHandleType | "">(
        item && Object.values(CabinetHandleType).includes(item.handleType) ? item.handleType : ""
    );
    // CabinetBehindType의 첫 번째 값(우라홈) 사용
    const cabinetBehindTypeDefault = Object.values(CabinetBehindType)[1];
    const [behindType, setBehindType] = useState<CabinetBehindType | "">(
        item && Object.values(CabinetBehindType).includes(item.behindType) ? item.behindType : cabinetBehindTypeDefault
    );
    const [request, setRequest] = useState(item?.request ?? "");
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [images, setImages] = useState<File[]>(item?.raw_images || []);
    // 추가 필드: 용도/장소, 시공 필요 여부, 다리발
    const [cabinetLocation, setCabinetLocation] = useState(item?.cabinet_location ?? null);
    const [isCabinetLocationSheetOpen, setIsCabinetLocationSheetOpen] = useState(false);
    const [cabinet_construct, setCabinetConstruct] = useState(item?.cabinet_construct ?? false);
    // 다리발: enum + 직접입력
    // const [legType, setLegType] = useState<CabinetLegType | null>(
    //     item && Object.values(CabinetLegType).includes(item.legType) ? item.legType : null
    // );
    // const [legTypeDirectInput, setLegTypeDirectInput] = useState<string>(item?.legType_direct_input ?? null);
    // const [isLegTypeSheetOpen, setIsLegTypeSheetOpen] = useState(false);


    // 쇼바 종류 관련 상태
    const [absorber_type, setAbsorber_type] = useState<number | null>(null);
    const [absorber_type_direct_input, setAbsorber_type_direct_input] = useState("");
    const [isAbsorberSheetOpen, setIsAbsorberSheetOpen] = useState(false);
    const selectedAbsorber = absorber_type !== null ? ABSORBER_TYPE_LIST.find(opt => opt.id === absorber_type) : null;

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('cabinet_flap');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    // 값 변경 시 itemStore에 동기화
    useEffect(() => { updateItem({ width: DoorWidth }); }, [DoorWidth]);
    useEffect(() => { updateItem({ height: DoorHeight }); }, [DoorHeight]);
    useEffect(() => { updateItem({ depth: DoorDepth }); }, [DoorDepth]);
    useEffect(() => { updateItem({ color }); }, [color]);
    useEffect(() => { updateItem({ bodyMaterial }); }, [bodyMaterial]);
    useEffect(() => { updateItem({ body_material_direct_input: bodyMaterialDirectInput }); }, [bodyMaterialDirectInput]);
    useEffect(() => { updateItem({ handleType }); }, [handleType]);
    useEffect(() => { updateItem({ behindType }); }, [behindType]);
    useEffect(() => { updateItem({ request }); }, [request]);
    useEffect(() => { updateItem({ cabinet_location: cabinetLocation }); }, [cabinetLocation]);
    useEffect(() => { updateItem({ cabinet_construct }); }, [cabinet_construct]);
    // useEffect(() => { updateItem({ legType }); }, [legType]);
    // useEffect(() => { updateItem({ legType_direct_input: legTypeDirectInput }); }, [legTypeDirectInput]);
    useEffect(() => { updateItem({ absorber_type }); }, [absorber_type]);
    useEffect(() => { updateItem({ absorber_type_direct_input }); }, [absorber_type_direct_input]);

    // validation
    const { widthError, heightError, depthError, isFormValid } = useCabinetValidation({
        DoorWidth,
        DoorHeight,
        DoorDepth,
    });
    // 버튼 활성화 조건 (order/cabinet upper와 동일)
    const button1Disabled =
        isFormValid() ||
        (bodyMaterial === null && !bodyMaterialDirectInput) ||
        (absorber_type === null && !absorber_type_direct_input) ||
        !handleType ||
        !behindType ||
        !cabinetLocation ||
        (cabinet_construct === null);

    // BODY_MATERIAL_LIST에서 선택된 소재명 또는 직접입력값 표시
    const selectedMaterial = bodyMaterial !== null ? BODY_MATERIAL_LIST.find(option => option.id === bodyMaterial) : null;
    const bodyMaterialLabel = bodyMaterial !== null
        ? (selectedMaterial ? selectedMaterial.name : "")
        : (bodyMaterialDirectInput || "");

    const locationEnumValues = Object.values(Location);
    const cabinetLocationLabel = cabinetLocation && locationEnumValues.includes(cabinetLocation)
        ? formatLocation(cabinetLocation)
        : "";

    // 색상 옵션 변환
    const colorOptions = CABINET_COLOR_LIST.map(opt => ({ value: opt.name, label: formatColor(opt.name) }));

    return (
        <div className="flex flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={80} />
            <Header title="플랩장 정보를 입력해주세요" />
            <div className="h-5" />
            <div className="flex flex-col gap-5 px-5">
                {/* 도어 색상 */}
                <BoxedSelect
                    default_label="도어 색상"
                    label={<><span>도어 색상</span><span className="text-orange-500 ml-1">*</span></>}
                    options={colorOptions}
                    value={formatColor(item?.color ?? "") || item?.cabinet_color_direct_input || ""}
                    onClick={() => router.push("/cabinet/color")}
                    onChange={() => { }}
                />
                {/* 몸통 소재 및 두께 (BoxedSelect 1개만, 바텀시트만 사용) */}
                <BoxedSelect
                    default_label="몸통 소재 및 두께"
                    label={<><span>몸통 소재 및 두께</span><span className="text-orange-500 ml-1">*</span></>}
                    value={bodyMaterialLabel}
                    onClick={() => setIsBottomSheetOpen(true)}
                />
                <BodyMaterialManualInputSheet
                    isOpen={isBottomSheetOpen}
                    onClose={() => setIsBottomSheetOpen(false)}
                    value={bodyMaterial}
                    directInput={bodyMaterialDirectInput}
                    onChange={(val) => {
                        if (typeof val === "number") {
                            setBodyMaterial(val);
                            setBodyMaterialDirectInput("");
                        } else {
                            setBodyMaterial(null);
                            setBodyMaterialDirectInput(val);
                        }
                    }}
                />
                {/* 너비 */}
                <BoxedInput
                    type="number"
                    label={<><span>너비(mm)</span><span className="text-orange-500 ml-1">*</span></>}
                    placeholder="너비를 입력해주세요"
                    value={DoorWidth ?? ""}
                    onChange={e => {
                        const value = e.target.value;
                        setDoorWidth(value ? Number(value) : null);
                    }}
                    error={!!widthError}
                    helperText={widthError}
                />
                {/* 높이 */}
                <BoxedInput
                    type="number"
                    label={<><span>높이(mm)</span><span className="text-orange-500 ml-1">*</span></>}
                    placeholder="높이를 입력해주세요"
                    value={DoorHeight ?? ""}
                    onChange={e => {
                        const value = e.target.value;
                        setDoorHeight(value ? Number(value) : null);
                    }}
                    error={!!heightError}
                    helperText={heightError}
                />
                {/* 깊이 */}
                <BoxedInput
                    type="number"
                    label={<><span>깊이(mm)</span><span className="text-orange-500 ml-1">*</span></>}
                    placeholder="깊이를 입력해주세요"
                    value={DoorDepth ?? ""}
                    onChange={e => {
                        const value = e.target.value;
                        setDoorDepth(value ? Number(value) : null);
                    }}
                    error={!!depthError}
                    helperText={depthError}
                />
                {/* 쇼바 종류 (absorber_type) */}
                <BoxedSelect
                    default_label="쇼바 종류"
                    label={<><span>쇼바 종류</span><span className="text-orange-500 ml-1">*</span></>}
                    options={ABSORBER_TYPE_LIST.filter(opt => opt.name !== "직접입력").map(opt => ({ value: String(opt.id), label: opt.name }))}
                    value={absorber_type !== null ? (selectedAbsorber ? selectedAbsorber.name : "") : absorber_type_direct_input}
                    onClick={() => setIsAbsorberSheetOpen(true)}
                    onChange={() => { }}
                />
                <BottomSheet
                    isOpen={isAbsorberSheetOpen}
                    title="쇼바 종류를 선택해주세요"
                    contentPadding="px-1"
                    onClose={() => setIsAbsorberSheetOpen(false)}
                    children={
                        <div>
                            {ABSORBER_TYPE_LIST.filter(opt => opt.name !== "직접입력").map(option => (
                                <SelectToggleButton
                                    key={option.id}
                                    label={option.name}
                                    checked={absorber_type === option.id}
                                    onClick={() => {
                                        setAbsorber_type(option.id);
                                        setAbsorber_type_direct_input("");
                                        setIsAbsorberSheetOpen(false);
                                    }}
                                />
                            ))}
                            <SelectToggleButton
                                label="직접 입력"
                                checked={absorber_type === null}
                                onClick={() => {
                                    setAbsorber_type(null);
                                    setAbsorber_type_direct_input("");
                                    setTimeout(() => {
                                        const el = document.getElementById("absorber-type-direct-input");
                                        if (el) (el as HTMLInputElement).focus();
                                    }, 0);
                                }}
                            />
                            {absorber_type === null && (
                                <div className="flex items-center gap-2 px-4 pb-3">
                                    <GrayVerticalLine />
                                    <BoxedInput
                                        type="text"
                                        placeholder="쇼바 종류를 입력해주세요"
                                        className="w-full"
                                        value={absorber_type_direct_input}
                                        onChange={e => setAbsorber_type_direct_input(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    }
                    buttonArea={
                        <div className="p-5">
                            <Button type="Brand" text="다음" onClick={() => setIsAbsorberSheetOpen(false)} />
                        </div>
                    }
                />
                {/* 손잡이 robust (enum) */}
                <div className="flex flex-col gap-2">
                    <div className="text-[14px]/[20px] font-400 text-gray-600">
                        손잡이 종류
                        <span className="text-orange-500 ml-1">*</span>
                    </div>
                    <div className="flex w-full gap-2">
                        {Object.values(CabinetHandleType)
                            .filter(opt => opt == CabinetHandleType.OUTER || opt == CabinetHandleType.PULL_DOWN || opt == CabinetHandleType.PUSH)
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
                {/* 뒷판 robust (enum) */}
                <div className="flex flex-col gap-2">
                    <div className="text-[14px]/[20px] font-400 text-gray-600">
                        마감 방식
                        <span className="text-orange-500 ml-1">*</span>
                    </div>
                    <div className="flex w-full gap-2">
                        {Object.values(CabinetBehindType).reverse().map(opt => (
                            <Button
                                key={opt}
                                type={behindType === opt ? "BrandInverse" : "GrayLarge"}
                                text={opt === cabinetBehindTypeDefault ? "일반 (우라홈)" : opt}
                                onClick={() => setBehindType(opt)}
                            />
                        ))}
                    </div>
                </div>

                {/* 용도/장소 (BoxedSelect 1개, 바텀시트+직접입력) */}
                <BoxedSelect
                    default_label="용도 ∙ 장소"
                    label={<><span>용도 ∙ 장소</span><span className="text-orange-500 ml-1">*</span></>}
                    value={cabinetLocationLabel}
                    onClick={() => setIsCabinetLocationSheetOpen(true)}
                />
                <CabinetLocationInputSheet
                    isOpen={isCabinetLocationSheetOpen}
                    onClose={() => setIsCabinetLocationSheetOpen(false)}
                    value={cabinetLocation}
                    onChange={(val) => {
                        if (locationEnumValues.includes(val as Location)) {
                            setCabinetLocation(val);
                        } else {
                            setCabinetLocation(null);
                        }
                    }}
                />
                {/* 시공 필요 여부 */}
                <div className="flex flex-col gap-2">
                    <div className="w-full text-[14px] font-400 text-gray-600">시공 필요 여부</div>
                    <div className="flex flex-row gap-2">
                        <Button
                            type={cabinet_construct ? "BrandInverse" : "GrayLarge"}
                            text={"시공도 필요해요"}
                            onClick={() => setCabinetConstruct(true)}
                        />
                        <Button
                            type={!cabinet_construct ? "BrandInverse" : "GrayLarge"}
                            text={"필요 없어요"}
                            onClick={() => setCabinetConstruct(false)}
                        />
                    </div>
                </div>

                {/* 요청사항 */}
                <BoxedInput
                    label="제작 시 요청사항"
                    placeholder="예) 한쪽에 EP마감이 들어가요, 걸레받이 넣어주세요 등"
                    value={request}
                    onChange={e => setRequest(e.target.value)}
                    placeholderClassName="placeholder-gray-500"
                />
                <ImageUploadInput
                    label="이미지 첨부"
                    placeholder="이미지를 첨부해주세요"
                    value={images}
                    onChange={(newImages) => {
                        setImages(newImages);
                        updateItem({ raw_images: newImages });
                        console.log('이미지 업로드됨:', newImages.length, '개');
                    }}
                />
            </div>
            <div className="h-5" />
            <BodyMaterialManualInputSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                value={bodyMaterial}
                directInput={bodyMaterialDirectInput}
                onChange={(val) => {
                    if (typeof val === "number") {
                        setBodyMaterial(val);
                        setBodyMaterialDirectInput("");
                    } else {
                        setBodyMaterial(null);
                        setBodyMaterialDirectInput(val);
                    }
                }}
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
                            trackClick({
                                object_type: "button",
                                object_name: "confirm",
                                current_page: getScreenName(),
                                modal_name: null,
                            });
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
function BodyMaterialManualInputSheet({ isOpen, onClose, value, directInput, onChange }: { isOpen: boolean; onClose: () => void; value: number | null; directInput: string; onChange: (v: number | string) => void; }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const options = BODY_MATERIAL_LIST.filter(option => option.name !== "직접입력");
    // local selection state so sheet opens with nothing selected by default
    const [localSelected, setLocalSelected] = useState<number | "direct" | undefined>(undefined);
    const [localInput, setLocalInput] = useState<string>(directInput || "");

    useEffect(() => {
        if (isOpen) {
            // Reset selection only when the sheet is opened
            setLocalSelected(undefined);
            setLocalInput(directInput || "");
        }
        // intentionally not depending on directInput to avoid resets while typing
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <BottomSheet
            isOpen={isOpen}
            title="몸통 소재 및 두께를 선택해주세요"
            contentPadding="px-1"
            children={
                <div>
                    {options.map(option => (
                        <SelectToggleButton
                            key={option.id}
                            label={option.name}
                            checked={localSelected === option.id}
                            onClick={() => {
                                setLocalSelected(option.id);
                                onChange(option.id);
                            }}
                        />
                    ))}
                    <div className="flex flex-col">
                        <SelectToggleButton
                            label="직접 입력"
                            checked={localSelected === "direct"}
                            onClick={() => {
                                setLocalSelected("direct");
                                setTimeout(() => inputRef.current?.focus(), 0);
                            }}
                        />
                        {localSelected === "direct" && (
                            <div className="flex items-center gap-2 px-4 pb-3">
                                <GrayVerticalLine />
                                <BoxedInput
                                    ref={inputRef}
                                    type="text"
                                    placeholder="브랜드, 소재, 두께 등"
                                    className="w-full"
                                    value={localInput}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setLocalInput(val);
                                        onChange(val);
                                    }}
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

function CabinetLocationInputSheet({ isOpen, onClose, value, onChange }: { isOpen: boolean; onClose: () => void; value: string | null; onChange: (v: string | null) => void; }) {
    const locationEnumValues = Object.values(Location);
    return (
        <BottomSheet
            isOpen={isOpen}
            title="용도 및 장소를 선택해주세요"
            contentPadding="px-1"
            children={
                <div>
                    {locationEnumValues.map(option => (
                        <SelectToggleButton
                            key={option}
                            label={formatLocation(option)}
                            checked={value === option}
                            onClick={() => onChange(option)}
                        />
                    ))}
                </div>
            }
            onClose={onClose}
            buttonArea={
                <div className="p-5" style={{ position: "relative", zIndex: 1000 }}>
                    <Button type="Brand" text="다음" onClick={onClose} />
                </div>
            }
        />
    );
}


function FlapCabinetPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <FlapCabinetPageContent />
        </Suspense>
    );
}

export default FlapCabinetPage;
