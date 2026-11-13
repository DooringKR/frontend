"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Field from "@/components/form/Field";
import NumberInput from "@/components/form/NumberInput";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

import { ColorField, LocationField } from "../../_components/DoorForm";
import { drawerSizeRules } from "./hooks/drawerRules";

export default function DrawerDoorPage() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    const [doorWidth, setDoorWidth] = useState<number | null>(item?.door_width ?? null);
    const [doorHeight, setDoorHeight] = useState<number | null>(item?.door_height ?? null);
    const [door_location, setDoorLocation] = useState(item?.door_location ?? "");

    const size = drawerSizeRules(doorWidth, doorHeight);
    const req = useRequired({
        color: !!(item?.color || item?.door_color_direct_input),
        location: !!door_location,
        width: size.width,
        height: size.height,
    });

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        setScreenName('door_drawer');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    const num = (v: string) => (v ? Number(v) : null);

    return (
        <div className="flex min-h-screen flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={60} />
            <Header title="서랍 마에다 정보를 입력해주세요" />
            <div className="flex flex-1 flex-col gap-5 px-5">
                <ColorField fieldRef={req.ref("color")} error={req.error("color")} onClick={() => router.push("/door/color")} />
                <LocationField
                    value={door_location}
                    onChange={v => {
                        setDoorLocation(v);
                        updateItem({ door_location: v });
                    }}
                    fieldRef={req.ref("location")}
                    error={req.error("location")}
                />
                <Field label="가로 길이" required fieldRef={req.ref("width")} error={req.error("width")}>
                    <NumberInput
                        unit="mm"
                        placeholder="가로 길이를 입력해주세요"
                        aria-invalid={!!req.error("width")}
                        value={doorWidth}
                        onChange={v => {
                            setDoorWidth(num(v));
                            updateItem({ door_width: num(v) });
                        }}
                    />
                </Field>
                <Field label="세로 길이" required fieldRef={req.ref("height")} error={req.error("height")}>
                    <NumberInput
                        unit="mm"
                        placeholder="세로 길이를 입력해주세요"
                        aria-invalid={!!req.error("height")}
                        value={doorHeight}
                        onChange={v => {
                            setDoorHeight(num(v));
                            updateItem({ door_height: num(v) });
                        }}
                    />
                </Field>
            </div>
            <div className="h-[100px]" />
            <BottomBar>
                <Button
                    onClick={() => {
                        if (!req.check()) return;
                        trackClick({
                            object_type: "button",
                            object_name: "confirm",
                            current_page: getScreenName(),
                            modal_name: null,
                        });
                        router.push("/door/drawer/additional");
                    }}
                >
                    다음
                </Button>
            </BottomBar>
        </div>
    );
}
