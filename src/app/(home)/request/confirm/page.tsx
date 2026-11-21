"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { dateLabel } from "@/components/form/DateField";
import Field from "@/components/form/Field";
import { Input } from "@/components/ui/input";
import { ActionError, useAction } from "@/components/ui/use-action";
import useBizClientStore from "@/store/bizClientStore";
import { setAfterLogin } from "@/utils/afterLogin";
import { getTravelTimeInMinutes, warehouseLocation } from "@/utils/CheckDeliveryTime";

import StepShell from "../_components/StepShell";
import { firstIncompleteIndex, STEPS, useHydrated } from "../_lib/flow";
import { useRequestStore } from "../_lib/requestStore";
import { NotLoggedIn, saveOrder, sendOrder } from "../_lib/submit";
import { feeOf, travelFee, URGENT_PRICE, useFees } from "../_lib/fees";
import { SITUATIONS, URGENT_NAME } from "../_lib/situations";
import { trackRequest } from "../_lib/track";

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-2 text-[15px]">
      {/* 이름 칸은 가장 긴 이름(「문짝 교체 · 설치」 93px)이 한 줄에 들어가게 */}
      <div className="w-24 shrink-0 text-gray-500">{label}</div>
      <div className="min-w-0 flex-1 whitespace-pre-line text-gray-800">{children}</div>
    </div>
  );
}

/**
 * 확인 — 고른 것 요약, 비용, 요청사항, 주문하기. 단계 줄에는 없다(2026-11-13 QA).
 * 덜 끝난 단계가 있으면 주문하기는 막힌 모양(aria-disabled)이고, 누르면 단계 줄의 덜 끝난 단계를 빨간 Badge 로, 첫 단계에 Tooltip.
 */
