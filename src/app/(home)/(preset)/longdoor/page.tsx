"use client";

import { DOOR_COLOR_LIST } from "dooring-core-domain/dist/constants/color";
import { CabinetHandleType, HingeDirection } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import NormalDoorPreview from "@/components/DoorPreview/NormalDoorPreview";
import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import NumberInput from "@/components/form/NumberInput";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import ProgressBar from "@/components/Progress";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import Notice from "@/components/state/Notice";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useItemStore from "@/store/itemStore";

import {
    BORING_OPTIONS,
    ChooseOrUnknown,
    ColorField,
    hasHingeValues,
    LocationField,
} from "@/app/(home)/(build-material)/door/_components/DoorForm";
import { useConfirm } from "@/components/overlay/ConfirmSheet";
import { boringRule, sizeRule } from "@/app/(home)/(build-material)/door/(type)/standard/hooks/doorRules";
import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";
import { imageSrc } from "@/lib/utils";
import { FieldHint } from "@/components/form/Field";

// 문짝 개별 속성 타입 정의 (보링은 문별 입력)
type DoorItem = {
    door_width: number | null;
    hinge_direction: HingeDirection | null;
    boringNum?: 2 | 3 | 4 | null;
    hinge?: (number | null)[];
};

const HANDLE_OPTIONS = [CabinetHandleType.OUTER, CabinetHandleType.PUSH, CabinetHandleType.SMART_BAR].map(v => ({ value: v, label: v }));
const LAST_DIRECTION_OPTIONS = [
    { value: HingeDirection.LEFT, label: "좌경첩" },
    { value: HingeDirection.RIGHT, label: "우경첩" },
];
type BoringValue = "2" | "3" | "4";
const toBoringValue = (n: 2 | 3 | 4 | null | undefined) => (n == null ? null : (String(n) as BoringValue));

