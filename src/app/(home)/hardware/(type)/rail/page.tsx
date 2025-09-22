
"use client";

import { HardwareMadeBy, RailType, RailLength } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import React, { Suspense, useRef } from "react";
import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import BoxedSelect from "@/components/Select/BoxedSelect";
import BoxedInput from "@/components/Input/BoxedInput";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Button from "@/components/Button/Button";
import useItemStore from "@/store/Items/itemStore";


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
	// Direct input values
	const [madebyInput, setMadebyInput] = React.useState("");
	const [typeInput, setTypeInput] = React.useState("");
	const [lengthInput, setLengthInput] = React.useState("");
	// refs for focusing
	const madebyInputRef = useRef<HTMLInputElement>(null);
	const typeInputRef = useRef<HTMLInputElement>(null);
	const lengthInputRef = useRef<HTMLInputElement>(null);
	const headerTitle = "레일";

	// Extract fields from itemStore
	const madeby = item?.madeby ?? "";
	const railType = item?.railType ?? "";
	const railLength = item?.railLength ?? "";
	const request = item?.request ?? "";

	const isAnySheetOpen = isMadebySheetOpen || isTypeSheetOpen || isLengthSheetOpen;
	return (
		<div className="flex flex-col">
			<TopNavigator />
			<Header title={`${headerTitle} 정보를 입력해주세요`} />
			<div className="h-5" />
			<div className="flex flex-col gap-5 px-5">
						<BoxedSelect
							label="제조사"
							value={(() => {
								const v = isMadebySheetOpen && madebyMode === "input" ? madebyInput : madeby;
								if (v === "문주") return "국산 (문주) + 1,500원";
								if (v === "헤펠레") return "헤펠레 (Haffle) + 2,500원";
								if (v === "블룸") return "블룸 (Blum) + 10,500원";
								return v;
							})()}
							options={(Object.values(HardwareMadeBy) as string[]).map(v => ({ label: v, value: v }))}
							onClick={() => setIsMadebySheetOpen(true)}
							onChange={() => {}}
						/>
				<BoxedSelect
					label="레일 종류"
					value={isTypeSheetOpen && typeMode === "input" ? typeInput : railType}
					options={(Object.values(RailType) as string[]).map(v => ({ label: v, value: v }))}
					onClick={() => setIsTypeSheetOpen(true)}
					onChange={() => {}}
				/>
				<BoxedSelect
					label="길이"
					value={isLengthSheetOpen && lengthMode === "input" ? lengthInput : railLength}
					options={(Object.values(RailLength) as string[]).map(v => ({ label: v, value: v }))}
					onClick={() => setIsLengthSheetOpen(true)}
					onChange={() => {}}
				/>
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
											{(Object.values(HardwareMadeBy) as string[])
												.filter(option => option !== "직접 입력")
												.map(option => {
													let label = option;
													if (option === "문주") label = "국산 (문주) + 1,500원";
													if (option === "헤펠레") label = "헤펠레 (Haffle) + 2,500원";
													if (option === "블룸") label = "블룸 (Blum) + 10,500원";
													return (
														<SelectToggleButton
															key={option}
															label={label}
															checked={madeby === option && madebyMode !== "input"}
															onClick={() => {
																updateItem({ madeby: option });
																setMadebyMode("option");
																setMadebyInput("");
															}}
														/>
													);
												})}
							<div className="flex flex-col">
								<SelectToggleButton
									label="직접 입력"
									checked={madebyMode === "input"}
									onClick={() => {
										setMadebyMode("input");
										updateItem({ madeby: "" });
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
											value={madebyInput}
											onChange={e => setMadebyInput(e.target.value)}
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
									if (madebyMode === "input" && madebyInput) {
										updateItem({ madeby: madebyInput });
									}
									setIsMadebySheetOpen(false);
									setMadebyMode("option");
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
							{(Object.values(RailType) as string[])
								.filter(option => option !== "직접 입력")
								.map(option => (
									<SelectToggleButton
										key={option}
										label={option}
										checked={railType === option && typeMode !== "input"}
										onClick={() => {
											updateItem({ railType: option });
											setTypeMode("option");
											setTypeInput("");
										}}
									/>
								))}
							<div className="flex flex-col">
								<SelectToggleButton
									label="직접 입력"
									checked={typeMode === "input"}
									onClick={() => {
										setTypeMode("input");
										updateItem({ railType: "" });
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
											value={typeInput}
											onChange={e => setTypeInput(e.target.value)}
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
									if (typeMode === "input" && typeInput) {
										updateItem({ railType: typeInput });
									}
									setIsTypeSheetOpen(false);
									setTypeMode("option");
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
							{(Object.values(RailLength) as string[])
								.filter(option => option !== "직접 입력")
								.map(option => (
									<SelectToggleButton
										key={option}
										label={option}
										checked={railLength === option && lengthMode !== "input"}
										onClick={() => {
											updateItem({ railLength: option });
											setLengthMode("option");
											setLengthInput("");
										}}
									/>
								))}
							<div className="flex flex-col">
								<SelectToggleButton
									label="직접 입력"
									checked={lengthMode === "input"}
									onClick={() => {
										setLengthMode("input");
										updateItem({ railLength: "" });
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
											value={lengthInput}
											onChange={e => setLengthInput(e.target.value)}
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
									if (lengthMode === "input" && lengthInput) {
										updateItem({ railLength: lengthInput });
									}
									setIsLengthSheetOpen(false);
									setLengthMode("option");
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
						button1Disabled={madeby === "" || railType === "" || railLength === ""}
						onButton1Click={() => {
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
