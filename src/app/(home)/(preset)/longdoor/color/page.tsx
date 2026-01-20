"use client";

import { DOOR_COLOR_LIST } from "@/constants/colorList";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import ColorManualInputGuide from "./_components/ColorManualInputGuide";
import ColorManualInputSheet from "./_components/ColorManualInputSheet";
import ColorSelectBottomButton from "./_components/ColorSelectBottomButton";
import ColorSelectList from "./_components/ColorSelectList";
import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";
import { ProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

function ColorListPageContent() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const colorList = DOOR_COLOR_LIST;
    const filteredColors = colorList.filter(item => item.name.toLowerCase().includes(searchKeyword.toLowerCase()));

    // 롱문 컬러 화면 진입 시 기본값 세팅 + 기본 컬러 자동 선택(1회)
    useEffect(() => {
        // 타입 정보가 없으면 세팅 (기존 값이 있으면 유지)
        if (!item?.category || !item?.type) {
            updateItem({
                category: ProductType.DOOR,
                type: "롱문",
            });
        }

        // 아직 아무 컬러도 없으면 첫번째 컬러를 기본 선택
        if (!item?.color && !item?.door_color_direct_input) {
            const defaultColor = DOOR_COLOR_LIST?.[0]?.name;
            if (defaultColor) {
                updateItem({
                    color: defaultColor,
                    door_color_direct_input: undefined,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     setScreenName("preset_longdoor_color");
    //     const prev = getPreviousScreenName();
    //     trackView({
    //         object_type: "screen",
    //         object_name: null,
    //         current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
    //         previous_screen: prev,
    //     });
    // }, []);

    return (
        <div className="flex flex-col pt-[90px]">
            <TopNavigator />
            <ProgressBar progress={40} />
            <Header size="Large" title={"롱문 색상을 선택해주세요"} />
            <ColorManualInputGuide
                selectedColor={item?.color || item?.door_color_direct_input || null}
                onClick={() => setIsBottomSheetOpen(true)}
            />

            <ColorSelectList
                filteredColors={filteredColors}
                selectedColor={item?.color ?? null}
                setSelectedColor={color => {
                    updateItem({
                        color: color,
                        door_color_direct_input: undefined,
                    });
                }}
            />
            <div className="h-[150px]" />

            <ColorManualInputSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                value={item?.door_color_direct_input ?? ""}
                onChange={color => {
                    updateItem({
                        door_color_direct_input: color,
                        color: undefined,
                    });
                }}
                type={"롱문"}
                onNext={() => {
                    if (item?.color || item?.door_color_direct_input) {
                        router.push(`/longdoor`);
                    }
                }}
            />

            {!isBottomSheetOpen && (
                <ColorSelectBottomButton
                    selectedColor={item?.color || item?.door_color_direct_input || null}
                    type={"롱문"}
                    onClick={() => {
                        router.push(`/longdoor`);
                    }}
                />
            )}
        </div>
    );
}

function ColorListPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <InitAmplitude />
            <ColorListPageContent />
        </Suspense>
    );
}

export default ColorListPage;


