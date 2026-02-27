"use client";

import React, { useState, useRef, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import BottomButton from "@/components/BottomButton/BottomButton";
import BoxedSelect from "@/components/Select/BoxedSelect";
import BoxedInput from "@/components/Input/BoxedInput";
import ImageUploadInput from "@/components/Input/ImageUploadInput";
import Button from "@/components/Button/Button";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import GrayVerticalLine from "@/components/GrayVerticalLine/GrayVerticalLine";
import formatColor from "@/utils/formatColor";
import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { CABINET_COLOR_LIST } from "dooring-core-domain/dist/constants/color";
import useItemStore from "@/store/itemStore";
import { useCabinetValidation } from "../upper/hooks/useCabinetValidation";
import { CabinetBehindType, CabinetLegType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function OpenCabinetPageContent() {
	const router = useRouter();
	const item = useItemStore(state => state.item);
	const updateItem = useItemStore(state => state.updateItem);

	// robust 상태 관리 (enum id/direct input, itemStore 동기화)
	const [DoorWidth, setDoorWidth] = useState<number | null>(item?.width ?? null);
	const [DoorHeight, setDoorHeight] = useState<number | null>(item?.height ?? null);
	const [DoorDepth, setDoorDepth] = useState<number | null>(item?.depth ?? null);
	const [color, setColor] = useState(item?.color ?? "");
	const [isColorSheetOpen, setIsColorSheetOpen] = useState(false);
	const [bodyMaterial, setBodyMaterial] = useState<number | null>(typeof item?.bodyMaterial === "number" ? item.bodyMaterial : null);
	const [bodyMaterialDirectInput, setBodyMaterialDirectInput] = useState(item?.body_material_direct_input ?? "");
	// 쇼바 위치에 밥솥 레일 추가 여부
	const [riceRail, setRiceRail] = useState(item?.riceRail ?? "");
	const [isRiceRailSheetOpen, setIsRiceRailSheetOpen] = useState(false);
	// 손잡이 위치에 하부장 추가 여부
	const [lowerDrawer, setLowerDrawer] = useState(item?.lowerDrawer ?? "");
	const [isLowerDrawerSheetOpen, setIsLowerDrawerSheetOpen] = useState(false);
	// CabinetBehindType의 첫 번째 값(우라홈) 사용
    const cabinetBehindTypeDefault = Object.values(CabinetBehindType)[1];
    const [behindType, setBehindType] = useState<CabinetBehindType | "">(
        item && Object.values(CabinetBehindType).includes(item.behindType) ? item.behindType : cabinetBehindTypeDefault
    );
	// 시공 필요 여부
	const [cabinet_construct, setCabinetConstruct] = useState(item?.cabinet_construct ?? false);
	const [request, setRequest] = useState(item?.request ?? "");
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	const [images, setImages] = useState<File[]>(item?.raw_images || []);
	// 다리발: enum + 직접입력
	// const [legType, setLegType] = useState<CabinetLegType | null>(
	// 	item && Object.values(CabinetLegType).includes(item.legType) ? item.legType : null
	// );
	// const [legTypeDirectInput, setLegTypeDirectInput] = useState<string>(item?.legType_direct_input ?? null);
	// const [isLegTypeSheetOpen, setIsLegTypeSheetOpen] = useState(false);

	// 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
	useEffect(() => {
		// 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
		setScreenName('cabinet_open');
		const prev = getPreviousScreenName();
		trackView({
			object_type: "screen",
			object_name: null,
			current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
			previous_screen: prev,
		});
	}, []);

	// 값 변경 시 itemStore에 동기화
	React.useEffect(() => { updateItem({ width: DoorWidth }); }, [DoorWidth]);
	React.useEffect(() => { updateItem({ height: DoorHeight }); }, [DoorHeight]);
	React.useEffect(() => { updateItem({ depth: DoorDepth }); }, [DoorDepth]);
	React.useEffect(() => { updateItem({ color }); }, [color]);
	React.useEffect(() => { updateItem({ bodyMaterial }); }, [bodyMaterial]);
	React.useEffect(() => { updateItem({ body_material_direct_input: bodyMaterialDirectInput }); }, [bodyMaterialDirectInput]);
	React.useEffect(() => { updateItem({ riceRail }); }, [riceRail]);
	React.useEffect(() => { updateItem({ lowerDrawer }); }, [lowerDrawer]);
	React.useEffect(() => { updateItem({ behindType }); }, [behindType]);
	React.useEffect(() => { updateItem({ cabinet_construct }); }, [cabinet_construct]);
	React.useEffect(() => { updateItem({ request }); }, [request]);
	// React.useEffect(() => { updateItem({ legType }); }, [legType]);
	// React.useEffect(() => { updateItem({ legType_direct_input: legTypeDirectInput }); }, [legTypeDirectInput]);

	// validation
	const { widthError, heightError, depthError, isFormValid } = useCabinetValidation({
		DoorWidth,
		DoorHeight,
		DoorDepth,
	});
	const button1Disabled =
		isFormValid() ||
		// (bodyMaterial === null && !bodyMaterialDirectInput) ||
		!riceRail ||
		!lowerDrawer ||
		!behindType ||
		(cabinet_construct === null);
	// (legType === null && !legTypeDirectInput);

	const selectedMaterial = bodyMaterial !== null ? BODY_MATERIAL_LIST.find(option => option.id === bodyMaterial) : null;
	const bodyMaterialLabel = bodyMaterial !== null
		? (selectedMaterial ? selectedMaterial.name : "")
		: (bodyMaterialDirectInput || "");
	const colorOptions = CABINET_COLOR_LIST.map(opt => ({ value: opt.name, label: formatColor(opt.name) }));

	// 다리발 표시 라벨 (enum 값 또는 직접입력)
	// const legEnumValues = (Object.values(CabinetLegType) as string[]).filter(v => v !== CabinetLegType.DIRECT_INPUT);
	// const legTypeStr = (legType as string) || "";
	// const legTypeLabel = legEnumValues.includes(legTypeStr)
	// 	? legTypeStr
	// 	: (legTypeDirectInput || "");

	return (
		<div className="flex flex-col pt-[90px]">
			<InitAmplitude />
			<TopNavigator />
			<ProgressBar progress={80} />
			<Header title="오픈장 정보를 입력해주세요" />
			<div className="h-5" />
			<div className="flex flex-col gap-5 px-5">
				{/* 도어 색상 */}
				<BoxedSelect
					default_label="바디 색상"
					label={<span>바디 색상<span className="text-orange-500 ml-1">*</span></span>}
					options={colorOptions}
					value={formatColor(item?.color ?? "") || item?.cabinet_color_direct_input || ""}
					onClick={() => router.push("/cabinet/color")}
					onChange={() => { }}
				/>
				{/* 몸통 소재 및 두께
				<BoxedSelect
					default_label="몸통 소재 및 두께"
					label={<span>몸통 소재 및 두께<span className="text-orange-500 ml-1">*</span></span>}
					options={BODY_MATERIAL_LIST.filter(opt => opt.name !== "직접입력").map(opt => ({ value: String(opt.id), label: opt.name }))}
					value={bodyMaterial !== null ? (selectedMaterial ? selectedMaterial.name : "") : bodyMaterialDirectInput}
					onClick={() => setIsBottomSheetOpen(true)}
					onChange={() => { }}
				/> */}
				{/* 너비 */}
				<BoxedInput
					type="number"
					label={<span>너비(mm)<span className="text-orange-500 ml-1">*</span></span>}
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
					label={<span>높이(mm)<span className="text-orange-500 ml-1">*</span></span>}
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
					label={<span>깊이(mm)<span className="text-orange-500 ml-1">*</span></span>}
					placeholder="깊이를 입력해주세요"
					value={DoorDepth ?? ""}
					onChange={e => {
						const value = e.target.value;
						setDoorDepth(value ? Number(value) : null);
					}}
					error={!!depthError}
					helperText={depthError}
				/>
				{/* 쇼바 위치에 밥솥 레일 추가 여부 */}
				<div className="flex flex-col gap-2">
					<div className="text-[14px]/[20px] font-400 text-gray-600">
						밥솥 레일 추가 여부
						<span className="text-orange-500 ml-1">*</span>
					</div>
					<div className="flex w-full gap-2">
						<Button
							type={riceRail === "추가" ? "BrandInverse" : "GrayLarge"}
							text="추가"
							onClick={() => setRiceRail("추가")}
						/>
						<Button
							type={riceRail === "추가 안 함" ? "BrandInverse" : "GrayLarge"}
							text="추가 안 함"
							onClick={() => setRiceRail("추가 안 함")}
						/>
					</div>
				</div>
				{/* 손잡이 위치에 하부장 추가 여부 */}
				<div className="flex flex-col gap-2">
					<div className="text-[14px]/[20px] font-400 text-gray-600">
						하부 서랍장 추가 여부
						<span className="text-orange-500 ml-1">*</span>
					</div>
					<div className="flex w-full gap-2">
						<Button
							type={lowerDrawer === "추가" ? "BrandInverse" : "GrayLarge"}
							text="추가"
							onClick={() => setLowerDrawer("추가")}
						/>
						<Button
							type={lowerDrawer === "추가 안 함" ? "BrandInverse" : "GrayLarge"}
							text="추가 안 함"
							onClick={() => setLowerDrawer("추가 안 함")}
						/>
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

function OpenCabinetPage() {
	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<OpenCabinetPageContent />
		</Suspense>
	);
}

export default OpenCabinetPage;
