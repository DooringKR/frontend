"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import FlapDoorPreview from "@/components/DoorPreview/FlapDoorPreview";
import Field from "@/components/form/Field";
import NumberInput from "@/components/form/NumberInput";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import ProgressBar from "@/components/Progress/ProgressBar";
import Notice from "@/components/state/Notice";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

import { BORING_OPTIONS, ChooseOrUnknown, ColorField, hasHingeValues, LocationField } from "../../_components/DoorForm";
import { useConfirm } from "@/components/overlay/ConfirmSheet";
import { sizeRule } from "../standard/hooks/doorRules";
import { flapBoringRule } from "./hooks/flapRules";

export default function FlapDoorPage() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);
    const confirm = useConfirm();

    // 초기값을 itemStore에서 읽어오기 (기본값 없음)
    const [boringNum, setBoringNum] = useState<2 | 3 | 4 | null>(item?.boringNum ?? null);
    const [doorWidth, setDoorWidth] = useState<number | null>(item?.door_width ?? null);
    const [doorHeight, setDoorHeight] = useState<number | null>(item?.door_height ?? null);
    const [hinge, setHinge] = useState<(number | null)[]>(item?.hinge ?? []);
    const [door_location, setDoorLocation] = useState(item?.door_location ?? "");
    // 모름 = hinge 가 정확히 [null]
    const [isDontKnowHingeCount, setIsDontKnowHingeCount] = useState(() => !!item?.hinge && item.hinge.length === 1 && item.hinge[0] === null);

    // 플랩문은 가로 2440·세로 1220 까지, 보링은 가로 방향
    const req = useRequired({
        color: !!(item?.color || item?.door_color_direct_input),
        location: !!door_location,
        width: sizeRule(doorWidth, "가로", 2440),
        height: sizeRule(doorHeight, "세로", 1220),
        count: isDontKnowHingeCount || boringNum !== null,
        boring: flapBoringRule(hinge, boringNum, doorWidth),
    });

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        setScreenName('door_flap');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    // boringNum이 변경되면 hinge 배열 길이 맞추기
    useEffect(() => {
        if (boringNum !== null && hinge.length !== boringNum) {
            setHinge(Array.from({ length: boringNum }, (_, i) => (hinge && hinge[i] !== undefined ? hinge[i] : null)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boringNum]);

    const handleBoringNumChange = (newBoringNum: 2 | 3 | 4) => {
        setBoringNum(newBoringNum);
        const newBoringSize = Array.from({ length: newBoringNum }, (_, i) => (hinge && hinge[i] !== undefined ? hinge[i] : null));
        setHinge(newBoringSize);
        updateItem({ boringNum: newBoringNum, hinge: newBoringSize });
    };

    const handleBoringSizeChange = (newBoringSize: (number | null)[]) => {
        setHinge(newBoringSize);
        updateItem({ hinge: newBoringSize });
    };

    const setDontKnowCount = (checked: boolean) => {
        const apply = () => {
            setIsDontKnowHingeCount(checked);
            // 모름 체크: [null] / 해제: 선택 초기화 (사용자가 직접 선택해야 함)
            const next = checked ? [null] : [];
            setHinge(next);
            setBoringNum(null);
            updateItem({ hinge: next, boringNum: null });
        };
        if (checked && hasHingeValues(hinge)) confirm.ask("넣은 경첩 치수를 지울까요?", apply);
        else apply();
    };

    const num = (v: string) => (v ? Number(v) : null);

    return (
        <div className="flex min-h-screen flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={80} />
            <Header title="플랩문 정보를 입력해주세요" />
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

                {/* 세로 길이가 입력된 경우에만 경첩 섹션 표시 */}
                {!!doorHeight && (
                    <>
                        <Field label="보링(경첩 구멍) 개수" required fieldRef={req.ref("count")} error={req.error("count")}>
                            <ChooseOrUnknown
                                label="보링(경첩 구멍) 개수"
                                options={BORING_OPTIONS}
                                value={boringNum === null ? null : (String(boringNum) as "2" | "3" | "4")}
                                onChange={v => handleBoringNumChange(Number(v) as 2 | 3 | 4)}
                                unknown={isDontKnowHingeCount}
                                onUnknownChange={setDontKnowCount}
                            />
                        </Field>
                        <Field fieldRef={req.ref("boring")} error={req.error("boring")}>
                            {!isDontKnowHingeCount && boringNum !== null && (
                                <>
                                    <div className="flex items-center justify-center pt-5">
                                        <FlapDoorPreview
                                            DoorWidth={doorWidth}
                                            DoorHeight={doorHeight}
                                            boringNum={boringNum}
                                            boringSize={hinge}
                                            onChangeBoringSize={handleBoringSizeChange}
                                            doorColor={item?.color ?? ""}
                                        />
                                    </div>
                                    <Notice tone="blue" title="경첩 치수 모르면 입력하지 않아도 돼요">
                                        주문이 접수되면 상담으로 안내해드려요.
                                    </Notice>
                                </>
                            )}
                            {isDontKnowHingeCount && (
                                <Notice tone="blue" title="보링 개수 몰라도 괜찮아요">
                                    주문이 접수되면 상담으로 안내해드려요.
                                </Notice>
                            )}
                        </Field>
                    </>
                )}
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
                        router.push("/door/flap/additional");
                    }}
                >
                    다음
                </Button>
            </BottomBar>
            {confirm.sheet}
        </div>
    );
}