export default function ConfirmPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useRequestStore();
  // 구 바로키친 AS와 같은 판단 — 회원 정보(BizClient)가 있으면 로그인한 것
  const loggedIn = !!useBizClientStore((b) => b.bizClient);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(false);
  const send = useAction({ holdOnSuccess: true });
  const incomplete = !hydrated || firstIncompleteIndex(s) < STEPS.length;

  useEffect(() => {
    if (!hydrated) return;
    // 현장 화면에서 시간을 못 쟀으면 여기서 다시 잰다
    if (s.installNeeded && s.travelMinutes == null && s.lat != null && s.lon != null)
      getTravelTimeInMinutes(warehouseLocation, { lat: s.lat, lon: s.lon })
        .then((m) => s.set({ travelMinutes: m }))
        .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const picked = SITUATIONS.filter((x) => s.situations.includes(x.slug));
  // 금액은 노션 단가 라이브러리(2026-11-18 「한 곳으로」) — 첫 장 칩과 같은 값
  const fees = useFees();
  const urgentFee = feeOf(fees, URGENT_PRICE);
  const pickedFees = picked.flatMap((x) => {
    const fee = feeOf(fees, x.name);
    return fee ? [{ ...x, fee }] : [];
  });
  const travel = s.installNeeded ? travelFee(fees, s.travelMinutes) : null;
  const r = s.receive;

  /** 로그인을 강제하지 않고 왔으면 여기서 로그인 화면으로 — 입력값·사진은 기기에 있고, 로그인 뒤 이 화면으로 돌아온다 */
  const toLogin = () => {
    setAfterLogin("/request/confirm");
    router.push("/start");
  };

  // 연타 막기·도는 표시·실패는 버튼 바로 위(useAction). 성공하면 넘어가는 동안 계속 막아 둔다.
  const submit = () => {
    if (incomplete) return setHighlight(true);
    // 보낸 결과 — 입력값을 비우기 전에(공통 속성이 남게)
    const result = (r: "ok" | "error" | "login_needed") =>
      trackRequest("Submitted", {
        result: r,
        retry: !!orderId,
        travel_fee: travel,
      });
    return send.run(async () => {
      try {
        if (!loggedIn) {
          result("login_needed");
          return toLogin();
        }
        const id = orderId ?? (await saveOrder());
        setOrderId(id);
        await sendOrder(id);
        result("ok");
        useRequestStore.getState().reset();
        router.replace("/request/done");
      } catch (e) {
        if (e instanceof NotLoggedIn) {
          result("login_needed");
          return toLogin();
        }
        result("error");
        throw e;
      }
    });
  };

  const how =
    r?.method === "pickup"
      ? r.vehicle === "직접 입력"
        ? r.vehicleInput
        : r.vehicle
      : r?.deliveryMethod === "직접 입력"
        ? r?.deliveryMethodInput
        : r?.deliveryMethod;

  return (
    <StepShell
      step={null}
      highlight={highlight}
      nextLooksDisabled={incomplete}
      title="주문 내용을 확인해주세요"
      nextText={orderId ? "다시 보내기" : loggedIn ? "주문하기" : "로그인하고 주문하기"}
      busy={send.busy}
      onNext={submit}
      bottomTop={<ActionError error={send.error} className="mb-3" />}
    >
      {/* amp-mask: 세션 리플레이에서 이름·연락처·주소·출입 정보 글을 가린다(입력칸은 기본으로 가려짐) */}
      <div className="amp-mask flex flex-col divide-y divide-gray-100">
        {picked.map((x) => {
          const p = s.parts[x.slug];
          return (
            <Row key={x.slug} label={x.name}>
              {/* QA 원문 순서 — 품목 → 추가 부속(경첩) → 설명 */}
              {[p?.buttons.join(", ") || (p?.direct ? "직접 입력" : ""), p?.hinge === true ? "경첩 필요" : p?.hinge === false ? "경첩 필요 없음" : "", p?.amountNote, p?.memo].filter(Boolean).join("\n")}
            </Row>
          );
        })}
        {s.installNeeded !== null && <Row label="시공">{s.installNeeded ? "필요해요" : "필요 없어요"}</Row>}
        {s.installNeeded === true && (
          <Row label="시공 날짜">{s.preferredDate && [dateLabel(s.preferredDate), s.preferredTime].filter(Boolean).join(" ")}</Row>
        )}
        {s.installNeeded === false && r && (
          <Row label="받는 방법">
            {[r.method === "pickup" ? "직접 픽업" : "배송", how, r.date && [dateLabel(r.date), r.time].filter(Boolean).join(" ")].filter(Boolean).join(" · ")}
          </Row>
        )}
        {s.roadAddress && (
          <Row label="현장">
            {[s.roadAddress, s.detailAddress].filter(Boolean).join(" ")}
            {`\n${[
              s.buildingType,
              s.pyeong,
              s.installNeeded && s.parking && `주차 ${s.parking}`,
              s.installNeeded && s.elevator !== null && `엘리베이터 ${s.elevator ? "있음" : "없음"}`,
            ]
              .filter(Boolean)
              .join(" · ")}`}
          </Row>
        )}
        {s.contactName && (
          <Row label="수령인">
            {`${s.contactName} ${s.contactPhone}${s.callTime ? `\n통화 ${s.callTime}` : ""}${s.accessInfo ? `\n출입 ${s.accessInfo}` : ""}`}
          </Row>
        )}
      </div>

      {/* 비용 — 바로배송 혜택·출장비 산정 방식 설명 문구는 사용자가 준다(지어 넣지 말 것) */}
      {(s.urgent || s.installNeeded || pickedFees.length > 0) && (
        <div className="flex flex-col divide-y divide-gray-100 rounded-xl bg-gray-50 px-4">
          {/* 단가를 못 읽으면 금액 대신 「확인 후 안내」 — 틀린 금액을 보이지 않는다 */}
          {s.urgent && <Row label={URGENT_NAME}>{urgentFee ? won(urgentFee) : "확인 후 안내"}</Row>}
          {/* 상황 추가금액 — 첫 장 칩과 같은 금액(QA 「선택지별 추가금액 시나리오」) */}
          {pickedFees.map((x) => (
            <Row key={x.slug} label={x.name}>{won(x.fee)}</Row>
          ))}
          {s.installNeeded && (
            <Row label="출장비">
              {s.travelMinutes == null
                ? "계산 중"
                : travel == null
                  ? "확인 후 안내"
                  : `${won(travel)} (공장에서 ${s.travelMinutes}분)`}
            </Row>
          )}
        </div>
      )}

      <Field label="요청사항">
        <Input value={s.requestNote} onChange={(e) => s.set({ requestNote: e.target.value })} />
      </Field>
    </StepShell>
  );
}
