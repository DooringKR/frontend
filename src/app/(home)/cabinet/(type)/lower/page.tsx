import { CabinetHandleType, CabinetBehindType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
"use client";

import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { CABINET_COLOR_LIST } from "@/constants/colorList";
import { useCabinetValidation } from "../upper/hooks/useCabinetValidation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import useItemStore from "@/store/itemStore";
import formatLocation from "@/utils/formatLocation";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import GrayVerticalLine from "@/components/GrayVerticalLine/GrayVerticalLine";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import formatColor from "@/utils/formatColor";

function LowerCabinetPageContent() {
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
	// robust: enum 기반 상태 관리
	const [handleType, setHandleType] = useState<CabinetHandleType | "">(
		item && Object.values(CabinetHandleType).includes(item.handleType) ? item.handleType : ""
	);
	const cabinetBehindTypeDefault = Object.values(CabinetBehindType)[0];
	const [behindType, setBehindType] = useState<CabinetBehindType | "">(
		item && Object.values(CabinetBehindType).includes(item.behindType) ? item.behindType : cabinetBehindTypeDefault
	);
	const [request, setRequest] = useState(item?.request ?? "");
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	const [cabinetLocation, setCabinetLocation] = useState(item?.cabinet_location ?? "");
	const [isCabinetLocationSheetOpen, setIsCabinetLocationSheetOpen] = useState(false);
	const [addOnConstruction, setAddOnConstruction] = useState(item?.addOn_construction ?? false);
	const [legType, setLegType] = useState(item?.legType ?? "");
	const [isLegTypeSheetOpen, setIsLegTypeSheetOpen] = useState(false);

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
			<Header title="하부장 정보를 입력해주세요" />
			<div className="h-5" />
			<div className="flex flex-col gap-5 px-5">
				{/* 도어 색상 */}
				<BoxedSelect
					label="도어 색상"
					options={colorOptions}
					value={color}
					onClick={() => router.push("/cabinet/color")}
					onChange={() => { }}
				/>
				{/* 몸통 소재 및 두께 */}
				<BoxedSelect
					label="몸통 소재 및 두께"
					options={BODY_MATERIAL_LIST.filter(opt => opt.name !== "직접입력").map(opt => ({ value: String(opt.id), label: opt.name }))}
					value={bodyMaterial !== null ? (selectedMaterial ? selectedMaterial.name : "") : bodyMaterialDirectInput}
					onClick={() => setIsBottomSheetOpen(true)}
					onChange={() => { }}
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
					onChange={() => { }}
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
					onChange={() => { }}
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
					onChange={() => { }}
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
				{/* 손잡이 robust (enum) */}
				<div className="flex flex-col gap-2">
					<div className="text-[14px]/[20px] font-400 text-gray-600">손잡이 종류</div>
					<div className="flex w-full gap-2">
						{Object.values(CabinetHandleType).map(opt => (
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
					<div className="text-[14px]/[20px] font-400 text-gray-600">뒷판 방식</div>
					<div className="flex w-full gap-2">
						{Object.values(CabinetBehindType).map(opt => (
							<Button
								key={opt}
								type={behindType === opt ? "BrandInverse" : "GrayLarge"}
								text={opt === cabinetBehindTypeDefault ? "일반 (우라홈)" : opt}
								onClick={() => setBehindType(opt)}
							/>
						))}
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
			{!isBottomSheetOpen && (
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

function LowerCabinetPage() {
	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<LowerCabinetPageContent />
		</Suspense>
	);
}

export default LowerCabinetPage;
