"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import BoxedInput from "@/components/Input/BoxedInput";
import DaumPostcodePopup from "@/components/SearchAddress/DaumPostcode";
import { getCoordinatesFromAddress, getTravelTimeInMinutes, warehouseLocation } from "@/utils/CheckDeliveryTime";

import StepShell from "../_components/StepShell";
import { nextOf, progressOf, useHydrated } from "../_lib/flow";
import { useRequestStore } from "../_lib/requestStore";

const PARKING = ["가능", "불가", "유료"] as const;
/** 현장허브 「건물 종류」 select 선택지 그대로(어드민 0141) */
const BUILDING = ["아파트", "단독주택", "빌라/다세대주택", "오피스텔/상업공간"] as const;

/** 고르는 칸 한 줄 — 구 바로가구 버튼 모양(GrayMedium·BrandInverse) */
function Pick<T extends string | boolean>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; text: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[14px] font-400 text-gray-600">{label}</div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length > 3 ? 2 : options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            className={`h-[40px] rounded-[12px] text-[16px] font-500 ${
              value === o.value ? "bg-brand-100 text-brand-600" : "bg-gray-100 text-gray-700"
            }`}
          >
            {o.text}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 현장 — 주소(Daum 검색)·상세 주소·건물 종류·평형·주차·엘리베이터. 시공이 필요하면 주소로 공장→현장 시간을 잰다(출장비) */
export default function SitePage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useRequestStore();
  const path = "/request/site";

  useEffect(() => {
    if (hydrated && (s.situations.length === 0 || s.installNeeded === null)) router.replace("/request");
  }, [hydrated, s.situations.length, s.installNeeded, router]);

  const pickAddress = async (road: string) => {
    s.set({ roadAddress: road, lat: null, lon: null, travelMinutes: null });
    try {
      const goal = await getCoordinatesFromAddress(road);
      s.set({ lat: goal.lat, lon: goal.lon });
      if (useRequestStore.getState().installNeeded) s.set({ travelMinutes: await getTravelTimeInMinutes(warehouseLocation, goal) });
    } catch (e) {
      // 시간을 못 재도 주문은 받는다 — 확인 화면에서 다시 잰다
      console.error("[request] 공장 거리 계산 실패", e);
    }
  };

  const ready = !!s.roadAddress && !!s.buildingType && !!s.pyeong.trim() && s.parking !== null && s.elevator !== null;

  return (
    <StepShell
      progress={progressOf(s.situations, path)}
      title="현장 정보를 알려주세요"
      nextDisabled={!ready}
      onNext={() => router.push(nextOf(s.situations, path))}
    >
      <div className="flex flex-col gap-[10px]">
        <div className="text-[14px] font-400 text-gray-600">주소</div>
        <DaumPostcodePopup address1={s.roadAddress} onComplete={pickAddress} />
        <BoxedInput
          placeholder="상세주소 (예: 101동 501호)"
          value={s.detailAddress}
          onChange={(e) => s.set({ detailAddress: e.target.value })}
          placeholderClassName="placeholder-gray-500"
        />
      </div>
      <Pick
        label="건물 종류"
        options={BUILDING.map((b) => ({ value: b, text: b }))}
        value={s.buildingType}
        onChange={(v) => s.set({ buildingType: v })}
      />
      <BoxedInput
        label="평형"
        placeholder="예) 33평형"
        value={s.pyeong}
        onChange={(e) => s.set({ pyeong: e.target.value })}
        placeholderClassName="placeholder-gray-500"
      />
      <Pick
        label="주차"
        options={PARKING.map((p) => ({ value: p, text: p }))}
        value={s.parking}
        onChange={(v) => s.set({ parking: v })}
      />
      <Pick
        label="엘리베이터"
        options={[
          { value: true, text: "있음" },
          { value: false, text: "없음" },
        ]}
        value={s.elevator}
        onChange={(v) => s.set({ elevator: v })}
      />
    </StepShell>
  );
}
