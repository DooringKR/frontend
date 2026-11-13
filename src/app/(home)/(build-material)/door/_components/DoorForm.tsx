"use client";

import { Location } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useEffect, useId, useState } from "react";

import Choose, { type ChooseOption } from "@/components/form/Choose";
import Field from "@/components/form/Field";
import NavRow from "@/components/nav/NavRow";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useItemStore from "@/store/itemStore";
import formatColor from "@/utils/formatColor";

/** 문·롱문 입력 화면이 같이 쓰는 칸들 — 색상(색 화면으로 이동)·용도 장소·값 고르기+모름·칸 밑 안내·지우기 확인 */

type FieldSlot = { fieldRef?: (el: HTMLElement | null) => void; error?: string };

export const LOCATION_OPTIONS: ChooseOption<Location>[] = [Location.KITCHEN, Location.SHOES, Location.BUILT_IN, Location.BALCONY, Location.ETC].map(
    (l) => ({ value: l, label: l }),
);

export const BORING_OPTIONS: ChooseOption<"2" | "3" | "4">[] = (["2", "3", "4"] as const).map((v) => ({ value: v, label: `${v}개` }));

/** 경첩 치수 중 하나라도 넣었는지(모름·개수 바꾸기로 지울 때 묻는다) */
export const hasHingeValues = (hinge: (number | null)[] | undefined) => !!hinge?.some((h) => h != null);

export function ColorField({ fieldRef, error, onClick }: FieldSlot & { onClick: () => void }) {
    const item = useItemStore((s) => s.item);
    const text = formatColor(item?.color ?? "") || item?.door_color_direct_input || "";
    return (
        <Field label="색상" required fieldRef={fieldRef} error={error}>
            <NavRow card label={text || "색상을 선택해주세요"} onClick={onClick} />
        </Field>
    );
}

export function LocationField({ value, onChange, fieldRef, error }: FieldSlot & { value: string; onChange: (v: Location) => void }) {
    return (
        <Field label="용도 ∙ 장소" required fieldRef={fieldRef} error={error}>
            <Choose aria-label="용도 ∙ 장소" value={(value || null) as Location | null} onChange={onChange} options={LOCATION_OPTIONS} />
        </Field>
    );
}

/** 값 고르기 + 오른쪽 「모름」 — 모름이면 고르기를 막고 그 칸은 채운 것으로 친다(검사는 화면의 useRequired) */
export function ChooseOrUnknown<V extends string>({
    label,
    options,
    value,
    onChange,
    unknown,
    onUnknownChange,
}: {
    label: string;
    options: ChooseOption<V>[];
    value: V | null;
    onChange: (v: V) => void;
    unknown: boolean;
    onUnknownChange: (v: boolean) => void;
}) {
    const id = useId();
    return (
        <div className="flex items-center gap-5">
            <Choose
                aria-label={label}
                className="flex-1"
                value={unknown ? null : value}
                onChange={onChange}
                options={options.map((o) => ({ ...o, disabled: unknown || o.disabled }))}
            />
            <div className="flex shrink-0 items-center gap-2">
                <Checkbox id={id} checked={unknown} onCheckedChange={(v) => onUnknownChange(v === true)} />
                <Label htmlFor={id} className="text-[16px] text-gray-700">
                    모름
                </Label>
            </div>
        </div>
    );
}


/** itemStore(persist) 를 다 읽었는지 — 읽기 전엔 Loading, 읽었는데 비었으면 EmptyState 로 가른다 */
export function useItemHydrated() {
    const [done, setDone] = useState(false);
    useEffect(() => {
        if (useItemStore.persist.hasHydrated()) setDone(true);
        else return useItemStore.persist.onFinishHydration(() => setDone(true));
    }, []);
    return done;
}
