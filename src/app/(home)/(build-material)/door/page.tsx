"use client";

import { ProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { DoorType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Header from "@/components/Header/Header";
import NavTiles from "@/components/nav/NavTiles";
import { useConfirm } from "@/components/overlay/ConfirmSheet";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { DOOR_CATEGORY_LIST } from "@/constants/category";
import useItemStore, { type BaseItem } from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

const label = (type: string) => (type === DoorType.DRAWER ? "서랍 마에다" : type);

/** 종류 말고 넣은 값이 있는지(다른 종류를 고르면 통째로 지워진다) */
const hasInput = (item: BaseItem | null) =>
    !!item &&
    Object.entries(item).some(
        ([k, v]) => k !== "category" && k !== "type" && v != null && v !== "" && v !== false && !(Array.isArray(v) && v.length === 0),
    );

export default function DoorCategoryPage() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const setItem = useItemStore(state => state.setItem);
    const confirm = useConfirm();
    const picked = item?.category === ProductType.DOOR ? (DOOR_CATEGORY_LIST.find(c => c.type === item.type)?.slug ?? null) : null;

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        setScreenName('door');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    const pick = (slug: string) => {
        const category = DOOR_CATEGORY_LIST.find(c => c.slug === slug)!;
        trackClick({
            object_type: "button",
            object_name: category.slug,
            current_page: getScreenName(),
            modal_name: null,
        });
        // 같은 종류면 넣던 값을 그대로 두고 넘어간다. 다른 종류로 바꾸면 넣던 값이 지워져 먼저 묻는다.
        if (picked === slug) return router.push("/door/color");
        const apply = () => {
            setItem({ category: ProductType.DOOR, type: category.type as DoorType });
            router.push("/door/color");
        };
        if (hasInput(item)) confirm.ask("넣은 내용을 지우고 종류를 바꿀까요?", apply, { confirmLabel: "바꾸기" });
        else apply();
    };

    return (
        <div className="flex flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={20} />
            <Header size="Large" title="문 종류를 선택해주세요" />
            <div className="px-5 pb-5 pt-10">
                <NavTiles
                    items={DOOR_CATEGORY_LIST.map(c => ({
                        key: c.slug,
                        label: label(c.type ?? ""),
                        image: c.image,
                        selected: picked === c.slug,
                        onClick: () => pick(c.slug),
                    }))}
                />
            </div>
            {confirm.sheet}
        </div>
    );
}
