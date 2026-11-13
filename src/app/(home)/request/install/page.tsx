"use client";

import { DeliveryMethod, VehicleType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { useRouter } from "next/navigation";

import Choose from "@/components/form/Choose";
import DateField from "@/components/form/DateField";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import { Input } from "@/components/ui/input";

import StepShell from "../_components/StepShell";
import { nextPathOf } from "../_lib/flow";
import { useRequestStore, type ReceiveInput } from "../_lib/requestStore";

const tomorrow = () => new Date(Date.now() + 9 * 3600_000 + 24 * 3600_000).toISOString().slice(0, 10);

/**
 * 시공 정보 입력 — 시공 여부와 일정을 한 화면에(2026-11-13 QA).
 * 시공이 필요하면 희망 시공 날짜(급한 수습이면 3일 이내로 고정), 필요 없으면 구 바로가구처럼 받는 방법(배송: 수령 방법·날짜 / 픽업: 차량·날짜).
 * 완료 판정은 flow.ts doneOf.install 과 같다.
 */
export default function InstallPage() {
  const router = useRouter();
  const s = useRequestStore();
  const r = s.receive;
  const delivery = r?.method === "delivery";
  const setReceive = (patch: Partial<ReceiveInput>) => s.set({ receive: { method: r?.method ?? "delivery", ...r, ...patch } });

  const req = useRequired(
    s.installNeeded === null
      ? { install: false, method: true, how: true, date: true }
      : s.installNeeded
        ? { install: true, method: true, how: true, date: s.urgent || !!s.preferredDate }
        : {
            install: true,
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
    <StepShell step="install" title="시공 정보를 입력해주세요" onNext={() => req.check() && router.push(nextPathOf("install"))}>
      <Field label="시공 여부" required fieldRef={req.ref("install")} error={req.error("install")}>
        <Choose
          aria-label="시공 여부"
          value={s.installNeeded === null ? null : s.installNeeded ? "yes" : "no"}
          onChange={(v) => s.set(v === "yes" ? { installNeeded: true } : { installNeeded: false, travelMinutes: null })}
          options={[
            { value: "yes", label: "시공도 필요해요" },
            { value: "no", label: "필요 없어요" },
          ]}
        />
      </Field>

      {s.installNeeded === true &&
        (s.urgent ? (
          <Field label="희망 시공 날짜">
            <div className="rounded-[12px] bg-muted px-5 py-4 text-[17px] font-500 text-gray-800">3일 이내 (현장 급한 수습)</div>
          </Field>
        ) : (
          <Field label="희망 시공 날짜" required fieldRef={req.ref("date")} error={req.error("date")}>
            <DateField title="희망 시공 날짜" min={tomorrow()} value={s.preferredDate} onChange={(v) => s.set({ preferredDate: v })} />
          </Field>
        ))}

      {s.installNeeded === false && (
        <>
          <Field label="받는 방법" required fieldRef={req.ref("method")} error={req.error("method")}>
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
            <Field label={delivery ? "수령 방법" : "차량"} required fieldRef={req.ref("how")} error={req.error("how")}>
              {delivery ? (
                <Choose<string>
                  aria-label="수령 방법"
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
              <DateField
                title={delivery ? "희망 도착 날짜" : "픽업 날짜"}
                min={tomorrow()}
                value={r.date ?? ""}
                onChange={(v) => setReceive({ date: v })}
              />
            </Field>
          )}
        </>
      )}
    </StepShell>
  );
}
