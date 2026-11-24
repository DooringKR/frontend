"use client";

import { DeliveryMethod, VehicleType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { useRouter } from "next/navigation";

import Choose from "@/components/form/Choose";
import DateField from "@/components/form/DateField";
import TimeField from "@/components/form/TimeField";
import Field from "@/components/form/Field";
import { PICK_MESSAGE as PICK, TYPE_MESSAGE as TYPE, useRequired } from "@/components/form/useRequired";
import Pictogram from "@/components/pictogram/Pictogram";
import Notice from "@/components/state/Notice";
import { Input } from "@/components/ui/input";

import { Chips, MoneyChip, TimeChip } from "../_components/ConditionChips";
import StepShell from "../_components/StepShell";
import { carrierOk, dateOk, dateRangeOf, DELIVERY_METHODS, deliveryMethodOk, nextPathOf } from "../_lib/flow";
import { CARRIER_LABEL, type Carrier, type ReceiveInput, useRequestStore } from "../_lib/requestStore";

/**
 * 배송 방법(옛 「시공 정보 입력」, 제목은 2026-11-23 사용자) — 시공 여부와 일정을 한 화면에(2026-11-13 QA).
 * 시공이 필요하면 희망 시공 날짜, 필요 없으면 구 바로키친 AS처럼 받는 방법(배송: 수령 방법·날짜·시간 / 픽업: 차량·날짜·시간).
 * 날짜는 바로배송이어도 고른다 — 바로배송이면 오늘~3일 뒤, 아니면 내일부터(flow.ts dateRangeOf). 시간은 날짜 옆 칸, 날짜를 고른 뒤에(구 바로키친 AS DateTimeRow 와 같은 모양), 30분 단위.
 * 시공은 바로배송일 때만 시간을 받는다(구 바로키친 AS 오늘배송처럼 시각이 중요할 때).
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
        ? { install: true, method: true, how: true, date: (dateOk(s.urgent, s.preferredDate) && !!s.preferredTime) || PICK }
        : {
            install: true,
            // 배송은 갈래(퀵 트럭·택배)까지 골라야 고른 것
            method: (!!r && (!delivery || carrierOk(r.carrier, s.urgent))) || PICK,
            how: !r
              ? true
              : delivery
                ? !r.deliveryMethod || !DELIVERY_METHODS.includes(r.deliveryMethod as DeliveryMethod)
                  ? PICK
                  : deliveryMethodOk(r) || TYPE
                : !r.vehicle
                  ? PICK
                  : r.vehicle !== VehicleType.DIRECT_INPUT || !!r.vehicleInput?.trim() || TYPE,
            date: !r || (dateOk(s.urgent, r.date) && !!r.time) || PICK,
          },
  );

  return (
    <StepShell
      step="install"
      title="배송 방법을 선택해주세요"
      nextReady={req.ok}
      onNext={() => req.check() && router.push(nextPathOf("install"))}
    >
      <Field label="시공 여부" required fieldRef={req.ref("install")} error={req.error("install")}>
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
            { value: "yes", label: "시공까지 해주세요", image: <Pictogram name="install" /> },
            { value: "no", label: "시공은 필요없어요, 물건만 받을게요", image: <Pictogram name="noinstall" /> },
          ]}
        />
      </Field>

      {s.installNeeded === true && (
        <Field label="희망 시공 날짜" required fieldRef={req.ref("date")} error={req.error("date")}>
          {/* 시공도 날짜·시간(30분 단위) — 배송·픽업과 같은 한 줄. 옛날엔 바로배송일 때만 시간을 받았다(2026-11-15 사용자 지적으로 늘 받음) */}
          <div className="flex gap-2">
            <DateField
              className="flex-1"
              aria-invalid={!!req.error("date") && !dateOk(s.urgent, s.preferredDate)}
              title="희망 시공 날짜"
              placeholder="날짜"
              min={range.min}
              max={range.max}
              value={s.preferredDate}
              onChange={v => s.set({ preferredDate: v })}
            />
            <TimeField
              className="flex-1"
              step={30}
              aria-invalid={!!req.error("date") && !s.preferredTime}
              title="희망 시공 시간"
              disabled={!s.preferredDate}
              value={s.preferredTime}
              onChange={v => s.set({ preferredTime: v })}
            />
          </div>
        </Field>
      )}

      {s.installNeeded === false && (
        <>
          <Field label="받는 방법" required fieldRef={req.ref("method")} error={req.error("method")}>
            {/* 배송은 퀵 트럭·택배(경동화물) 두 갈래, 칩은 비용 빨강·시간 회색(2026-11-23 사용자 그림) */}
            <Choose<Carrier | "pickup">
              aria-invalid={!!req.error("method")}
              aria-label="받는 방법"
              value={r?.method === "pickup" ? "pickup" : r?.carrier && carrierOk(r.carrier, s.urgent) ? r.carrier : null}
              onChange={v => setReceive(v === "pickup" ? { method: "pickup" } : { method: "delivery", carrier: v })}
              options={[
                {
                  value: "quick",
                  label: CARRIER_LABEL.quick,
                  image: <Pictogram name="delivery" />,
                  badge: <MoneyChip>배송비 착불</MoneyChip>,
                },
                {
                  value: "parcel",
                  label: CARRIER_LABEL.parcel,
                  disabled: s.urgent,
                  description: s.urgent ? "바로배송은 택배로 받을 수 없어요" : undefined,
                  image: <Pictogram name="delivery" />,
                  badge: (
                    <Chips>
                      <TimeChip>3일 이상 소요</TimeChip>
                      <MoneyChip>배송비 착불</MoneyChip>
                    </Chips>
                  ),
                },
                { value: "pickup", label: "직접 픽업", image: <Pictogram name="pickup" /> },
              ]}
            />
          </Field>
          {r && (
            <Field label={delivery ? "수령 방법" : "차량"} required fieldRef={req.ref("how")} error={req.error("how")}>
              {delivery ? (
                <Choose<string>
                  aria-invalid={!!req.error("how")}
                  aria-label="수령 방법"
                  value={r.deliveryMethod ?? null}
                  onChange={v => setReceive({ deliveryMethod: v })}
                  options={DELIVERY_METHODS.map(m => ({ value: m, label: m }))}
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
            <Field label={delivery ? "희망 도착 날짜" : "픽업 날짜"} required fieldRef={req.ref("date")} error={req.error("date")}>
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
                  step={30}
                  title={delivery ? "희망 도착 시간" : "픽업 시간"}
                  disabled={!r.date}
                  value={r.time ?? ""}
                  onChange={v => setReceive({ time: v })}
                />
              </div>
              {/* 구 바로가구 「구체적인 시공 내용은 상담으로 안내해드려요」와 같은 Notice(2026-11-23 사용자) */}
              {delivery && <Notice tone="blue" title="참고용이며 상황에 따라 정확한 시간을 맞추기 어려울 수 있습니다" />}
            </Field>
          )}
        </>
      )}
    </StepShell>
  );
}
