"use client";

import { CABINET_COLOR_LIST, OPEN_CABINET_BODY_MATERIAL_LIST } from "dooring-core-domain/dist/constants/color";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import ProgressBar from "@/components/Progress";
import Notice from "@/components/state/Notice";
import { Loading } from "@/components/state/StateViews";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CABINET_CATEGORY_LIST } from "@/constants/category";
import { goBack } from "@/lib/nav/go";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import useItemStore from "@/store/itemStore";
import formatColor from "@/utils/formatColor";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

const DIRECT = "direct";

/**
 * 부분장 색 — 목록에서 고르거나 「직접 입력」(고르면 밑에 글자 칸).
 * 종류 화면의 색 칸에서 왔으면(?back=1) 다음을 누를 때 그 화면으로 돌아간다 — push 로 왕복하면 기록이 쌓인다.
 */
function CabinetColorListPageContent() {
	const router = useRouter();
	const back = useSearchParams().get("back") === "1";
	const item = useItemStore((state) => state.item);
	const updateItem = useItemStore((state) => state.updateItem);
	const direct: string = item?.cabinet_color_direct_input ?? "";
	// 「직접 입력」을 골랐지만 아직 안 친 상태는 저장 모양으로 구분이 안 돼 화면이 들고 있는다
	const [typing, setTyping] = useState(!!direct);
	const colorList = item?.type === "오픈장" ? OPEN_CABINET_BODY_MATERIAL_LIST : CABINET_COLOR_LIST;
	const value = item?.color || (typing ? DIRECT : null);
	const req = useRequired({ color: !!item?.color || !!direct.trim() });

	// 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
	useEffect(() => {
		setScreenName("cabinet_color");
		const prev = getPreviousScreenName();
		trackView({
			object_type: "screen",
			object_name: null,
			current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
			previous_screen: prev,
		});
	}, []);

	const next = () => {
		if (!req.check()) return;
		trackClick({ object_type: "button", object_name: "confirm", current_page: getScreenName(), modal_name: null });
		const href = `/cabinet/${CABINET_CATEGORY_LIST.find((cat) => cat.type === item?.type)?.slug || ""}`;
		if (back) goBack(router, href);
		else router.push(href);
	};

	return (
		<div className="flex flex-col pt-[90px]">
			<InitAmplitude />
			<TopNavigator />
			<ProgressBar progress={40} />
			<Header size="Large" title={`${item?.type} 색상을 선택해주세요`} />
			<div className="flex flex-col gap-5 px-5 pt-5">
				<Notice title="원하는 색상이 없어도 직접 입력할 수 있어요">
					「직접 입력」을 고르고 브랜드, 색상, 두께를 넣어 주시면 확인 후 가능 여부를 안내드릴게요
				</Notice>
				<Field label="색상" required fieldRef={req.ref("color")} error={req.error("color")}>
					<Choose
						aria-label="색상"
						title="색상을 골라 주세요"
						placeholder="색상을 골라 주세요"
						options={[...colorList.map((c) => ({ value: c.name, label: formatColor(c.name) })), { value: DIRECT, label: "직접 입력" }]}
						value={value}
						onChange={(v) => {
							setTyping(v === DIRECT);
							updateItem(v === DIRECT ? { color: undefined } : { color: v, cabinet_color_direct_input: undefined });
						}}
					/>
					{value === DIRECT && (
						<Input
							aria-label="색상 직접 입력"
							placeholder="색상 정보를 입력해주세요"
							value={direct}
							aria-invalid={!!req.error("color")}
							onChange={(e) => updateItem({ cabinet_color_direct_input: e.target.value, color: undefined })}
						/>
					)}
				</Field>
			</div>
			<div className="h-[100px]" />
			<BottomBar>
				<Button onClick={next}>다음</Button>
			</BottomBar>
		</div>
	);
}

function CabinetColorListPage() {
	return (
		<Suspense fallback={<Loading />}>
			<CabinetColorListPageContent />
		</Suspense>
	);
}

export default CabinetColorListPage;
