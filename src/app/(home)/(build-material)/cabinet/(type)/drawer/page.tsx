"use client";

import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { CABINET_COLOR_LIST } from "dooring-core-domain/dist/constants/color";
import { ABSORBER_TYPE_LIST } from "@/constants/absorbertype";
import { CABINET_DRAWER_TYPE_LIST } from "@/constants/cabinetdrawertype";
import { useCabinetValidation } from "./hooks/useCabinetValidation";


import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import { CabinetHandleType, CabinetBehindType, Location, CabinetRailType, CabinetLegType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

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
import CabinetIcon1 from "@/app/(home)/(build-material)/cabinet/(type)/drawer/_components/cabinetIcon1";
import CabinetIcon2 from "@/app/(home)/(build-material)/cabinet/(type)/drawer/_components/cabinetIcon2";
import CabinetIcon3 from "@/app/(home)/(build-material)/cabinet/(type)/drawer/_components/cabinetIcon3";
import React from "react";
import ToastIcon from "public/icons/toast";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function DrawerCabinetPageContent() {
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
    // 다리발: enum + 직접입력
    const [legType, setLegType] = useState<CabinetLegType | null>(
        item && Object.values(CabinetLegType).includes(item.legType) ? item.legType : null
    );
    const [legTypeDirectInput, setLegTypeDirectInput] = useState<string>(item?.legType_direct_input ?? null);
    const [isLegTypeSheetOpen, setIsLegTypeSheetOpen] = useState(false);

    const [drawerType, setDrawerType] = useState<number | null>(
        typeof item?.drawer_type === "number" ? item.drawer_type : null
    );
    const [drawerTypeDirectInput, setDrawerTypeDirectInput] = useState(item?.drawer_type_direct_input ?? "");
    const [isDrawerTypeSheetOpen, setIsDrawerTypeSheetOpen] = useState(false);
    const [railType, setRailType] = useState<string>(item?.rail_type ?? "");
    const [railTypeDirectInput, setRailTypeDirectInput] = useState(item?.rail_type_direct_input ?? "");
    const [isRailTypeSheetOpen, setIsRailTypeSheetOpen] = useState(false);
    // Rail sheet local state: open with no selection; keep input active while typing
    const railInputRef = useRef<HTMLInputElement>(null);
    const [railLocalSelected, setRailLocalSelected] = useState<string | "direct" | undefined>(undefined);
    const [railLocalInput, setRailLocalInput] = useState<string>(railTypeDirectInput || "");

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('cabinet_drawer');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    useEffect(() => {
        if (isRailTypeSheetOpen) {
            setRailLocalSelected(undefined);
            setRailLocalInput(railTypeDirectInput || "");
        }
        // don't depend on railTypeDirectInput to avoid resets while typing
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRailTypeSheetOpen]);


    // 쇼바 종류 관련 상태
    const [absorber_type, setAbsorber_type] = useState<number | null>(null);
    const [absorber_type_direct_input, setAbsorber_type_direct_input] = useState("");
    const [isAbsorberSheetOpen, setIsAbsorberSheetOpen] = useState(false);
    const selectedAbsorber = absorber_type !== null ? ABSORBER_TYPE_LIST.find(opt => opt.id === absorber_type) : null;

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
    useEffect(() => { updateItem({ cabinet_construct: false }); }, [updateItem]);
    useEffect(() => { updateItem({ legType }); }, [legType]);
    useEffect(() => { updateItem({ legType_direct_input: legTypeDirectInput }); }, [legTypeDirectInput]);
    useEffect(() => { updateItem({ absorber_type }); }, [absorber_type]);
    useEffect(() => { updateItem({ absorber_type_direct_input }); }, [absorber_type_direct_input]);
    // robust: 서랍 종류, 레일 종류 동기화
    useEffect(() => { updateItem({ drawer_type: drawerType }); }, [drawerType]);
    useEffect(() => { updateItem({ drawer_type_direct_input: drawerTypeDirectInput }); }, [drawerTypeDirectInput]);
    useEffect(() => { updateItem({ rail_type: railType }); }, [railType]);
    useEffect(() => { updateItem({ rail_type_direct_input: railTypeDirectInput }); }, [railTypeDirectInput]);

    // validation
    const { widthError, heightError, depthError, isFormValid } = useCabinetValidation({
        DoorWidth,
        DoorHeight,
        DoorDepth,
    });
    // robust: 버튼 활성화 조건 (직접입력 포함)
    const button1Disabled =
        isFormValid() ||
        (bodyMaterial === null && !bodyMaterialDirectInput) ||
        (drawerType === null && !drawerTypeDirectInput) ||
        !handleType ||
        (railType === "" && !railTypeDirectInput) ||
        !behindType ||
        !cabinetLocation ||
        (legType === null && !legTypeDirectInput);

    // BODY_MATERIAL_LIST에서 선택된 소재명 또는 직접입력값 표시
    const selectedMaterial = bodyMaterial !== null ? BODY_MATERIAL_LIST.find(option => option.id === bodyMaterial) : null;
    const bodyMaterialLabel = bodyMaterial !== null
        ? (selectedMaterial ? selectedMaterial.name : "")
        : (bodyMaterialDirectInput || "");

    const locationEnumValues = Object.values(Location);
    const cabinetLocationLabel = cabinetLocation && locationEnumValues.includes(cabinetLocation)
        ? formatLocation(cabinetLocation)
        : "";

    // 서랍 종류 라벨 계산 (직접입력 시 사용자가 입력한 값 우선 표시)
    const drawerTypeLabel = (() => {
        if (drawerType !== null) {
            if (drawerType === 4) {
                return drawerTypeDirectInput || "직접입력";
            }
            return CABINET_DRAWER_TYPE_LIST.find(option => option.id === drawerType)?.name || "";
        }
        return drawerTypeDirectInput || "";
    })();
    // 다리발 표시 라벨 (enum 값 또는 직접입력)
    const legEnumValues = (Object.values(CabinetLegType) as string[]).filter(v => v !== CabinetLegType.DIRECT_INPUT);
    const legTypeStr = (legType as string) || "";
    const legTypeLabel = legEnumValues.includes(legTypeStr)
        ? legTypeStr
        : (legTypeDirectInput || "");

    // 색상 옵션 변환
    const colorOptions = CABINET_COLOR_LIST.map(opt => ({ value: opt.name, label: formatColor(opt.name) }));

    return (
        <div className="flex flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={80} />
            <Header title="서랍장 정보를 입력해주세요" />
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
                <BoxedSelect
                    default_label="서랍 종류"
                    label={<><span>서랍 종류</span><span className="text-orange-500 ml-1">*</span></>}
                    options={[]}
                    value={drawerTypeLabel}
                    onClick={() => setIsDrawerTypeSheetOpen(true)}
                    onChange={() => { }}
                />
                <DrawerTypeInputSheet
                    isOpen={isDrawerTypeSheetOpen}
                    onClose={() => setIsDrawerTypeSheetOpen(false)}
                    value={drawerTypeLabel}
                    onChange={(value) => {
                        console.log("🔄 DrawerType changed:", value);

                        // CABINET_DRAWER_TYPE_LIST에서 매칭되는 옵션 찾기
                        const matchedOption = CABINET_DRAWER_TYPE_LIST.find(option => option.name === value);

                        if (matchedOption && matchedOption.id !== 4) {
                            // 미리 정의된 옵션인 경우 (직접입력 제외)
                            setDrawerType(matchedOption.id);
                            setDrawerTypeDirectInput("");
                            console.log("✅ Set as predefined option:", matchedOption.id, value);
                        } else if (value.trim() !== "") {
                            // 직접입력인 경우 (id=4), 사용자가 입력한 텍스트를 별도 보관
                            setDrawerType(4); // 직접입력은 id가 4
                            setDrawerTypeDirectInput(value);
                            console.log("✅ Set as direct input:", value);
                        } else {
                            // 빈 값인 경우
                            setDrawerType(null);
                            setDrawerTypeDirectInput("");
                        }
                    }}
                />
                {/* 손잡이 robust (enum) */}
                <div className="flex flex-col gap-2">
                    <div className="text-[14px]/[20px] font-400 text-gray-600">
                        손잡이 종류
                        <span className="text-orange-500 ml-1">*</span>
                    </div>
                    <div className="flex w-full gap-2">
                        {Object.values(CabinetHandleType)
                            .filter(opt => opt == CabinetHandleType.CHANNEL || opt == CabinetHandleType.OUTER || opt == CabinetHandleType.PUSH)
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

                {/* 레일 종류 robust (enum/direct input, CabinetRailType) */}
                <BoxedSelect
                    default_label="레일 종류"
                    label={<><span>레일 종류</span><span className="text-orange-500 ml-1">*</span></>}
                    options={[
                        ...Object.values(CabinetRailType)
                            .filter(opt => opt !== CabinetRailType.DIRECT_INPUT)
                            .map(opt => ({ value: String(opt), label: String(opt) })),
                        { value: "직접입력", label: "직접입력" }
                    ]}
                    value={railType !== "" ? railType : railTypeDirectInput}
                    onClick={() => setIsRailTypeSheetOpen(true)}
                    onChange={() => { }}
                />
                <BottomSheet
                    isOpen={isRailTypeSheetOpen}
                    title="레일 종류를 선택해주세요"
                    contentPadding="px-1"
                    onClose={() => setIsRailTypeSheetOpen(false)}
                    children={
                        <div>
                            {Object.values(CabinetRailType)
                                .filter(opt => opt !== CabinetRailType.DIRECT_INPUT)
                                .map(opt => (
                                    <SelectToggleButton
                                        key={opt}
                                        label={String(opt)}
                                        checked={railLocalSelected === String(opt)}
                                        onClick={() => {
                                            setRailLocalSelected(String(opt));
                                            setRailType(String(opt));
                                            setRailTypeDirectInput("");
                                        }}
                                    />
                                ))}
                            <SelectToggleButton
                                label="직접입력"
                                checked={railLocalSelected === "direct"}
                                onClick={() => {
                                    setRailLocalSelected("direct");
                                    // mark as direct-input mode in store as well
                                    setRailType("");
                                    setTimeout(() => railInputRef.current?.focus(), 0);
                                }}
                            />
                            {railLocalSelected === "direct" && (
                                <div className="flex items-center gap-2 px-4 pb-3">
                                    <GrayVerticalLine />
                                    <BoxedInput
                                        ref={railInputRef}
                                        type="text"
                                        placeholder="레일 종류를 입력해주세요"
                                        className="w-full"
                                        value={railLocalInput}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setRailLocalInput(val);
                                            setRailType("");
                                            setRailTypeDirectInput(val);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    }
                    buttonArea={
                        <div className="p-5">
                            <Button type="Brand" text="다음" onClick={() => setIsRailTypeSheetOpen(false)} />
                        </div>
                    }
                />
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
                {/* 다리발 (BoxedSelect 1개, 바텀시트+직접입력) */}
                <BoxedSelect
                    default_label="다리발"
                    label={<><span>다리발</span><span className="text-orange-500 ml-1">*</span></>}
                    value={legTypeLabel}
                    onClick={() => setIsLegTypeSheetOpen(true)}
                />
                <LegTypeInputSheet
                    isOpen={isLegTypeSheetOpen}
                    onClose={() => setIsLegTypeSheetOpen(false)}
                    value={legType as string}
                    directInput={legTypeDirectInput}
                    onChange={(val: string) => {
                        const isEnum = (Object.values(CabinetLegType) as string[]).includes(val) && val !== CabinetLegType.DIRECT_INPUT;
                        if (isEnum) {
                            setLegType(val as CabinetLegType);
                            setLegTypeDirectInput("");
                        } else {
                            // Direct input mode: keep enum as DIRECT_INPUT and store text separately
                            setLegType(CabinetLegType.DIRECT_INPUT);
                            setLegTypeDirectInput(val);
                        }
                    }}
                />
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

function LegTypeInputSheet({ isOpen, onClose, value, directInput, onChange }: { isOpen: boolean; onClose: () => void; value: string; directInput: string; onChange: (v: string) => void; }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const options = (Object.values(CabinetLegType) as string[]).filter(v => v !== CabinetLegType.DIRECT_INPUT);
    // local selection state to ensure no default selection when opened
    const [localSelected, setLocalSelected] = useState<string | "direct" | undefined>(undefined);
    const [localInput, setLocalInput] = useState<string>(directInput || "");

    useEffect(() => {
        if (isOpen) {
            setLocalSelected(undefined);
            setLocalInput(directInput || "");
        }
        // intentionally not depending on directInput to avoid resets while typing
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

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
                            checked={localSelected === option}
                            onClick={() => {
                                setLocalSelected(option);
                                onChange(option);
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
                                    placeholder="다리발 종류를 입력해주세요"
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
// 불필요한 CabinetLocationSheet, UpperCabinetPageContent 중복 선언 제거

function DrawerTypeInputSheet({
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
    const inputRef = useRef<HTMLInputElement>(null);
    const options = [
        { main: "2단 서랍", sub: "", icon: <CabinetIcon1 /> },
        { main: "3단 서랍", sub: "(1 : 1 : 2)", icon: <CabinetIcon2 /> },
        { main: "3단 서랍", sub: "(겉2 ∙ 속1)", icon: <CabinetIcon3 /> },
    ];
    // 옵션/직접입력 모드 상태
    const [mode, setMode] = useState<"option" | "input">("option");

    useEffect(() => {
        if (isOpen) {
            if (options.some(opt => (opt.sub ? `${opt.main} ${opt.sub}` : opt.main) === value)) {
                setMode("option");
            } else if (value) {
                setMode("input");
            } else {
                setMode("option");
            }
        }
    }, [isOpen]);

    return (
        <BottomSheet
            isOpen={isOpen}
            title="서랍 종류를 선택해주세요"
            headerButtonText={mode === "option" ? "직접 입력" : "이전"}
            onHeaderButtonClick={() => {
                if (mode === "option") {
                    setMode("input");
                    onChange("");
                    setTimeout(() => inputRef.current?.focus(), 0);
                } else {
                    setMode("option");
                }
            }}
            children={
                <div>
                    {mode === "option" ? (
                        <div className="flex justify-between pt-5">
                            {options.map(option => {
                                const label = option.sub ? `${option.main} ${option.sub}` : option.main;
                                const selected = value === label;
                                return (
                                    <div
                                        key={label}
                                        className="flex w-full cursor-pointer flex-col items-center gap-2"
                                        onClick={() => onChange(label)}
                                    >
                                        <span className="flex w-full items-center justify-center">
                                            {React.cloneElement(option.icon, { color: selected ? "#44BE83" : "#D1D5DC" })}
                                        </span>
                                        <div className="flex h-[42px] flex-col items-center justify-center">
                                            <span className={`text-[16px]/[22px] font-400 text-gray-600`}>
                                                {option.main}
                                            </span>
                                            {option.sub && (
                                                <span className={`text-[14px]/[20px] font-500 text-gray-400`}>
                                                    {option.sub}
                                                </span>
                                            )}
                                        </div>
                                        <ToastIcon active={selected} />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <BoxedInput
                            label="서랍 종류"
                            ref={inputRef}
                            type="text"
                            placeholder="구체적으로 꼼꼼히 입력해주세요"
                            className="w-full pt-5"
                            value={value}
                            onChange={e => onChange(e.target.value)}
                        />
                    )}
                    <div className="py-5">
                        <Button
                            type="Brand"
                            text="다음"
                            onClick={() => {
                                onClose();
                            }}
                        />
                    </div>
                </div>
            }
            onClose={onClose}
        />
    );
}

function DrawerCabinetPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <DrawerCabinetPageContent />
        </Suspense>
    );
}

export default DrawerCabinetPage;