export default function LongDoorPage() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);
    const confirm = useConfirm();

    const selectedDoorColorName = item?.color ?? null;
    const selectedDoorColorImage =
        selectedDoorColorName ? imageSrc(DOOR_COLOR_LIST.find(c => c.name === selectedDoorColorName)?.image) : undefined;

    // 문짝 수량(기본 1)
    const [quantity, setQuantity] = useState<number>(item?.quantity ?? 1);

    // doors 배열 초기화: 공통 보링은 item에만 두고, 문별는 override 있을 때만 doors에 저장
    const initializeDoors = (qty: number): DoorItem[] => {
        const existingDoors = item?.doors as DoorItem[] | undefined;
        if (existingDoors && Array.isArray(existingDoors) && existingDoors.length === qty) {
            return existingDoors.map(d => ({ ...d, boringNum: d.boringNum, hinge: d.hinge }));
        }
        const defaultWidth = item?.door_width ?? null;
        const defaultDirection = (item?.hinge_direction as HingeDirection) ?? null;
        return Array.from({ length: qty }, (_, idx) => ({
            door_width: idx === 0 ? defaultWidth : null,
            hinge_direction: idx === 0 ? defaultDirection : null,
            // boringNum, hinge 없음 → 공통값 사용
        }));
    };

    const [doors, setDoors] = useState<DoorItem[]>(() => initializeDoors(item?.quantity ?? 1));

    // 선택된 문 인덱스 (미리보기에서 클릭한 문)
    const [selectedDoorIndex, setSelectedDoorIndex] = useState<number | null>(null);

    const canSelectLastDoorHingeDirection = quantity % 2 === 1;

    useEffect(() => {
        setScreenName("preset_longdoor");
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    // 롱문은 양문 선택 옵션을 제공하지 않으므로 항상 단문으로 고정
    useEffect(() => {
        if (item?.is_pair_door) {
            updateItem({ is_pair_door: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 수량 변경 시 doors 배열 동기화 및 store에 저장
    useEffect(() => {
        // 1~10 범위 고정
        const clamped = Math.min(10, Math.max(1, quantity));
        if (clamped !== quantity) {
            setQuantity(clamped);
            return;
        }

        // doors 배열 크기 조정 (문별 보링 override는 해당 인덱스에만 유지)
        // 좌/우 번갈아 고정, 홀수 개일 때 마지막 문만 고른 값(모름 포함) 유지
        const newDoors: DoorItem[] = Array.from({ length: clamped }, (_, idx) => {
            const isLastDoor = idx === clamped - 1;
            const existingDoor = doors[idx];
            const hasBoringOverride = existingDoor?.boringNum !== undefined || (existingDoor?.hinge && existingDoor.hinge.length > 0);
            const hingeDir = !isLastDoor || clamped % 2 === 0
                ? (idx % 2 === 0 ? HingeDirection.LEFT : HingeDirection.RIGHT)
                : (existingDoor?.hinge_direction ?? (idx % 2 === 0 ? HingeDirection.LEFT : HingeDirection.RIGHT));
            const base: DoorItem = {
                door_width: existingDoor?.door_width ?? doors[0]?.door_width ?? null,
                hinge_direction: hingeDir,
            };
            if (hasBoringOverride) {
                base.boringNum = existingDoor?.boringNum ?? null;
                base.hinge = existingDoor?.hinge ?? [];
            }
            return base;
        });

        setDoors(newDoors);
        updateItem({ quantity: clamped, doors: newDoors });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quantity]);

    const [door_height, setDoorHeight] = useState<number | null>(item?.door_height ?? null);
    const [door_location, setDoorLocation] = useState(item?.door_location ?? "");

    // 손잡이 종류 상태 관리
    const [handleType, setHandleType] = useState<CabinetHandleType | "">(
        item && item.handleType && Object.values(CabinetHandleType).includes(item.handleType as CabinetHandleType)
            ? (item.handleType as CabinetHandleType)
            : ""
    );
    // 겉손잡이(OUTER) 선택 시 직접 입력값
    const [handle_type_direct_input, setHandleTypeDirectInput] = useState<string>(item?.handle_type_direct_input ?? "");

    // 공통 보링 (item에 저장, 문 선택 시 개별 override 가능)
    const commonBoringNum = (item?.boringNum as 2 | 3 | 4 | null) ?? null;
    const commonHinge = (Array.isArray(item?.hinge) ? item.hinge : []) as (number | null)[];
    const isCommonDontKnowHingeCount = commonHinge.length === 1 && commonHinge[0] === null;

    // 문별 실제 보링: override 있으면 door 값, 없으면 공통값
    const getEffectiveBoring = (doorIndex: number) => {
        const d = doors[doorIndex];
        const hasOverride = d?.boringNum !== undefined || (d?.hinge && d.hinge.length > 0);
        if (hasOverride) return { boringNum: d?.boringNum ?? null, hinge: d?.hinge ?? [] };
        return { boringNum: commonBoringNum, hinge: commonHinge };
    };
    const hasDoorBoringOverride = (doorIndex: number) => {
        const d = doors[doorIndex];
        return d?.boringNum !== undefined || (!!d?.hinge && d.hinge.length > 0);
    };
    const isDoorDontKnowHingeCount = (doorIndex: number) => {
        const h = getEffectiveBoring(doorIndex).hinge;
        return h.length === 1 && h[0] === null;
    };
    // 보링 개수를 골랐거나(치수 칸 수가 맞게) 모름이면 됨
    const boringOk = (doorIndex: number) => {
        const { boringNum, hinge } = getEffectiveBoring(doorIndex);
        return (hinge.length === 1 && hinge[0] === null) || (boringNum != null && hinge.length === boringNum);
    };

    const firstDoorHingeDirection = doors[0]?.hinge_direction ?? null;
    const lastDoorHingeDirection = doors[quantity - 1]?.hinge_direction ?? null;
    // 마지막 문 경첩 방향 「모름」 = 그 문만 UNKNOWN(전엔 모든 문을 UNKNOWN 으로 덮고, 그 값 때문에 다음이 영영 막혔다)
    const isDontKnowLastDirection = lastDoorHingeDirection === HingeDirection.UNKNOWN;
    const effectiveFirst = getEffectiveBoring(0);
    const firstWidth = sizeRule(doors[0]?.door_width ?? null, "가로", 1220);
    const badBoringDoor = doors.findIndex((_, i) => !boringOk(i));

    // 화면 위 → 아래 순서
    const req = useRequired({
        color: !!(item?.color || item?.door_color_direct_input),
        location: !!door_location,
        handle: !!handleType,
        width: firstWidth !== true ? firstWidth : doors.every(d => !!d.door_width) || "가로 길이를 넣지 않은 문이 있어요",
        height: sizeRule(door_height, "세로", 2440),
        boring:
            badBoringDoor === -1
                ? boringRule(effectiveFirst.hinge, effectiveFirst.boringNum, door_height)
                : hasDoorBoringOverride(badBoringDoor)
                  ? `${badBoringDoor + 1}번 문 보링 개수를 골라 주세요`
                  : false,
        direction: doors.every(d => d.hinge_direction !== null),
    });

    const saveDoors = (newDoors: DoorItem[]) => {
        setDoors(newDoors);
        updateItem({ doors: newDoors });
    };
    const setDoor = (doorIndex: number, patch: Partial<DoorItem>) =>
        saveDoors(doors.map((d, i) => (i === doorIndex ? { ...d, ...patch } : d)));

    // 공통 보링 변경 (모든 문에 기본 적용, 개별 override 있는 문만 제외)
    const handleCommonBoringNumChange = (newBoringNum: 2 | 3 | 4) => {
        const newHinge = Array.from({ length: newBoringNum }, (_, i) => (commonHinge[i] !== undefined ? commonHinge[i] : null));
        updateItem({ boringNum: newBoringNum, hinge: newHinge });
    };
    const setCommonDontKnowHingeCount = (checked: boolean) => {
        const apply = () => updateItem({ hinge: checked ? [null] : [], boringNum: null });
        if (checked && hasHingeValues(commonHinge)) confirm.ask("넣은 공통 경첩 치수를 지울까요?", apply);
        else apply();
    };

    // 문별 보링 override (해당 문만 개별 적용)
    const handleBoringNumChange = (doorIndex: number, newBoringNum: 2 | 3 | 4) => {
        const prev = getEffectiveBoring(doorIndex).hinge;
        setDoor(doorIndex, {
            boringNum: newBoringNum,
            hinge: Array.from({ length: newBoringNum }, (_, i) => (prev[i] !== undefined ? prev[i] : null)),
        });
    };
    const setDoorDontKnowHingeCount = (doorIndex: number, checked: boolean) => {
        const apply = () => setDoor(doorIndex, { hinge: checked ? [null] : [], boringNum: null });
        if (checked && hasHingeValues(getEffectiveBoring(doorIndex).hinge)) confirm.ask(`${doorIndex + 1}번 문에 넣은 경첩 치수를 지울까요?`, apply);
        else apply();
    };
    const clearDoorBoringOverride = (doorIndex: number) => {
        const apply = () =>
            saveDoors(
                doors.map((d, i) => {
                    if (i !== doorIndex) return d;
                    const { boringNum, hinge, ...rest } = d;
                    return rest as DoorItem;
                }),
            );
        const own = getEffectiveBoring(doorIndex);
        // 공통값과 같으면 지울 것이 없다
        if (JSON.stringify([own.boringNum, own.hinge]) === JSON.stringify([commonBoringNum, commonHinge])) apply();
        else confirm.ask(`${doorIndex + 1}번 문에 따로 넣은 보링 값을 지우고 공통값을 쓸까요?`, apply, { confirmLabel: "공통값 사용" });
    };
    const setDoorBoringFromCommon = (doorIndex: number) => {
        if (commonBoringNum !== null && commonHinge.length === commonBoringNum) {
            setDoor(doorIndex, { boringNum: commonBoringNum, hinge: [...commonHinge] });
        } else if (isCommonDontKnowHingeCount) {
            setDoor(doorIndex, { boringNum: null, hinge: [null] });
        } else {
            setDoor(doorIndex, { boringNum: commonBoringNum, hinge: [...commonHinge] });
        }
    };

    // 마지막 문의 경첩 방향 변경 (마지막 문만 선택 가능)
    const handleLastDoorHingeDirectionChange = (newDirection: HingeDirection | null) => setDoor(quantity - 1, { hinge_direction: newDirection });

    // 가로 길이 일괄 입력: 모든 문에 동일 값 적용
    const handleBulkDoorWidthChange = (newWidth: number | null) => saveDoors(doors.map(d => ({ ...d, door_width: newWidth })));

    // 문 수 줄이기 — 마지막 문에 따로 넣은 값(가로 길이·보링)이 있으면 지우기 전에 묻는다
    const decreaseQuantity = () => {
        if (quantity <= 1) return;
        const last = quantity - 1;
        const own = hasDoorBoringOverride(last) || (doors[last]?.door_width ?? null) !== (doors[0]?.door_width ?? null);
        const apply = () => {
            if (selectedDoorIndex === last) setSelectedDoorIndex(null);
            setQuantity(q => Math.max(1, q - 1));
        };
        if (own) confirm.ask(`${last + 1}번 문에 따로 넣은 값을 지울까요?`, apply);
        else apply();
    };

    // 손잡이 종류·직접입력 변경 시 store에 저장
    useEffect(() => {
        updateItem({ handleType, handle_type_direct_input: handleType === CabinetHandleType.OUTER ? handle_type_direct_input : "" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleType, handle_type_direct_input]);

    const num = (v: string) => (v ? Number(v) : null);

    return (
        <div className="flex min-h-screen flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={60} />
            <Header title={"롱문 정보를 입력해주세요"} />
            <div className="flex flex-1 flex-col gap-5 px-5">
                <ColorField fieldRef={req.ref("color")} error={req.error("color")} onClick={() => router.push("/longdoor/color")} />
                <LocationField
                    value={door_location}
                    onChange={v => {
                        setDoorLocation(v);
                        updateItem({ door_location: v });
                    }}
                    fieldRef={req.ref("location")}
                    error={req.error("location")}
                />

                <Field label="손잡이 종류" required fieldRef={req.ref("handle")} error={req.error("handle")}>
                    <Choose aria-label="손잡이 종류" value={handleType || null} onChange={setHandleType} options={HANDLE_OPTIONS} />
                    {handleType === CabinetHandleType.OUTER && (
                        <Input
                            aria-label="겉손잡이 종류"
                            placeholder="겉손잡이 종류를 적어주세요"
                            value={handle_type_direct_input}
                            onChange={e => setHandleTypeDirectInput(e.target.value)}
                        />
                    )}
                </Field>

                {/* 문짝 개수 */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
                    <div className="text-[16px]/[22px] font-600 text-gray-800">문짝 개수</div>
                    <QuantitySelector
                        quantity={quantity}
                        trashable={false}
                        onDecrease={decreaseQuantity}
                        onIncrease={() => setQuantity(q => Math.min(10, q + 1))}
                    />
                </div>

                <Field label="문 1개의 가로 길이" required fieldRef={req.ref("width")} error={req.error("width")}>
                    <NumberInput
                        unit="mm"
                        placeholder="가로 길이를 입력해주세요"
                        aria-invalid={!!req.error("width")}
                        value={doors[0]?.door_width ?? null}
                        onChange={v => handleBulkDoorWidthChange(num(v))}
                    />
                    <FieldHint tone="green">가로 스끼(문틈) 값을 빼고 입력해주세요. 문을 클릭하면 해당 문만 개별 수정할 수 있어요</FieldHint>
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

                {/* 보링(경첩 구멍) 개수·치수 — 공통 입력(기본), 문 클릭 시 해당 문만 개별 수정 가능 */}
                {door_height != null && door_height > 0 && (
                    <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <Field label="보링(경첩 구멍) 개수 · 치수" required fieldRef={req.ref("boring")} error={req.error("boring")}>
                            <p className="text-[14px] text-gray-500">모든 문에 공통으로 적용돼요. 문을 클릭하면 해당 문만 개별 수정할 수 있어요.</p>
                            <ChooseOrUnknown
                                label="공통 보링 개수"
                                options={BORING_OPTIONS}
                                value={toBoringValue(commonBoringNum)}
                                onChange={v => handleCommonBoringNumChange(Number(v) as 2 | 3 | 4)}
                                unknown={isCommonDontKnowHingeCount}
                                onUnknownChange={setCommonDontKnowHingeCount}
                            />
                            {!isCommonDontKnowHingeCount && commonBoringNum !== null && firstDoorHingeDirection !== null && (
                                <div className="flex w-full items-center justify-center pt-2">
                                    <NormalDoorPreview
                                        boringDirection={firstDoorHingeDirection}
                                        boringNum={commonBoringNum}
                                        boringSize={commonHinge}
                                        onChangeBoringSize={newHinge => updateItem({ hinge: newHinge })}
                                        doorColor={item?.color ?? ""}
                                    />
                                </div>
                            )}
                            {!isCommonDontKnowHingeCount && commonHinge.some(h => h === null || h === undefined) && commonBoringNum != null && (
                                <Notice tone="blue" title="경첩 치수 모르면 입력하지 않아도 돼요">
                                    주문이 접수되면 상담으로 안내해드려요.
                                </Notice>
                            )}
                            {isCommonDontKnowHingeCount && (
                                <Notice tone="blue" title="보링 개수 몰라도 괜찮아요">
                                    주문이 접수되면 상담으로 안내해드려요.
                                </Notice>
                            )}
                        </Field>
                    </div>
                )}

                {/* 문짝 미리보기(5개씩 2줄 배치) */}
                <div className="w-full">
                    <div className="mb-3 flex items-end justify-between">
                        <div className="text-[14px] font-400 text-gray-600 whitespace-pre-line">
                            {"문을 클릭하면 각 문의 가로 길이와 보링 치수를 설정할 수 있어요."}
                        </div>
                        {/* <div className="text-[16px] font-600 text-blue-500 whitespace-pre-line text-right">
                            {"문을 클릭하면\n개별 문의 가로 길이를 설정할 수 있어요."}
                        </div> */}
                    </div>
                    <div className="grid w-full grid-cols-6 gap-1 p-3 rounded-xl border border-gray-300 bg-gray-50">
                        {Array.from({ length: 10 }).map((_, idx) => {
                            const isActive = idx < quantity;
                            const isSelected = selectedDoorIndex === idx;
                            // 미리보기용 표시 규칙:
                            // - 좌/우 번갈아(좌,우,좌,우...)
                            // - 홀수인 경우 마지막 1개는 라벨 표시 안 함
                            // 실제 doors 배열에서 경첩 방향 가져오기
                            const doorHingeDirection = isActive && doors[idx]?.hinge_direction;
                            const hingeLabel = isActive && doorHingeDirection
                                ? (doorHingeDirection === HingeDirection.LEFT ? "좌" : doorHingeDirection === HingeDirection.RIGHT ? "우" : null)
                                : null;
                            const doorWidth = isActive ? doors[idx]?.door_width : null;
                            return (
                                <div
                                    key={idx}
                                    onClick={() => isActive && setSelectedDoorIndex(idx === selectedDoorIndex ? null : idx)}
                                    className={`flex h-[100px] items-stretch justify-center rounded-lg cursor-pointer transition-all duration-200 ${isActive
                                        ? isSelected
                                            ? "bg-white border-2 border-blue-500 shadow-lg scale-[1.03] ring-2 ring-blue-200"
                                            : "bg-white border border-gray-300 hover:border-blue-300 hover:shadow-md"
                                        : "bg-gray-100 border border-gray-200 opacity-50"
                                        }`}
                                >
                                    <div
                                        className={`relative h-full w-full rounded-md ${isActive ? "bg-white" : "bg-gray-100"}`}
                                        style={
                                            isActive && selectedDoorColorImage
                                                ? {
                                                    backgroundImage: `url(${selectedDoorColorImage})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                }
                                                : undefined
                                        }
                                    >
                                        {doorWidth != null && (
                                            <div className="absolute inset-x-0 top-1 flex items-center justify-center">
                                                <div
                                                    className={`rounded-md px-1.5 py-[2px] text-[11px] font-600 ${isSelected ? "bg-blue-50 text-blue-700" : "bg-white/90 text-gray-800"
                                                        }`}
                                                >
                                                    {doorWidth}mm
                                                </div>
                                            </div>
                                        )}
                                        {hingeLabel && (
                                            <div className="absolute inset-x-0 bottom-1 flex items-center justify-center">
                                                <div
                                                    className={`rounded-md px-2 py-[2px] text-[16px] font-700 ${isSelected ? "bg-blue-50 text-blue-700" : "bg-white/80 text-gray-800"
                                                        }`}
                                                >
                                                    {hingeLabel}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-2 text-[12px]/[16px] font-400 text-gray-500">
                        최소 1개 ~ 최대 10개까지 선택할 수 있어요.
                    </div>
                </div>

                {/* 선택된 문 상세 보기 */}
                {selectedDoorIndex !== null && selectedDoorIndex < quantity && (
                    <div className="w-full rounded-2xl border-2 border-blue-300 bg-blue-50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="text-[16px] font-700 text-blue-800">{selectedDoorIndex + 1}번 문 상세 정보</div>
                            <Button variant="link" size="sm" onClick={() => setSelectedDoorIndex(null)}>
                                닫기
                            </Button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {/* 선택된 문 크게 보기 */}
                            <div className="flex items-center justify-center rounded-lg bg-white p-6">
                                {/* 겹침 방지: 레이아웃을 분리해서 세로 라벨이 절대 겹치지 않게 처리 */}
                                <div className="flex flex-col items-center gap-2">
                                    {/* 문 그림이 화면 정가운데 오도록 좌/우 동일 폭 스페이서 사용 */}
                                    <div className="grid grid-cols-[60px_auto_60px] items-center gap-3">
                                        <div />
                                        <div
                                            className="relative flex h-[200px] w-[120px] items-center justify-center overflow-hidden rounded-md border-2 border-gray-300 bg-white"
                                            style={
                                                selectedDoorColorImage
                                                    ? {
                                                        backgroundImage: `url(${selectedDoorColorImage})`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center",
                                                    }
                                                    : undefined
                                            }
                                        >
                                            {/* 경첩 방향 표시는 그림 안에만 노출 */}
                                            <div className="absolute inset-x-0 bottom-2 flex items-center justify-center">
                                                <div className="rounded-md bg-white/85 px-2 py-[2px] text-[13px] font-700 text-gray-800">
                                                    {doors[selectedDoorIndex]?.hinge_direction === HingeDirection.LEFT
                                                        ? "좌경"
                                                        : doors[selectedDoorIndex]?.hinge_direction === HingeDirection.RIGHT
                                                            ? "우경"
                                                            : "미설정"}
                                                </div>
                                            </div>
                                        </div>
                                        {/* 세로 길이: 그림 우측에 별도 영역으로 고정 (우측 칼럼) */}
                                        <div className="flex h-[200px] w-[60px] items-center justify-center">
                                            {door_height ? (
                                                <div className="rounded-md bg-white/85 px-2 py-1 text-[12px] font-700 text-gray-800">
                                                    {door_height}mm
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* 가로 길이: 그림 아래 별도 영역 */}
                                    {doors[selectedDoorIndex]?.door_width ? (
                                        <div className="rounded-md bg-white/85 px-2 py-1 text-[12px] font-700 text-gray-800">
                                            {doors[selectedDoorIndex]!.door_width}mm
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            {/* 선택된 문 정보 */}
                            <div className="flex flex-col gap-3 rounded-lg bg-white p-3">
                                <Field label="가로 길이" required>
                                    <NumberInput
                                        unit="mm"
                                        placeholder="가로 길이를 입력해주세요"
                                        value={doors[selectedDoorIndex]?.door_width ?? null}
                                        onChange={v => setDoor(selectedDoorIndex, { door_width: num(v) })}
                                    />
                                </Field>
                                {/* 이 문의 보링: 공통값 사용 중이면 개별 수정만 가능하게, 개별 입력 중이면 공통값 사용 버튼 */}
                                <Field label="이 문의 보링" className="border-t border-gray-200 pt-3">
                                    {!hasDoorBoringOverride(selectedDoorIndex) ? (
                                        <div className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2">
                                            <span className="text-[14px] text-gray-600">공통값 사용 중</span>
                                            <Button variant="link" size="sm" onClick={() => setDoorBoringFromCommon(selectedDoorIndex)}>
                                                개별 수정
                                            </Button>
                                        </div>
                                    ) : (
                                        (() => {
                                            const idx = selectedDoorIndex;
                                            const eff = getEffectiveBoring(idx);
                                            const isDontKnow = isDoorDontKnowHingeCount(idx);
                                            const hingeDir = doors[idx]?.hinge_direction ?? null;
                                            return (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[14px] text-gray-600">개별 입력 중</span>
                                                        <Button variant="link" size="sm" onClick={() => clearDoorBoringOverride(idx)}>
                                                            공통값 사용
                                                        </Button>
                                                    </div>
                                                    <ChooseOrUnknown
                                                        label={`${idx + 1}번 문 보링 개수`}
                                                        options={BORING_OPTIONS}
                                                        value={toBoringValue(eff.boringNum)}
                                                        onChange={v => handleBoringNumChange(idx, Number(v) as 2 | 3 | 4)}
                                                        unknown={isDontKnow}
                                                        onUnknownChange={checked => setDoorDontKnowHingeCount(idx, checked)}
                                                    />
                                                    {!isDontKnow && eff.boringNum !== null && hingeDir !== null && (
                                                        <div className="flex w-full items-center justify-center pt-2">
                                                            <NormalDoorPreview
                                                                boringDirection={hingeDir}
                                                                boringNum={eff.boringNum}
                                                                boringSize={eff.hinge}
                                                                onChangeBoringSize={size => setDoor(idx, { hinge: size })}
                                                                doorColor={item?.color ?? ""}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()
                                    )}
                                </Field>
                            </div>
                        </div>
                    </div>
                )}

                {door_height !== null && door_height > 0 && canSelectLastDoorHingeDirection && (
                    <Field label="마지막 문 경첩 방향" required fieldRef={req.ref("direction")} error={req.error("direction")}>
                        <ChooseOrUnknown
                            label="마지막 문 경첩 방향"
                            options={LAST_DIRECTION_OPTIONS}
                            value={isDontKnowLastDirection ? null : lastDoorHingeDirection}
                            onChange={handleLastDoorHingeDirectionChange}
                            unknown={isDontKnowLastDirection}
                            onUnknownChange={checked => handleLastDoorHingeDirectionChange(checked ? HingeDirection.UNKNOWN : null)}
                        />
                    </Field>
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
                        router.push("/longdoor/additional");
                    }}
                >
                    다음
                </Button>
            </BottomBar>
            {confirm.sheet}
        </div>
    );
}
