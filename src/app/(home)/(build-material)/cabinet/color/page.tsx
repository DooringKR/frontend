"use client";

import { CABINET_COLOR_LIST } from "@/constants/colorList";
import { CABINET_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import ColorManualInputGuide from "./_components/ColorManualInputGuide";
import ColorManualInputSheet from "./_components/ColorManualInputSheet";
import ColorSelectBottomButton from "./_components/ColorSelectBottomButton";
import ColorSelectList from "./_components/ColorSelectList";
import useItemStore from "@/store/itemStore";

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

	return (
		<div className="flex flex-col">
			<TopNavigator />
			<Header size="Large" title={`${item?.type} 색상을 선택해주세요`} />
			<BoxedInput
				type="text"
				className={"px-5 py-3"}
				placeholder="색상 이름으로 검색"
				value={searchKeyword}
				onChange={e => setSearchKeyword(e.target.value)}
			/>
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
			<ColorManualInputGuide
				selectedColor={item?.color || item?.cabinet_color_direct_input || null}
				onClick={() => setIsBottomSheetOpen(true)}
			/>
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
						router.push(`/cabinet/${slug}`);
					}
				}}
			/>
			{!isBottomSheetOpen && (
				<ColorSelectBottomButton
					selectedColor={item?.color || item?.cabinet_color_direct_input || null}
					type={item?.category || ""}
					onClick={() => {
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
