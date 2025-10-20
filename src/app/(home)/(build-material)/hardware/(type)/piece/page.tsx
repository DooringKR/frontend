
"use client";

import { useRouter } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import BoxedInput from "@/components/Input/BoxedInput";
import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName } from "@/utils/screenName";

function PiecePageContent() {
	const router = useRouter();
	const item = useItemStore(state => state.item);
	const updateItem = useItemStore(state => state.updateItem);
	const color = item?.color ?? "";
	const size = item?.size ?? "";
	const request = item?.request ?? "";

	// 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
	useEffect(() => {
		// 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
		setScreenName('hardware_piece');
		const prev = getPreviousScreenName();
		trackView({
			object_type: "screen",
			object_name: null,
			current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
			previous_screen: prev,
		});
	}, []);

	return (
		<div className="flex flex-col">
			<InitAmplitude />
			<TopNavigator />
			<Header title="피스 정보를 입력해주세요" />
			<div className="h-5" />
			<div className="flex flex-col gap-5 px-5">
				<BoxedInput
					label="색상"
					placeholder="색상을 입력해주세요"
					value={color}
					onChange={e => updateItem({ color: e.target.value })}
				/>
				<BoxedInput
					label="사이즈"
					placeholder="사이즈를 입력해주세요"
					value={size}
					onChange={e => updateItem({ size: e.target.value })}
				/>
				<BoxedInput
					label="제작 시 요청사항"
					placeholder="제작 시 요청사항을 입력해주세요"
					value={request}
					onChange={e => updateItem({ request: e.target.value })}
				/>
			</div>
			<div className="h-[100px]" />
			<div id="hardware-next-button">
				<BottomButton
					type={"1button"}
					button1Text={"다음"}
					className="fixed bottom-0 w-full max-w-[460px]"
					button1Disabled={color === "" || size === ""}
					onButton1Click={() => {
						router.push(`/hardware/report`);
					}}
				/>
			</div>
		</div>
	);
}

function PiecePage() {
	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<PiecePageContent />
		</Suspense>
	);
}

export default PiecePage;
