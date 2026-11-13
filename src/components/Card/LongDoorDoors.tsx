"use client";

import { HingeDirection } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { Door } from "dooring-core-domain/dist/models/InteriorMaterials/Door";
import { ChevronDown } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const DIRECTION: Record<string, string> = {
  [HingeDirection.LEFT]: "좌경첩",
  [HingeDirection.RIGHT]: "우경첩",
  [HingeDirection.UNKNOWN]: "모름",
};

/** 롱문에 딸린 개별 문 정보 — 접어 두고 눌러서 펼친다. 장바구니·주문 상세가 같은 모양으로 쓴다 */
export default function LongDoorDoors({ doors, className }: { doors?: Door[]; className?: string }) {
  if (!doors?.length) return null;
  return (
    <Collapsible className={cn("border-t border-gray-100", className)}>
      <CollapsibleTrigger className="group flex w-full items-center justify-between py-3 text-[14px] font-600 text-gray-800">
        개별 문 정보 ({doors.length}개)
        <ChevronDown className="size-5 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2 pb-4">
        {doors.map((door, idx) => {
          const hinge = (door.hinge ?? []) as (number | null)[];
          const unknown = hinge.length === 1 && hinge[0] == null;
          return (
            <div key={door.id || idx} className="rounded-[12px] bg-gray-50 p-3 text-[14px] text-gray-700">
              <div className="mb-1 font-600 text-gray-800">{idx + 1}번 문</div>
              <div>가로 길이: {door.door_width ? `${door.door_width.toLocaleString()}mm` : "미입력"}</div>
              <div>높이: {door.door_height ? `${door.door_height.toLocaleString()}mm` : "미입력"}</div>
              <div>경첩 방향: {DIRECTION[String(door.hinge_direction)] ?? "미입력"}</div>
              <div>보링 개수: {unknown ? "모름" : hinge.length ? `${hinge.length}개` : "미입력"}</div>
              <div>보링 치수: {hinge.length ? `[${hinge.map((x) => x ?? "null").join(", ")}]` : "미입력"}</div>
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}
