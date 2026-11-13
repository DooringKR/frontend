"use client";

import { DeliveryMethod, VehicleType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Choose from "@/components/form/Choose";
import DateField from "@/components/form/DateField";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import { Input } from "@/components/ui/input";

import StepShell from "../_components/StepShell";
import { nextOf, progressOf, useHydrated } from "../_lib/flow";
import { useRequestStore, type ReceiveInput } from "../_lib/requestStore";

const tomorrow = () => new Date(Date.now() + 9 * 3600_000 + 24 * 3600_000).toISOString().slice(0, 10);

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

  const delivery = r?.method === "delivery";
  const req = useRequired(
    s.installNeeded
      ? { method: true, how: true, date: s.urgent || !!s.preferredDate }
      : {
          method: !!r,
          how: !r
            ? true
            : delivery
              ? !!r.deliveryMethod && (r.deliveryMethod !== DeliveryMethod.DIRECT_INPUT || !!r.deliveryMethodInput?.trim())
              : !!r.vehicle && (r.vehicle !== VehicleType.DIRECT_INPUT || !!r.vehicleInput?.trim()),
          date: !r || !!r.date,
        },
  );

  return (
    <StepShell
      progress={progressOf(s.situations, path)}
      title={s.installNeeded ? "언제 시공하면 좋을까요?" : "상품 받는 방법을 선택해주세요"}
      onNext={() => req.check() && router.push(nextOf(s.situations, path))}
    >
      {s.installNeeded ? (
        s.urgent ? (
          <div className="rounded-[12px] bg-muted px-5 py-4 text-[17px] font-500 text-gray-800">3일 이내 (현장 급한 수습)</div>
        ) : (
          <Field label="희망 시공 날짜" required fieldRef={req.ref("date")} error={req.error("date")}>
            <DateField title="희망 시공 날짜" min={tomorrow()} value={s.preferredDate} onChange={(v) => s.set({ preferredDate: v })} />
          </Field>
        )
      ) : (
        <>
          <Field fieldRef={req.ref("method")} error={req.error("method")}>
            <Choose
              aria-label="받는 방법"
              value={r?.method ?? null}
              onChange={(v) => setReceive({ method: v })}
              options={[
                { value: "delivery" as const, label: "배송" },
                { value: "pickup" as const, label: "직접 픽업" },
              ]}
            />
          </Field>
          {r && (
            <Field label={delivery ? "받는 방법" : "차량"} required fieldRef={req.ref("how")} error={req.error("how")}>
              {delivery ? (
                <Choose<string>
                  aria-label="받는 방법"
                  value={r.deliveryMethod ?? null}
                  onChange={(v) => setReceive({ deliveryMethod: v })}
                  options={Object.values(DeliveryMethod).map((m) => ({ value: m, label: m }))}
                />
              ) : (
                <Choose<string>
                  aria-label="차량"
                  value={r.vehicle ?? null}
                  onChange={(v) => setReceive({ vehicle: v })}
                  options={Object.values(VehicleType).map((v) => ({ value: v, label: v }))}
                />
              )}
              {delivery && r.deliveryMethod === DeliveryMethod.DIRECT_INPUT && (
                <Input value={r.deliveryMethodInput ?? ""} onChange={(e) => setReceive({ deliveryMethodInput: e.target.value })} />
              )}
              {!delivery && r.vehicle === VehicleType.DIRECT_INPUT && (
                <Input value={r.vehicleInput ?? ""} onChange={(e) => setReceive({ vehicleInput: e.target.value })} />
              )}
            </Field>
          )}
          {r && (
            <Field label={delivery ? "희망 도착 날짜" : "픽업 날짜"} required fieldRef={req.ref("date")} error={req.error("date")}>
              <DateField title={delivery ? "희망 도착 날짜" : "픽업 날짜"} min={tomorrow()} value={r.date ?? ""} onChange={(v) => setReceive({ date: v })} />
            </Field>
          )}
        </>
      )}
    </StepShell>
  );
}
