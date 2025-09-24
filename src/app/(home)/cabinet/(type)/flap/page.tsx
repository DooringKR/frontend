"use client";

import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { CABINET_COLOR_LIST } from "@/constants/colorList";
import { CABINET_FLAPSTAY_LIST, CABINET_ABSORBER_TYPE_NAME } from "@/constants/modelList";
import { useCabinetValidation } from "../upper/hooks/useCabinetValidation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import useItemStore from "@/store/Items/itemStore";
import formatLocation from "@/utils/formatLocation";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import GrayVerticalLine from "@/components/GrayVerticalLine/GrayVerticalLine";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import formatColor from "@/utils/formatColor";

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
	const [bodyMaterial, setBodyMaterial] = useState<number | null>(typeof item?.bodyMaterial === "number" ? item.bodyMaterial : null);
	const [bodyMaterialDirectInput, setBodyMaterialDirectInput] = useState(item?.body_material_direct_input ?? "");
	const [handleType, setHandleType] = useState(item?.handleType ?? "");
	const [behindType, setBehindType] = useState(item?.behindType ?? "우라홈");
	const [request, setRequest] = useState(item?.request ?? "");
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	const [cabinetLocation, setCabinetLocation] = useState(item?.cabinet_location ?? "");
	const [isCabinetLocationSheetOpen, setIsCabinetLocationSheetOpen] = useState(false);
	const [addOnConstruction, setAddOnConstruction] = useState(item?.addOn_construction ?? false);
	const [legType, setLegType] = useState(item?.legType ?? "");
	const [isLegTypeSheetOpen, setIsLegTypeSheetOpen] = useState(false);
	// 플랩장 absorber_type(쇼바종류) 및 직접입력
	const [absorberType, setAbsorberType] = useState(item?.absorber_type ?? "");
	const [absorberTypeDirectInput, setAbsorberTypeDirectInput] = useState(item?.absorber_type_direct_input ?? "");
	const [isAbsorberSheetOpen, setIsAbsorberSheetOpen] = useState(false);

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
	useEffect(() => { updateItem({ addOn_construction: addOnConstruction }); }, [addOnConstruction]);
	useEffect(() => { updateItem({ legType }); }, [legType]);
	useEffect(() => { updateItem({ absorber_type: absorberType }); }, [absorberType]);
	useEffect(() => { updateItem({ absorber_type_direct_input: absorberTypeDirectInput }); }, [absorberTypeDirectInput]);

	// validation
	const { widthError, heightError, depthError, isFormValid } = useCabinetValidation({
		DoorWidth,
		DoorHeight,
		DoorDepth,
	});
	const button1Disabled = isFormValid() || (bodyMaterial === null && !bodyMaterialDirectInput) || !handleType || !behindType;

	const selectedMaterial = bodyMaterial !== null ? BODY_MATERIAL_LIST.find(option => option.id === bodyMaterial) : null;
	const bodyMaterialLabel = bodyMaterial !== null
		? (selectedMaterial ? selectedMaterial.name : "")
		: (bodyMaterialDirectInput || "");

	const colorOptions = CABINET_COLOR_LIST.map(opt => ({ value: opt.name, label: formatColor(opt.name) }));

	return (
		<div className="flex flex-col">
			<TopNavigator />
			<Header title="플랩장 정보를 입력해주세요" />
			<div className="h-5" />
			<div className="flex flex-col gap-5 px-5">
				{/* 도어 색상 */}
				<BoxedSelect
					label="도어 색상"
					options={colorOptions}
					value={color}
					onClick={() => router.push("/cabinet/color")}
					onChange={() => {}}
				/>
				{/* 몸통 소재 및 두께 */}
				<BoxedSelect
					label="몸통 소재 및 두께"
					options={BODY_MATERIAL_LIST.filter(opt => opt.name !== "직접입력").map(opt => ({ value: String(opt.id), label: opt.name }))}
					value={bodyMaterial !== null ? (selectedMaterial ? selectedMaterial.name : "") : bodyMaterialDirectInput}
					onClick={() => setIsBottomSheetOpen(true)}
					onChange={() => {}}
				/>
				{/* 용도/장소 */}
				<BoxedSelect
					label="용도 ∙ 장소"
					options={[
						{ value: "KITCHEN", label: "주방" },
						{ value: "SHOES", label: "신발장" },
						{ value: "BUILT_IN", label: "붙박이장" },
						{ value: "BALCONY", label: "발코니 창고문" },
						{ value: "ETC", label: "기타 수납장" },
					]}
					value={formatLocation(cabinetLocation)}
					onClick={() => setIsCabinetLocationSheetOpen(true)}
					onChange={() => {}}
				/>
				<BottomSheet
					isOpen={isCabinetLocationSheetOpen}
					title="용도 및 장소를 선택해주세요"
					contentPadding="px-1"
					onClose={() => setIsCabinetLocationSheetOpen(false)}
					children={
						<div>
							{[
								{ value: "KITCHEN", label: "주방" },
								{ value: "SHOES", label: "신발장" },
								{ value: "BUILT_IN", label: "붙박이장" },
								{ value: "BALCONY", label: "발코니 창고문" },
								{ value: "ETC", label: "기타 수납장" },
							].map(opt => (
								<SelectToggleButton
									key={opt.value}
									label={opt.label}
									checked={cabinetLocation === opt.value}
									onClick={() => {
										setCabinetLocation(opt.value);
										setIsCabinetLocationSheetOpen(false);
									}}
								/>
							))}
						</div>
					}
				/>
				{/* 시공 필요 여부 */}
				<div className="flex flex-col gap-2">
					<div className="w-full text-[14px] font-400 text-gray-600">시공 필요 여부</div>
					<div className="flex flex-row gap-2">
						<Button
							type={addOnConstruction ? "BrandInverse" : "GrayLarge"}
							text={"시공도 필요해요"}
							onClick={() => setAddOnConstruction(true)}
						/>
						<Button
							type={!addOnConstruction ? "BrandInverse" : "GrayLarge"}
							text={"필요 없어요"}
							onClick={() => setAddOnConstruction(false)}
						/>
					</div>
				</div>
				{/* 다리발 */}
				<BoxedSelect
					label="다리발"
					options={[
						{ value: "150 다리 (걸레받이)", label: "150 다리 (걸레받이)" },
						{ value: "120 다리 (걸레받이)", label: "120 다리 (걸레받이)" },
						{ value: "다리발 없음 (60 속걸레받이)", label: "다리발 없음 (60 속걸레받이)" },
					]}
					value={legType}
					onClick={() => setIsLegTypeSheetOpen(true)}
					onChange={() => {}}
				/>
				<BottomSheet
					isOpen={isLegTypeSheetOpen}
					title="다리발 종류를 선택해주세요"
					contentPadding="px-1"
					onClose={() => setIsLegTypeSheetOpen(false)}
					children={
						<div>
							{[
								"150 다리 (걸레받이)",
								"120 다리 (걸레받이)",
								"다리발 없음 (60 속걸레받이)",
							].map(opt => (
								<SelectToggleButton
									key={opt}
									label={opt}
									checked={legType === opt}
									onClick={() => {
										setLegType(opt);
										setIsLegTypeSheetOpen(false);
									}}
								/>
							))}
						</div>
					}
				/>
				{/* 몸통 소재 및 두께 */}
				<BoxedSelect
					label="몸통 소재 및 두께"
					options={BODY_MATERIAL_LIST.filter(opt => opt.name !== "직접입력").map(opt => ({ value: String(opt.id), label: opt.name }))}
					value={bodyMaterial !== null ? (selectedMaterial ? selectedMaterial.name : "") : bodyMaterialDirectInput}
					onClick={() => setIsBottomSheetOpen(true)}
					onChange={() => {}}
				/>
				{/* 쇼바 종류 (absorber_type) */}
				<BoxedSelect
					label="쇼바 종류"
					options={[
						...CABINET_FLAPSTAY_LIST.map(opt => ({ value: opt, label: opt })),
						{ value: "직접 입력", label: "직접 입력" },
					]}
					value={absorberType ? absorberType : absorberTypeDirectInput}
					onClick={() => setIsAbsorberSheetOpen(true)}
					onChange={() => {}}
				/>
				<BottomSheet
					isOpen={isAbsorberSheetOpen}
					title="쇼바 종류를 선택해주세요"
					contentPadding="px-1"
					onClose={() => setIsAbsorberSheetOpen(false)}
					children={
						<div>
							{CABINET_FLAPSTAY_LIST.map(opt => (
								<SelectToggleButton
									key={opt}
									label={opt}
									checked={absorberType === opt}
									onClick={() => {
										setAbsorberType(opt);
										setAbsorberTypeDirectInput("");
										setIsAbsorberSheetOpen(false);
									}}
								/>
							))}
							<SelectToggleButton
								label="직접 입력"
								checked={absorberType === "" && absorberTypeDirectInput !== ""}
								onClick={() => {
									setAbsorberType("");
									setAbsorberTypeDirectInput("");
									setTimeout(() => {
										const el = document.getElementById("absorber-type-direct-input");
										if (el) (el as HTMLInputElement).focus();
									}, 0);
								}}
							/>
							{absorberType === "" && (
								<div className="flex items-center gap-2 px-4 pb-3">
									<GrayVerticalLine />
									<BoxedInput
										type="text"
										placeholder="쇼바 종류를 입력해주세요"
										className="w-full"
										value={absorberTypeDirectInput}
										onChange={e => setAbsorberTypeDirectInput(e.target.value)}
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
				{/* 너비 */}
				<BoxedInput
					type="number"
					label="너비(mm)"
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
					label="높이(mm)"
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
					label="깊이(mm)"
					placeholder="깊이를 입력해주세요"
					value={DoorDepth ?? ""}
					onChange={e => {
						const value = e.target.value;
						setDoorDepth(value ? Number(value) : null);
					}}
					error={!!depthError}
					helperText={depthError}
				/>
				{/* 손잡이 종류 */}
				<div className="flex flex-col gap-2">
					<div className="text-[14px]/[20px] font-400 text-gray-600">손잡이 종류</div>
					<div className="flex w-full gap-2">
						<Button
							type={handleType === "겉손잡이" ? "BrandInverse" : "GrayLarge"}
							text={"겉손잡이"}
							onClick={() => setHandleType("겉손잡이")}
						/>
						<Button
							type={handleType === "내리기" ? "BrandInverse" : "GrayLarge"}
							text={"내리기"}
							onClick={() => setHandleType("내리기")}
						/>
						<Button
							type={handleType === "푸쉬" ? "BrandInverse" : "GrayLarge"}
							text={"푸쉬"}
							onClick={() => setHandleType("푸쉬")}
						/>
					</div>
				</div>
				{/* 뒷판 방식 (CabinetBehindType) */}
				<div className="flex flex-col gap-2">
					<div className="text-[14px]/[20px] font-400 text-gray-600">뒷판 방식</div>
					<div className="flex w-full gap-2">
						<Button
							type={behindType === "우라홈" ? "BrandInverse" : "GrayLarge"}
							text={"일반 (우라홈)"}
							onClick={() => setBehindType("우라홈")}
						/>
						<Button
							type={behindType === "막우라" ? "BrandInverse" : "GrayLarge"}
							text={"막우라"}
							onClick={() => setBehindType("막우라")}
						/>
					</div>
				</div>
				{/* 요청사항 */}
				<BoxedInput
					label="제작 시 요청사항"
					placeholder="제작 시 요청사항을 입력해주세요"
					value={request}
					onChange={e => setRequest(e.target.value)}
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
			{!isBottomSheetOpen && !isAbsorberSheetOpen && (
				<div id="cabinet-next-button">
					<BottomButton
						type={"1button"}
						button1Text={"다음"}
						className="fixed bottom-0 w-full max-w-[460px]"
						button1Disabled={button1Disabled}
						onButton1Click={() => {
							router.push("/cabinet/report");
						}}
					/>
				</div>
			)}
		</div>
	);
}

function BodyMaterialManualInputSheet({ isOpen, onClose, value, directInput, onChange }: { isOpen: boolean; onClose: () => void; value: number | null; directInput: string; onChange: (v: number | string) => void; }) {
	const inputRef = useRef<HTMLInputElement>(null);
	const options = BODY_MATERIAL_LIST.filter(option => option.name !== "직접입력");
	const selectedMaterial = value !== null ? options.find(option => option.id === value) : null;
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
							checked={value === option.id}
							onClick={() => onChange(option.id)}
						/>
					))}
					<div className="flex flex-col">
						<SelectToggleButton
							label="직접 입력"
							checked={value === null}
							onClick={() => {
								onChange("");
								setTimeout(() => inputRef.current?.focus(), 0);
							}}
						/>
						{value === null && (
							<div className="flex items-center gap-2 px-4 pb-3">
								<GrayVerticalLine />
								<BoxedInput
									ref={inputRef}
									type="text"
									placeholder="브랜드, 소재, 두께 등"
									className="w-full"
									value={directInput}
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

function FlapCabinetPage() {
	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<FlapCabinetPageContent />
		</Suspense>
	);
}

export default FlapCabinetPage;
