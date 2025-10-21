
"use client";

import { HardwareMadeBy, RailType, RailLength } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";
import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import BoxedSelect from "@/components/Select/BoxedSelect";
import BoxedInput from "@/components/Input/BoxedInput";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Button from "@/components/Button/Button";
import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";


function RailPageContent() {
	const router = useRouter();
	const item = useItemStore(state => state.item);
	const updateItem = useItemStore(state => state.updateItem);
	// Modal open states
	const [isMadebySheetOpen, setIsMadebySheetOpen] = React.useState(false);
	const [isTypeSheetOpen, setIsTypeSheetOpen] = React.useState(false);
	const [isLengthSheetOpen, setIsLengthSheetOpen] = React.useState(false);
	// Direct input mode states
	const [madebyMode, setMadebyMode] = React.useState("option");
	const [typeMode, setTypeMode] = React.useState("option");
	const [lengthMode, setLengthMode] = React.useState("option");
	// 직접입력값은 itemStore만 사용 (로컬 상태 제거)
	// refs for focusing
	const madebyInputRef = useRef<HTMLInputElement>(null);
	const typeInputRef = useRef<HTMLInputElement>(null);
	const lengthInputRef = useRef<HTMLInputElement>(null);
	const headerTitle = "레일";

	// Extract fields from itemStore
	const madeby = item?.madeby ?? "";
	const madebyInputVal = item?.madebyInput ?? "";
	const railType = item?.railType ?? "";
	const railTypeInputVal = item?.railTypeInput ?? "";
	const railLength = item?.railLength ?? "";
	const railLengthInputVal = item?.railLengthInput ?? "";
	const request = item?.request ?? "";
	const railDamping = item?.railDamping ?? "";

	// 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
	useEffect(() => {
		// 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
		setScreenName('hardware_rail');
		const prev = getPreviousScreenName();
		trackView({
			object_type: "screen",
			object_name: null,
			current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
			previous_screen: prev,
		});
	}, []);

	// railType 변경 시 불필요한 값 리셋
	React.useEffect(() => {
		if (railType !== RailType.BALL && railType !== RailType.UNDER) {
			if (railLength !== "") updateItem({ railLength: "" });
		}
		if (railType !== RailType.BALL) {
			if (railDamping !== "") updateItem({ railDamping: "" });
		}
	}, [railType]);

	const isAnySheetOpen = isMadebySheetOpen || isTypeSheetOpen || isLengthSheetOpen;
	// itemStore에 직접입력값 동기화 (항상 동기화)
	// useEffect 불필요: 값은 모두 itemStore에서 직접 관리

	return (
		<div className="flex flex-col">
			<InitAmplitude />
			<TopNavigator />
			<Header title={`${headerTitle} 정보를 입력해주세요`} />
			<div className="h-5" />
			<div className="flex flex-col gap-5 px-5">
				<BoxedSelect
					label="제조사"
					value={(() => {
						if (madeby === HardwareMadeBy.DIRECT_INPUT) {
							return item?.madebyInput || "직접 입력";
						}
						if (madeby === HardwareMadeBy.MOONJOO) return "국산 (문주) + 1,500원";
						if (madeby === HardwareMadeBy.HAFFLE) return "헤펠레 (Haffle) + 2,500원";
						if (madeby === HardwareMadeBy.BLUM) return "블룸 (Blum) + 10,500원";
						return madeby;
					})()}
					options={Object.values(HardwareMadeBy).map(v => ({ label: v, value: v }))}
					onClick={() => setIsMadebySheetOpen(true)}
					onChange={() => { }}
				/>
				<BoxedSelect
					label="레일 종류"
					value={(() => {
						if (railType === RailType.DIRECT_INPUT) {
							return item?.railTypeInput || "직접 입력";
						}
						return railType;
					})()}
					options={Object.values(RailType).map(v => ({ label: v, value: v }))}
					onClick={() => setIsTypeSheetOpen(true)}
					onChange={() => { }}
				/>
				{(railType === RailType.BALL || railType === RailType.UNDER || railType === RailType.DIRECT_INPUT) && (
					<BoxedSelect
						label="레일 길이"
						value={(() => {
							if (railLength === RailLength.DIRECT_INPUT) {
								return item?.railLengthInput || "직접 입력";
							}
							return railLength;
						})()}
						options={Object.values(RailLength).map(v => ({ label: v, value: v }))}
						onClick={() => setIsLengthSheetOpen(true)}
						onChange={() => { }}
					/>
				)}
				{/* 댐핑 여부 선택: railType이 볼레일일 때만 노출, Button group 형식 */}
				{railType === RailType.BALL && (
					<div className="flex flex-col gap-2">
						<div className="text-[14px]/[20px] font-400 text-gray-600">댐핑 여부</div>
						<div className="flex w-full gap-2">
							<Button
								type={railDamping === true ? "BrandInverse" : "GrayLarge"}
								text={"댐핑 O"}
								onClick={() => updateItem({ railDamping: true })}
							/>
							<Button
								type={railDamping === false ? "BrandInverse" : "GrayLarge"}
								text={"댐핑 X"}
								onClick={() => updateItem({ railDamping: false })}
							/>
						</div>
					</div>
				)}
				<BoxedInput
					label="제작 시 요청사항"
					placeholder="제작 시 요청사항을 입력해주세요"
					value={request}
					onChange={e => updateItem({ request: e.target.value })}
				/>
			</div>
			<div className="h-5" />
			{/* 제조사 바텀시트 */}
			<BottomSheet
				isOpen={isMadebySheetOpen}
				title="제조사를 선택해주세요"
				contentPadding="px-1"
				onClose={() => {
					setIsMadebySheetOpen(false);
					setMadebyMode("option");
				}}
				children={
					<div>
						<div>
							{Object.values(HardwareMadeBy)
								.filter(option => option !== HardwareMadeBy.DIRECT_INPUT)
								.map(option => {
									let label = "";
									if (option === HardwareMadeBy.MOONJOO) label = "국산 (문주) + 1,500원";
									if (option === HardwareMadeBy.HAFFLE) label = "헤펠레 (Haffle) + 2,500원";
									if (option === HardwareMadeBy.BLUM) label = "블룸 (Blum) + 10,500원";
									return (
										<SelectToggleButton
											key={option}
											label={label}
											checked={madeby === option}
											onClick={() => {
												updateItem({ madeby: option, madebyInput: "" });
												setMadebyMode("option");
											}}
										/>
									);
								})}
							<div className="flex flex-col">
								<SelectToggleButton
									label="직접 입력"
									checked={madebyMode === "input" || madeby === HardwareMadeBy.DIRECT_INPUT}
									onClick={() => {
										setMadebyMode("input");
										updateItem({ madeby: HardwareMadeBy.DIRECT_INPUT, madebyInput: item?.madebyInput ?? "" });
										setTimeout(() => madebyInputRef.current?.focus(), 0);
									}}
								/>
								{madebyMode === "input" && (
									<div className="flex items-center gap-2 px-4 pb-3">
										<BoxedInput
											ref={madebyInputRef}
											type="text"
											placeholder="제조사 직접 입력"
											className="w-full"
											value={item?.madebyInput ?? ""}
											onChange={e => {
												updateItem({ madebyInput: e.target.value });
											}}
										/>
									</div>
								)}
							</div>
						</div>
						<div className="py-5 px-5">
							<Button
								type="Brand"
								text="다음"
								onClick={() => {
									if (madebyMode === "input") {
										updateItem({ madeby: HardwareMadeBy.DIRECT_INPUT, madebyInput: item?.madebyInput ?? "" });
									}
									setIsMadebySheetOpen(false);
								}}
							/>
						</div>
					</div>
				}
			/>
			{/* 레일 종류 바텀시트 */}
			<BottomSheet
				isOpen={isTypeSheetOpen}
				title="레일 종류를 선택해주세요"
				contentPadding="px-1"
				onClose={() => {
					setIsTypeSheetOpen(false);
					setTypeMode("option");
				}}
				children={
					<div>
						<div>
							{Object.values(RailType)
								.filter(option => option !== RailType.DIRECT_INPUT)
								.map(option => (
									<SelectToggleButton
										key={option}
										label={option}
										checked={railType === option}
										onClick={() => {
											updateItem({ railType: option, railTypeInput: "" });
											setTypeMode("option");
										}}
									/>
								))}
							<div className="flex flex-col">
								<SelectToggleButton
									label="직접 입력"
									checked={typeMode === "input" || railType === RailType.DIRECT_INPUT}
									onClick={() => {
										setTypeMode("input");
										updateItem({ railType: RailType.DIRECT_INPUT, railTypeInput: item?.railTypeInput ?? "" });
										setTimeout(() => typeInputRef.current?.focus(), 0);
									}}
								/>
								{typeMode === "input" && (
									<div className="flex items-center gap-2 px-4 pb-3">
										<BoxedInput
											ref={typeInputRef}
											type="text"
											placeholder="레일 종류 직접 입력"
											className="w-full"
											value={item?.railTypeInput ?? ""}
											onChange={e => {
												updateItem({ railTypeInput: e.target.value });
											}}
										/>
									</div>
								)}
							</div>
						</div>
						<div className="py-5 px-5">
							<Button
								type="Brand"
								text="다음"
								onClick={() => {
									if (typeMode === "input") {
										updateItem({ railType: RailType.DIRECT_INPUT, railTypeInput: item?.railTypeInput ?? "" });
									}
									setIsTypeSheetOpen(false);
								}}
							/>
						</div>
					</div>
				}
			/>
			{/* 길이 바텀시트 */}
			<BottomSheet
				isOpen={isLengthSheetOpen}
				title="길이를 선택해주세요"
				contentPadding="px-1"
				onClose={() => {
					setIsLengthSheetOpen(false);
					setLengthMode("option");
				}}
				children={
					<div>
						<div>
							{Object.values(RailLength)
								.filter(option => option !== RailLength.DIRECT_INPUT)
								.map(option => (
									<SelectToggleButton
										key={option}
										label={option}
										checked={railLength === option}
										onClick={() => {
											updateItem({ railLength: option, railLengthInput: "" });
											setLengthMode("option");
										}}
									/>
								))}
							<div className="flex flex-col">
								<SelectToggleButton
									label="직접 입력"
									checked={lengthMode === "input" || railLength === RailLength.DIRECT_INPUT}
									onClick={() => {
										setLengthMode("input");
										updateItem({ railLength: RailLength.DIRECT_INPUT, railLengthInput: item?.railLengthInput ?? "" });
										setTimeout(() => lengthInputRef.current?.focus(), 0);
									}}
								/>
								{lengthMode === "input" && (
									<div className="flex items-center gap-2 px-4 pb-3">
										<BoxedInput
											ref={lengthInputRef}
											type="text"
											placeholder="길이 직접 입력"
											className="w-full"
											value={item?.railLengthInput ?? ""}
											onChange={e => {
												updateItem({ railLengthInput: e.target.value });
											}}
										/>
									</div>
								)}
							</div>
						</div>
						<div className="py-5 px-5">
							<Button
								type="Brand"
								text="다음"
								onClick={() => {
									if (lengthMode === "input") {
										updateItem({ railLength: RailLength.DIRECT_INPUT, railLengthInput: item?.railLengthInput ?? "" });
									}
									setIsLengthSheetOpen(false);
								}}
							/>
						</div>
					</div>
				}
			/>
			<div className="h-[100px]" />
			{!isAnySheetOpen && (
				<div id="hardware-next-button">
					<BottomButton
						type={"1button"}
						button1Text={"다음"}
						className="fixed bottom-0 w-full max-w-[460px]"
						button1Disabled={
							madeby === "" || railType === "" ||
							((railType === RailType.BALL || railType === RailType.UNDER) && railLength === "")
						}
						onButton1Click={() => {
							trackClick({
								object_type: "button",
								object_name: "confirm",
								current_page: getScreenName(),
								modal_name: null,
							});
							router.push(`/hardware/report`);
						}}
					/>
				</div>
			)}
		</div>
	);
}

function RailPage() {
	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<RailPageContent />
		</Suspense>
	);
}

export default RailPage;
