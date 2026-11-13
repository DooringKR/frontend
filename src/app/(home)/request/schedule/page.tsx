"use client";

import { DeliveryMethod, VehicleType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import BoxedInput from "@/components/Input/BoxedInput";

import ChoiceCard from "../_components/ChoiceCard";
import StepShell from "../_components/StepShell";
import { nextOf, progressOf, useHydrated } from "../_lib/flow";
import { useRequestStore, type ReceiveInput } from "../_lib/requestStore";

const tomorrow = () => new Date(Date.now() + 9 * 3600_000 + 24 * 3600_000).toISOString().slice(0, 10);

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[14px] font-400 text-gray-600">{label}</span>
      <input
        type="date"
        min={tomorrow()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[40px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800"
      />
    </label>
  );
}

/**
 * 일정 — 시공이 필요하면 희망 시공 날짜(급한 수습이면 3일 이내로 고정),
 * 필요 없으면 구 바로가구처럼 받는 방법(배송: 수령 방법·날짜 / 픽업: 차량·날짜).
 */
export default function SchedulePage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useRequestStore();
  const path = "/request/schedule";
  const r = s.receive;
  const setReceive = (patch: Partial<ReceiveInput>) => s.set({ receive: { method: r?.method ?? "delivery", ...r, ...patch } });

  useEffect(() => {
    if (hydrated && (s.situations.length === 0 || !s.contactName)) router.replace("/request");
  }, [hydrated, s.situations.length, s.contactName, router]);

  const ready = s.installNeeded
    ? s.urgent || !!s.preferredDate
    : !!r &&
      !!r.date &&
      (r.method === "delivery"
        ? !!r.deliveryMethod && (r.deliveryMethod !== DeliveryMethod.DIRECT_INPUT || !!r.deliveryMethodInput?.trim())
        : !!r.vehicle && (r.vehicle !== VehicleType.DIRECT_INPUT || !!r.vehicleInput?.trim()));

  return (
    <StepShell
      progress={progressOf(s.situations, path)}
      title={s.installNeeded ? "언제 시공하면 좋을까요?" : "상품 받는 방법을 선택해주세요"}
      nextDisabled={!ready}
      onNext={() => router.push(nextOf(s.situations, path))}
    >
      {s.installNeeded ? (
        s.urgent ? (
          <div className="rounded-xl bg-gray-50 px-5 py-4 text-[17px] font-500 text-gray-800">3일 이내 (현장 급한 수습)</div>
        ) : (
          <DateField label="희망 시공 날짜" value={s.preferredDate} onChange={(v) => s.set({ preferredDate: v })} />
        )
      ) : (
        <>
          <ChoiceCard title="배송" checked={r?.method === "delivery"} onClick={() => setReceive({ method: "delivery" })} />
          <ChoiceCard title="직접 픽업" checked={r?.method === "pickup"} onClick={() => setReceive({ method: "pickup" })} />
          {r?.method === "delivery" && (
            <>
              <div className="flex flex-col gap-2">
                <span className="text-[14px] font-400 text-gray-600">받는 방법</span>
                {Object.values(DeliveryMethod).map((m) => (
                  <ChoiceCard key={m} title={m} checked={r.deliveryMethod === m} onClick={() => setReceive({ deliveryMethod: m })} />
                ))}
                {r.deliveryMethod === DeliveryMethod.DIRECT_INPUT && (
                  <BoxedInput value={r.deliveryMethodInput ?? ""} onChange={(e) => setReceive({ deliveryMethodInput: e.target.value })} />
                )}
              </div>
              <DateField label="희망 도착 날짜" value={r.date ?? ""} onChange={(v) => setReceive({ date: v })} />
            </>
          )}
          {r?.method === "pickup" && (
            <>
              <div className="flex flex-col gap-2">
                <span className="text-[14px] font-400 text-gray-600">차량</span>
                {Object.values(VehicleType).map((v) => (
                  <ChoiceCard key={v} title={v} checked={r.vehicle === v} onClick={() => setReceive({ vehicle: v })} />
                ))}
                {r.vehicle === VehicleType.DIRECT_INPUT && (
                  <BoxedInput value={r.vehicleInput ?? ""} onChange={(e) => setReceive({ vehicleInput: e.target.value })} />
                )}
              </div>
              <DateField label="픽업 날짜" value={r.date ?? ""} onChange={(v) => setReceive({ date: v })} />
            </>
          )}
        </>
      )}
    </StepShell>
  );
}
