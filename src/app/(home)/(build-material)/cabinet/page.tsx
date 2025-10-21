"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import Header from "@/components/Header/Header";
import Image from "next/image";
import { CABINET_CATEGORY_LIST } from "@/constants/category";

import useItemStore from "@/store/itemStore";
import { ProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function CabinetCategoryPage() {
	const router = useRouter();
	const cabinetCategories = CABINET_CATEGORY_LIST;
	const setItem = useItemStore(state => state.setItem);

	// 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('cabinet');
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
			<Header size="Large" title="부분장을 선택해주세요" />
			<div className="grid w-full grid-cols-2 gap-x-3 gap-y-[40px] px-5 pb-5 pt-10">
				{cabinetCategories.map((category) => (
					<div
						key={category.slug}
						className="flex flex-1 cursor-pointer flex-col items-center gap-2"
						onClick={() => {
							trackClick({
								object_type: "button",
								object_name: category.slug,
								current_page: getScreenName(),
								modal_name: null,
							});
							setItem({
								category: ProductType.CABINET,
								type: category.type,
							})
							router.push(`/cabinet/color`);
						}}
					>
						<div className="relative aspect-square w-full">
							<Image
								src={category.image}
								alt={category.type || ''}
								fill
								style={{ objectFit: "contain" }}
								className="w-full h-full object-cover rounded-[28px] border-[2px] border-[rgba(3,7,18,0.05)]"
							/>
						</div>
						<div className="text-center text-[17px]/[24px] font-500 text-gray-500">
							{category.type || ''}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function CabinetPage() {
	return (
		<Suspense fallback={<div>로딩 중...</div>}>
			<CabinetCategoryPage />
		</Suspense>
	);
}

export default CabinetPage;