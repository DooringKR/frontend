"use client";

import { DeliveryMethod, VehicleType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { useRouter } from "next/navigation";

import Choose from "@/components/form/Choose";
import DateField from "@/components/form/DateField";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import Pictogram from "@/components/pictogram/Pictogram";
import { Input } from "@/components/ui/input";

import StepShell from "../_components/StepShell";
import { nextPathOf } from "../_lib/flow";
import { type ReceiveInput, useRequestStore } from "../_lib/requestStore";

const tomorrow = () =>
  new Date(Date.now() + 9 * 3600_000 + 24 * 3600_000).toISOString().slice(0, 10);

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
  const setReceive = (patch: Partial<ReceiveInput>) =>
    s.set({ receive: { method: r?.method ?? "delivery", ...r, ...patch } });

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
                ? !!r.deliveryMethod &&
                  (r.deliveryMethod !== DeliveryMethod.DIRECT_INPUT ||
                    !!r.deliveryMethodInput?.trim())
                : !!r.vehicle &&
                  (r.vehicle !== VehicleType.DIRECT_INPUT || !!r.vehicleInput?.trim()),
            date: !r || !!r.date,
          },
  );

  return (
    <StepShell
      step="install"
      title="시공 정보를 입력해주세요"
      onNext={() => req.check() && router.push(nextPathOf("install"))}
    >
      <Field label="시공 여부" fieldRef={req.ref("install")}>
        <Choose
          aria-invalid={!!req.error("install")}
          aria-label="시공 여부"
          value={s.installNeeded === null ? null : s.installNeeded ? "yes" : "no"}
          onChange={v =>
            s.set(
              v === "yes" ? { installNeeded: true } : { installNeeded: false, travelMinutes: null },
            )
          }
          options={[
            { value: "yes", label: "시공도 필요해요", image: <Pictogram name="install" /> },
            { value: "no", label: "필요 없어요", image: <Pictogram name="noinstall" /> },
          ]}
        />
      </Field>

      {s.installNeeded === true &&
        (s.urgent ? (
          <Field label="희망 시공 날짜">
            <div className="rounded-[12px] bg-muted px-5 py-4 text-[17px] font-500 text-gray-800">
              3일 이내 (현장 급한 수습)
            </div>
          </Field>
        ) : (
          <Field label="희망 시공 날짜" fieldRef={req.ref("date")}>
            <DateField
              aria-invalid={!!req.error("date")}
              title="희망 시공 날짜"
              min={tomorrow()}
              value={s.preferredDate}
              onChange={v => s.set({ preferredDate: v })}
            />
          </Field>
        ))}

      {s.installNeeded === false && (
        <>
          <Field label="받는 방법" fieldRef={req.ref("method")}>
            <Choose
              aria-invalid={!!req.error("method")}
              aria-label="받는 방법"
              value={r?.method ?? null}
              onChange={v => setReceive({ method: v })}
              options={[
                { value: "delivery" as const, label: "배송", image: <Pictogram name="delivery" /> },
                { value: "pickup" as const, label: "직접 픽업", image: <Pictogram name="pickup" /> },
              ]}
            />
          </Field>
          {r && (
            <Field label={delivery ? "수령 방법" : "차량"} fieldRef={req.ref("how")}>
              {delivery ? (
                <Choose<string>
                  aria-invalid={!!req.error("how")}
                  aria-label="수령 방법"
                  value={r.deliveryMethod ?? null}
                  onChange={v => setReceive({ deliveryMethod: v })}
                  options={Object.values(DeliveryMethod).map(m => ({ value: m, label: m }))}
                />
              ) : (
                <Choose<string>
                  aria-invalid={!!req.error("how")}
                  aria-label="차량"
                  value={r.vehicle ?? null}
                  onChange={v => setReceive({ vehicle: v })}
                  options={Object.values(VehicleType).map(v => ({ value: v, label: v }))}
                />
              )}
              {delivery && r.deliveryMethod === DeliveryMethod.DIRECT_INPUT && (
                <Input
                  value={r.deliveryMethodInput ?? ""}
                  onChange={e => setReceive({ deliveryMethodInput: e.target.value })}
                />
              )}
              {!delivery && r.vehicle === VehicleType.DIRECT_INPUT && (
                <Input
                  value={r.vehicleInput ?? ""}
                  onChange={e => setReceive({ vehicleInput: e.target.value })}
                />
              )}
            </Field>
          )}
          {r && (
            <Field label={delivery ? "희망 도착 날짜" : "픽업 날짜"} fieldRef={req.ref("date")}>
              <DateField
                aria-invalid={!!req.error("date")}
                title={delivery ? "희망 도착 날짜" : "픽업 날짜"}
                min={tomorrow()}
                value={r.date ?? ""}
                onChange={v => setReceive({ date: v })}
              />
            </Field>
          )}
        </>
      )}
    </StepShell>
  );
}
