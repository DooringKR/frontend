"use client";

import { DOOR_COLOR_LIST } from "dooring-core-domain/dist/constants/color";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

import ColorScreen from "./_components/ColorScreen";

export default function DoorColorPage() {
    const router = useRouter();
    const type = useItemStore(state => state.item?.type);

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        setScreenName('door_color');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    return (
        <>
            <InitAmplitude />
            <ColorScreen
                title={`${type} 색상을 선택해주세요`}
                colors={DOOR_COLOR_LIST}
                onNext={from => {
                    // 직접 입력 시트의 다음은 원래 보내지 않았다
                    if (from === "list")
                        trackClick({
                            object_type: "button",
                            object_name: "confirm",
                            current_page: getScreenName(),
                            modal_name: null,
                        });
                    router.push(`/door/${DOOR_CATEGORY_LIST.find(cat => cat.type === type)?.slug || ""}`);
                }}
            />
        </>
    );
}
