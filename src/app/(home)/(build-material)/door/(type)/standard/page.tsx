"use client";

import { HingeDirection } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import NormalDoorPreview from "@/components/DoorPreview/NormalDoorPreview";
import PairDoorPreview from "@/components/DoorPreview/PairDoorPreview";
import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import NumberInput from "@/components/form/NumberInput";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import ProgressBar from "@/components/Progress";
import Notice from "@/components/state/Notice";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

import { BORING_OPTIONS, ChooseOrUnknown, ColorField, hasHingeValues, LocationField } from "../../_components/DoorForm";
import { useConfirm } from "@/components/overlay/ConfirmSheet";
import { boringRule, sizeRule } from "./hooks/doorRules";
import { FieldHint } from "@/components/form/Field";

const HINGE_DIRECTION_OPTIONS = [
    { value: HingeDirection.LEFT, label: "좌경첩" },
    { value: HingeDirection.RIGHT, label: "우경첩" },
];

const DOOR_KIND_OPTIONS = [
    { value: "pair" as const, label: "양문", description: "양문 한번에 주문", image: "/img/door-pair/pair.svg" },
    { value: "single" as const, label: "단일문", description: "한쪽 문만 주문", image: "/img/door-pair/single.svg" },
];

export default function StandardDoorPage() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);
    const confirm = useConfirm();

    // 초기값을 itemStore에서 읽어오기 (기본값 없음 - 사용자가 명시적으로 선택해야 함)
    const [boringNum, setBoringNum] = useState<2 | 3 | 4 | null>(item?.boringNum ?? null);
    const [hinge_direction, setHingeDirection] = useState<HingeDirection | null>((item?.hinge_direction as HingeDirection) ?? null);
    const [selectedDoorType, setSelectedDoorType] = useState<"pair" | "single" | null>(
        item?.is_pair_door === true ? "pair" : item?.is_pair_door === false ? "single" : null,
    );
    const [door_width, setDoorWidth] = useState<number | null>(item?.door_width ?? null);
    const [door_height, setDoorHeight] = useState<number | null>(item?.door_height ?? null);
    const [hinge, setHinge] = useState<(number | null)[]>(item?.hinge ?? []);
    const [door_location, setDoorLocation] = useState(item?.door_location ?? "");
    // 모름 = hinge 가 정확히 [null] / 경첩 방향 UNKNOWN
    const [isDontKnowHingeCount, setIsDontKnowHingeCount] = useState(() => !!item?.hinge && item.hinge.length === 1 && item.hinge[0] === null);
    const [isDontKnowHingeDirection, setIsDontKnowHingeDirection] = useState(() => item?.hinge_direction === HingeDirection.UNKNOWN);

    const isPair = selectedDoorType === "pair";
    // 화면 위 → 아래 순서. 양문은 경첩 방향이 없다
    const req = useRequired({
        color: !!(item?.color || item?.door_color_direct_input),
        location: !!door_location,
        kind: selectedDoorType !== null,
        width: sizeRule(door_width, "가로", 1220),
        height: sizeRule(door_height, "세로", 2440),
        count: isDontKnowHingeCount || boringNum !== null,
        direction: isPair || isDontKnowHingeDirection || hinge_direction !== null,
        boring: boringRule(hinge, boringNum, door_height),
    });

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        setScreenName('door_standard');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    // boringNum이 바뀔 때 hinge 길이 자동 조정 (기존 값 유지)
    useEffect(() => {
        if (boringNum !== null && hinge.length !== boringNum) {
            setHinge(Array.from({ length: boringNum }, (_, i) => (hinge && hinge[i] !== undefined ? hinge[i] : null)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boringNum]);

    // 각 필드 변경 시 useItemStore에 저장
    const handleBoringNumChange = (newBoringNum: 2 | 3 | 4) => {
        setBoringNum(newBoringNum);
        const newBoringSize = Array.from({ length: newBoringNum }, (_, i) => (hinge && hinge[i] !== undefined ? hinge[i] : null));
        setHinge(newBoringSize);
        updateItem({ boringNum: newBoringNum, hinge: newBoringSize });
    };

    const handleBoringDirectionChange = (newBoringDirection: HingeDirection | null) => {
        setHingeDirection(newBoringDirection);
        updateItem({ hinge_direction: newBoringDirection });
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

    const setDontKnowDirection = (checked: boolean) => {
        setIsDontKnowHingeDirection(checked);
        handleBoringDirectionChange(checked ? HingeDirection.UNKNOWN : null);
    };

    const num = (v: string) => (v ? Number(v) : null);

    const sizeFields = (widthHint: React.ReactNode) => (
        <>
            <Field label="가로 길이" required fieldRef={req.ref("width")} error={req.error("width")}>
                <NumberInput
                    unit="mm"
                    placeholder="가로 길이를 입력해주세요"
                    aria-invalid={!!req.error("width")}
                    value={door_width}
                    onChange={v => {
                        setDoorWidth(num(v));
                        updateItem({ door_width: num(v) });
                    }}
                />
                {widthHint}
            </Field>
            <Field label="세로 길이" required fieldRef={req.ref("height")} error={req.error("height")}>
                <NumberInput
                    unit="mm"
                    placeholder="세로 길이를 입력해주세요"
                    aria-invalid={!!req.error("height")}
                    value={door_height}
                    onChange={v => {
                        setDoorHeight(num(v));
                        updateItem({ door_height: num(v) });
                    }}
                />
                <FieldHint tone="green">세로 스끼(문틈) 값을 빼고 입력해주세요.</FieldHint>
            </Field>
        </>
    );

    const countField = (
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
    );

    const hingeNotice = (
        <Notice tone="blue" title="경첩 치수 모르면 입력하지 않아도 돼요">
            주문이 접수되면 상담으로 안내해드려요.
        </Notice>
    );
    const countNotice = (
        <Notice tone="blue" title="보링 개수 몰라도 괜찮아요">
            주문이 접수되면 상담으로 안내해드려요.
        </Notice>
    );

    return (
        <div className="flex min-h-screen flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={60} />
            <Header title="일반문 정보를 입력해주세요" />
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
                <Field fieldRef={req.ref("kind")} error={req.error("kind")}>
                    <Choose
                        aria-label="양문 ∙ 단일문"
                        value={selectedDoorType}
                        onChange={v => {
                            setSelectedDoorType(v);
                            // 양문은 경첩 방향이 없다
                            if (v === "pair") {
                                setHingeDirection(null);
                                updateItem({ is_pair_door: true, hinge_direction: null });
                            } else {
                                updateItem({ is_pair_door: false });
                            }
                        }}
                        options={DOOR_KIND_OPTIONS}
                    />
                </Field>

                {selectedDoorType === "single" && (
                    <>
                        {sizeFields(<FieldHint tone="green">가로 스끼(문틈) 값을 빼고 입력해주세요.</FieldHint>)}

                        {/* 세로 길이가 입력된 경우에만 경첩 관련 컴포넌트 표시 */}
                        {door_height !== null && door_height > 0 && (
                            <>
                                {countField}
                                <Field label="경첩 방향" required fieldRef={req.ref("direction")} error={req.error("direction")}>
                                    <ChooseOrUnknown
                                        label="경첩 방향"
                                        options={HINGE_DIRECTION_OPTIONS}
                                        value={hinge_direction === HingeDirection.UNKNOWN ? null : hinge_direction}
                                        onChange={handleBoringDirectionChange}
                                        unknown={isDontKnowHingeDirection}
                                        onUnknownChange={setDontKnowDirection}
                                    />
                                </Field>
                                <Field fieldRef={req.ref("boring")} error={req.error("boring")}>
                                    {/* 경첩 개수도 알고 방향도 아는 경우 (기본 케이스) */}
                                    {!isDontKnowHingeCount && !isDontKnowHingeDirection && boringNum !== null && hinge_direction !== null && (
                                        <>
                                            <div className="flex w-full items-center justify-center pt-5">
                                                <NormalDoorPreview
                                                    DoorWidth={door_width}
                                                    DoorHeight={door_height}
                                                    boringDirection={hinge_direction}
                                                    boringNum={boringNum}
                                                    boringSize={hinge}
                                                    onChangeBoringSize={handleBoringSizeChange}
                                                    doorColor={item?.color ?? ""}
                                                />
                                            </div>
                                            {/* 보링 치수 안내 - 다 넣었으면 표시하지 않음 */}
                                            {hinge.some(h => h === null || h === undefined) && hingeNotice}
                                        </>
                                    )}
                                    {/* 경첩 개수만 모르는 경우 */}
                                    {isDontKnowHingeCount && !isDontKnowHingeDirection && countNotice}
                                </Field>
                            </>
                        )}
                    </>
                )}

                {isPair && (
                    <>
                        {sizeFields(
                            <>
                                <p className="text-[14px] text-gray-600">• 한쪽 문을 기준으로 입력해주세요.</p>
                                <FieldHint tone="green">• 가로 스끼(문틈) 값을 빼고 입력해주세요.</FieldHint>
                            </>,
                        )}

                        {/* 세로 길이가 입력된 경우에만 경첩 관련 컴포넌트 표시 (경첩 방향 제외) */}
                        {door_height !== null && door_height > 0 && (
                            <>
                                {countField}
                                <Field fieldRef={req.ref("boring")} error={req.error("boring")}>
                                    {/* 양문 프리뷰 - 경첩 개수 상관없이 표시 */}
                                    <div className="flex w-full items-center justify-center pt-5">
                                        <PairDoorPreview
                                            DoorWidth={door_width}
                                            DoorHeight={door_height}
                                            boringNum={boringNum}
                                            boringSize={hinge}
                                            onChangeBoringSize={isDontKnowHingeCount ? undefined : handleBoringSizeChange}
                                            doorColor={item?.color ?? ""}
                                            isPreviewOnly={isDontKnowHingeCount}
                                        />
                                    </div>
                                    {!isDontKnowHingeCount && hinge.some(h => h === null || h === undefined) && hingeNotice}
                                    {isDontKnowHingeCount && countNotice}
                                </Field>
                            </>
                        )}
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
                        router.push("/door/standard/additional");
                    }}
                >
                    다음
                </Button>
            </BottomBar>
            {confirm.sheet}
        </div>
    );
}
