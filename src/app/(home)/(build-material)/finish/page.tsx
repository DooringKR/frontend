"use client";

import { ProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import NavTiles from "@/components/nav/NavTiles";
import Header from "@/components/Header/Header";
import ConfirmSheet from "@/components/overlay/ConfirmSheet";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { FINISH_CATEGORY_LIST } from "@/constants/category";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import useItemStore from "@/store/itemStore";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

/** 마감재 종류 — 고르면 바로 색 화면. 같은 종류면 넣던 값을 그대로 두고, 다른 종류로 바꾸면 넣던 값이 지워져 먼저 묻는다 */
export default function FinishCategoryPage() {
    const router = useRouter();
    const [replacing, setReplacing] = useState<string | null>(null);

    useEffect(() => {
        setScreenName("finish");
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
            previous_screen: getPreviousScreenName(),
        });
    }, []);

    const start = (slug: string) => {
        useItemStore.getState().setItem({ category: ProductType.FINISH, type: FINISH_CATEGORY_LIST.find((c) => c.slug === slug)?.type });
        router.push("/finish/color");
    };
    const pick = (slug: string) => {
        trackClick({ object_type: "button", object_name: slug, current_page: getScreenName(), modal_name: null });
        const item = useItemStore.getState().item;
        if (item?.category !== ProductType.FINISH) return start(slug);
        if (item.type === FINISH_CATEGORY_LIST.find((c) => c.slug === slug)?.type) return router.push("/finish/color");
        const filled = Object.entries(item).some(([k, v]) => k !== "category" && k !== "type" && v != null && v !== "");
        return filled ? setReplacing(slug) : start(slug);
    };

    return (
        <div className="flex flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={20} />
            <Header size="Large" title="마감재 종류를 선택해주세요" />
            <div className="px-5 pt-10">
                <NavTiles items={FINISH_CATEGORY_LIST.map((c) => ({ key: c.slug, label: c.type ?? "", image: c.image, onClick: () => pick(c.slug) }))} />
            </div>
            <ConfirmSheet
                open={replacing !== null}
                onOpenChange={(o) => !o && setReplacing(null)}
                title="종류를 바꿀까요?"
                description="입력한 내용이 지워져요."
                confirmLabel="바꾸기"
                onConfirm={() => replacing && start(replacing)}
            />
        </div>
    );
}
