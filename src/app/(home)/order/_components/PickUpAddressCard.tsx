"use client";

import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/use-copy";
import { cn } from "@/lib/utils";

import { FACTORY_ADDRESS } from "../_lib/order";

/** 픽업 주소(도어링 공장) + 복사 — 픽업 주문 화면(제목 있음)·픽업 완료 화면(compact) */
export default function PickUpAddressCard({ compact }: { compact?: boolean }) {
  const copy = useCopy();
  return (
    <div className={cn("flex flex-col gap-2 rounded-xl border border-gray-200 px-5 py-4", !compact && "bg-gray-50")}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/map.svg" alt="지도 아이콘" />
          <div>
            {!compact && <h1 className="text-[17px] font-600">픽업주소</h1>}
            <h2 className={cn("max-w-[220px] break-keep leading-snug", compact ? "pr-3 text-[15px] font-400 text-gray-600" : "text-[17px] font-500")}>
              {FACTORY_ADDRESS}
            </h2>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => copy.run("factory", FACTORY_ADDRESS)}>
          {copy.copied === "factory" ? "복사됨" : "복사"}
        </Button>
      </div>
      {copy.failed && <p className="select-all text-[14px] text-gray-600">{copy.failed}</p>}
    </div>
  );
}
