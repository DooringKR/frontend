"use client";

import { HingeThickness } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import SelectableOptionCard from "@/components/SelectableOptionCard";
import { Input } from "@/components/ui/input";

/** 브랜드 「모름」 — 몸통 두께 「모름」과 같은 글자. 접수 메모에는 넣지 않는다(request/_lib/flow hingeNote) */
export const BRAND_UNKNOWN = HingeThickness.UNKNOWN;

export const HINGE_THICKNESS_OPTIONS = [
  { value: HingeThickness.FIFTEEN, label: "15T" },
  { value: HingeThickness.EIGHTEEN, label: "18T" },
  { value: HingeThickness.UNKNOWN, label: "모름" },
];

/**
 * 경첩 같이 받기 — 고르면 몸통 두께(필수)가 펼쳐진다. DIY 문짝(DoorAdditional)의 카드를 꺼내
 * 상황 주문 설명 장과 같이 쓴다(2026-11-23 사용자 「경첩도 같이 받을래요를 써서 … 대체」, 「몸통 두께도 놓치지 말고」).
 * brand·onBrandChange 를 넘기면 몸통 두께 밑에 「원하는 경첩 브랜드」(선택) 칸이 더 펼쳐진다(같은 날 사용자 「선택값으로」).
 * 두께가 빈 채 넘어가는 것은 부르는 쪽이 막고 thicknessError 로 알린다(필수값 규칙 — 버튼은 늘 눌리고 첫 빈 칸으로).
 */
export default function HingeAddOn({
  checked,
  onCheckedChange,
  thickness,
  onThicknessChange,
  thicknessRef,
  thicknessError,
  brand,
  onBrandChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  thickness: HingeThickness | null;
  onThicknessChange: (v: HingeThickness) => void;
  thicknessRef?: (el: HTMLDivElement | null) => void;
  thicknessError?: string | null;
  brand?: string;
  onBrandChange?: (v: string) => void;
}) {
  return (
    <SelectableOptionCard
      title="경첩도 같이 받을래요"
      showImage
      imageUrl="/img/hardware-category/hinge.png"
      showChip
      chipText="인기"
      chipColor="yellow"
      showExpandableContent
      expandableContent={
        <div className="flex flex-col gap-5">
          <Field label="몸통 두께" required fieldRef={thicknessRef} error={thicknessError}>
            <Choose aria-label="몸통 두께" value={thickness} onChange={onThicknessChange} options={HINGE_THICKNESS_OPTIONS} />
          </Field>
          {onBrandChange && (
            // 몸통 두께와 같은 세 칸 — 글 칸이 왼쪽 두 칸, 「모름」이 위 「모름」과 같은 열(2026-11-23 사용자 「필수가 아니라는 걸 강조」).
            // 비워 두고 넘어가도 되고, 「모름」을 눌러도 된다. 「모름」 뒤에 글을 적으면 「모름」은 풀린다.
            <Field label="원하는 경첩 브랜드 (선택)">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  aria-label="원하는 경첩 브랜드"
                  placeholder="예) 블룸"
                  value={brand === BRAND_UNKNOWN ? "" : (brand ?? "")}
                  onChange={(e) => onBrandChange(e.target.value)}
                  className="col-span-2 h-10 text-[16px]"
                />
                <Choose
                  aria-label="경첩 브랜드 모름"
                  value={brand === BRAND_UNKNOWN ? BRAND_UNKNOWN : null}
                  onChange={() => onBrandChange(BRAND_UNKNOWN)}
                  options={[{ value: BRAND_UNKNOWN, label: "모름" }]}
                />
              </div>
            </Field>
          )}
        </div>
      }
      checked={checked}
      onChange={onCheckedChange}
    />
  );
}
