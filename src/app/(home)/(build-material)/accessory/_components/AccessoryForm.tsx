"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import useItemStore from "@/store/itemStore";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

/** 부속(쿡탑·후드·개수대) 정보 — 세 화면이 화면 이름만 다른 복사본이라 하나로. 값은 칠 때마다 itemStore 에 */
export default function AccessoryForm({ screen }: { screen: string }) {
    const router = useRouter();
    const item = useItemStore((s) => s.item);
    const set = useItemStore((s) => s.updateItem);
    const req = useRequired({ madeby: !!item?.accessory_madeby?.trim(), model: !!item?.accessory_model?.trim() });

    useEffect(() => {
        setScreenName(screen);
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
            previous_screen: getPreviousScreenName(),
        });
    }, [screen]);

    return (
        <div className="flex flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={60} />
            <Header size="Large" title={`${item?.type} 종류를 선택해주세요`} />
            <div className="h-5" />
            <div className="flex flex-col gap-5 px-5">
                <Field label="제조사" required fieldRef={req.ref("madeby")} error={req.error("madeby")}>
                    <Input
                        placeholder="제조사를 입력해주세요"
                        aria-invalid={!!req.error("madeby")}
                        value={item?.accessory_madeby ?? ""}
                        onChange={(e) => set({ accessory_madeby: e.target.value })}
                    />
                </Field>
                <Field label="모델명" required fieldRef={req.ref("model")} error={req.error("model")}>
                    <Input
                        placeholder="모델명을 입력해주세요"
                        aria-invalid={!!req.error("model")}
                        value={item?.accessory_model ?? ""}
                        onChange={(e) => set({ accessory_model: e.target.value })}
                    />
                </Field>
                <Field label="제작 시 요청사항">
                    <Input placeholder="제작 시 요청사항을 입력해주세요" value={item?.request ?? ""} onChange={(e) => set({ request: e.target.value })} />
                </Field>
            </div>
            <div className="h-[100px]" />
            <BottomBar>
                <Button
                    onClick={() => {
                        if (!req.check()) return;
                        trackClick({ object_type: "button", object_name: "confirm", current_page: getScreenName(), modal_name: null });
                        router.push("/accessory/report");
                    }}
                >
                    다음
                </Button>
            </BottomBar>
        </div>
    );
}
