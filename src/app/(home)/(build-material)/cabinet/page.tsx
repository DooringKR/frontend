"use client";

import { ProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import NavTiles from "@/components/nav/NavTiles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import Header from "@/components/Header/Header";
import ConfirmSheet from "@/components/overlay/ConfirmSheet";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { CABINET_CATEGORY_LIST } from "@/constants/category";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import useItemStore from "@/store/itemStore";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

type Category = (typeof CABINET_CATEGORY_LIST)[number];

/** 부분장 종류 — 고르면 새 부분장으로 시작한다. 색을 이미 고른 부분장이 있으면 지워도 되는지 먼저 묻는다 */
export default function CabinetCategoryPage() {
	const router = useRouter();
	const item = useItemStore((state) => state.item);
	const setItem = useItemStore((state) => state.setItem);
	const [pending, setPending] = useState<Category | null>(null);
	const entered = item?.category === ProductType.CABINET && !!(item.color || item.cabinet_color_direct_input);

	// 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
	useEffect(() => {
		setScreenName("cabinet");
		const prev = getPreviousScreenName();
		trackView({
			object_type: "screen",
			object_name: null,
			current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
			previous_screen: prev,
		});
	}, []);

	const start = (category: Category) => {
		setItem({ category: ProductType.CABINET, type: category.type });
		router.push(`/cabinet/color`);
	};

	return (
		<div className="flex flex-col pt-[90px]">
			<InitAmplitude />
			<TopNavigator />
			<ProgressBar progress={20} />
			<Header size="Large" title="부분장을 선택해주세요" />
			<div className="px-5 pb-5 pt-10">
				<NavTiles
					items={CABINET_CATEGORY_LIST.map((category) => ({
						key: category.slug,
						label: category.type || "",
						image: category.image,
						onClick: () => {
							trackClick({ object_type: "button", object_name: category.slug, current_page: getScreenName(), modal_name: null });
							if (entered) setPending(category);
							else start(category);
						},
					}))}
				/>
			</div>
			<ConfirmSheet
				open={!!pending}
				onOpenChange={(o) => !o && setPending(null)}
				title="입력한 내용을 지울까요?"
				description="부분장 종류를 다시 고르면 지금까지 넣은 색상·치수가 지워져요."
				confirmLabel="지우고 고르기"
				destructive
				onConfirm={() => pending && start(pending)}
			/>
		</div>
	);
}
