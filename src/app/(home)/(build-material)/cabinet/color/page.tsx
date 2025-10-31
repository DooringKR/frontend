"use client";

import { CABINET_COLOR_LIST } from "@/constants/colorList";
import { CABINET_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import BoxedInput from "@/components/Input/BoxedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import ColorManualInputGuide from "./_components/ColorManualInputGuide";
import ColorManualInputSheet from "./_components/ColorManualInputSheet";
import ColorSelectBottomButton from "./_components/ColorSelectBottomButton";
import ColorSelectList from "./_components/ColorSelectList";
import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function CabinetColorListPageContent() {
	const router = useRouter();
	const item = useItemStore(state => state.item);
	const updateItem = useItemStore(state => state.updateItem);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	const colorList = CABINET_COLOR_LIST;
	const filteredColors = colorList.filter(c =>
		c.name.toLowerCase().includes(searchKeyword.toLowerCase()),
	);

	// 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
	useEffect(() => {
		// 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
		setScreenName('cabinet_color');
		const prev = getPreviousScreenName();
		trackView({
			object_type: "screen",
			object_name: null,
			current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
			previous_screen: prev,
		});
	}, []);

	return (
		<div className="flex flex-col pt-[90px]">
			<InitAmplitude />
			<TopNavigator />
			<ProgressBar progress={40} />
			<Header size="Large" title={`${item?.type} 색상을 선택해주세요`} />
			<ColorManualInputGuide
				selectedColor={item?.color || item?.door_color_direct_input || null}
				onClick={() => setIsBottomSheetOpen(true)}
			/>
			{/* <BoxedInput
				type="text"
				className={"px-5 py-3"}
				placeholder="색상 이름으로 검색"
				value={searchKeyword}
				onChange={e => setSearchKeyword(e.target.value)}
			/> */}
			<ColorSelectList
				filteredColors={filteredColors}
				selectedColor={item?.color ?? null}
				setSelectedColor={color => {
					updateItem({
						color: color,
						cabinet_color_direct_input: undefined,
					});
				}}
			/>
			<div className="h-[150px]" />
			<ColorManualInputSheet
				isOpen={isBottomSheetOpen}
				onClose={() => setIsBottomSheetOpen(false)}
				value={item?.cabinet_color_direct_input ?? ""}
				onChange={color => {
					updateItem({
						cabinet_color_direct_input: color,
						color: undefined,
					});
				}}
				type={item?.type || ""}
				onNext={() => {
					if (item?.color || item?.cabinet_color_direct_input) {
						const slug = CABINET_CATEGORY_LIST.find(cat => cat.type === item?.type)?.slug || "";
						trackClick({
							object_type: "button",
							object_name: "confirm",
							current_page: getScreenName(),
							modal_name: null,
						});
						router.push(`/cabinet/${slug}`);
					}
				}}
			/>
			{!isBottomSheetOpen && (
				<ColorSelectBottomButton
					selectedColor={item?.color || item?.cabinet_color_direct_input || null}
					type={item?.category || ""}
					onClick={() => {
						trackClick({
							object_type: "button",
							object_name: "confirm",
							current_page: getScreenName(),
							modal_name: null,
						});
						const slug = CABINET_CATEGORY_LIST.find(cat => cat.type === item?.type)?.slug || "";
						router.push(`/cabinet/${slug}`);
					}}
				/>
			)}
		</div>
	);
}

function CabinetColorListPage() {
	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<CabinetColorListPageContent />
		</Suspense>
	);
}

export default CabinetColorListPage;
