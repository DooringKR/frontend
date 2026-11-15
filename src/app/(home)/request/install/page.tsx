"use client";

import { DeliveryMethod, VehicleType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { useRouter } from "next/navigation";

import Choose from "@/components/form/Choose";
import DateField from "@/components/form/DateField";
import TimeField from "@/components/form/TimeField";
import Field from "@/components/form/Field";
import { PICK_MESSAGE as PICK, TYPE_MESSAGE as TYPE, useRequired } from "@/components/form/useRequired";
import Pictogram from "@/components/pictogram/Pictogram";
import { Input } from "@/components/ui/input";

import StepShell from "../_components/StepShell";
import { dateOk, dateRangeOf, nextPathOf } from "../_lib/flow";
import { type ReceiveInput, useRequestStore } from "../_lib/requestStore";

/**
 * 시공 정보 입력 — 시공 여부와 일정을 한 화면에(2026-11-13 QA).
 * 시공이 필요하면 희망 시공 날짜, 필요 없으면 구 바로가구처럼 받는 방법(배송: 수령 방법·날짜·시간 / 픽업: 차량·날짜·시간).
 * 날짜는 바로배송이어도 고른다 — 바로배송이면 오늘~3일 뒤, 아니면 내일부터(flow.ts dateRangeOf). 시간은 날짜 옆 칸, 날짜를 고른 뒤에(구 바로가구 DateTimeRow 와 같은 모양).
 * (QA 「희망 도착 날짜에 시간도 적어야 함, 바로배송을 골라도 희망시공 날짜 고를 수 있어야 함」 2026-11-15)
 * 완료 판정은 flow.ts doneOf.install 과 같다.
 */
export default function InstallPage() {
  const router = useRouter();
  const s = useRequestStore();
  const r = s.receive;
  const delivery = r?.method === "delivery";
  const range = dateRangeOf(s.urgent);
  const setReceive = (patch: Partial<ReceiveInput>) =>
    s.set({ receive: { method: r?.method ?? "delivery", ...r, ...patch } });

  const req = useRequired(
    s.installNeeded === null
      ? { install: PICK, method: true, how: true, date: true }
      : s.installNeeded
        ? { install: true, method: true, how: true, date: dateOk(s.urgent, s.preferredDate) || PICK }
        : {
            install: true,
            method: !!r || PICK,
            how: !r
              ? true
              : delivery
                ? !r.deliveryMethod
                  ? PICK
                  : r.deliveryMethod !== DeliveryMethod.DIRECT_INPUT || !!r.deliveryMethodInput?.trim() || TYPE
                : !r.vehicle
                  ? PICK
                  : r.vehicle !== VehicleType.DIRECT_INPUT || !!r.vehicleInput?.trim() || TYPE,
            date: !r || (dateOk(s.urgent, r.date) && !!r.time) || PICK,
          },
  );

  return (
    <StepShell
      step="install"
      title="시공 정보를 입력해주세요"
      nextReady={req.ok}
      onNext={() => req.check() && router.push(nextPathOf("install"))}
    >
      <Field label="시공 여부" fieldRef={req.ref("install")} error={req.error("install")}>
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

      {s.installNeeded === true && (
        <Field label="희망 시공 날짜" fieldRef={req.ref("date")} error={req.error("date")}>
          <DateField
            aria-invalid={!!req.error("date")}
            title="희망 시공 날짜"
            min={range.min}
            max={range.max}
            value={s.preferredDate}
            onChange={v => s.set({ preferredDate: v })}
          />
        </Field>
      )}

      {s.installNeeded === false && (
        <>
          <Field label="받는 방법" fieldRef={req.ref("method")} error={req.error("method")}>
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
            <Field label={delivery ? "수령 방법" : "차량"} fieldRef={req.ref("how")} error={req.error("how")}>
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
            <Field label={delivery ? "희망 도착 날짜" : "픽업 날짜"} fieldRef={req.ref("date")} error={req.error("date")}>
              <div className="flex gap-2">
                <DateField
                  className="flex-1"
                  aria-invalid={!!req.error("date") && !dateOk(s.urgent, r.date)}
                  title={delivery ? "희망 도착 날짜" : "픽업 날짜"}
                  placeholder="날짜"
                  min={range.min}
                  max={range.max}
                  value={r.date ?? ""}
                  onChange={v => setReceive({ date: v })}
                />
                <TimeField
                  className="flex-1"
                  aria-invalid={!!req.error("date") && !r.time}
                  title={delivery ? "희망 도착 시간" : "픽업 시간"}
                  disabled={!r.date}
                  value={r.time ?? ""}
                  onChange={v => setReceive({ time: v })}
                />
              </div>
            </Field>
          )}
        </>
      )}
    </StepShell>
  );
}
