"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BoxedInput from "@/components/Input/BoxedInput";
import useBizClientStore from "@/store/bizClientStore";
import { setAfterLogin } from "@/utils/afterLogin";
import { getTravelTimeInMinutes, warehouseLocation } from "@/utils/CheckDeliveryTime";

import StepShell from "../_components/StepShell";
import { progressOf, useHydrated } from "../_lib/flow";
import { useRequestStore } from "../_lib/requestStore";
import { NotLoggedIn, saveOrder, sendOrder, uploadPendingPhotos } from "../_lib/submit";
import { SITUATIONS, travelFeeOf, URGENT_FEE } from "../_lib/situations";

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-2 text-[15px]">
      <div className="w-[88px] shrink-0 text-gray-500">{label}</div>
      <div className="min-w-0 flex-1 whitespace-pre-line text-gray-800">{children}</div>
    </div>
  );
}

/** 확인 — 고른 것 요약, 비용, 요청사항, 주문하기 */
export default function ConfirmPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useRequestStore();
  // 구 바로가구와 같은 판단 — 회원 정보(BizClient)가 있으면 로그인한 것
  const loggedIn = !!useBizClientStore((b) => b.bizClient);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    if (s.situations.length === 0 || !s.contactName) router.replace("/request");
    // 현장 화면에서 시간을 못 쟀으면 여기서 다시 잰다
    else if (s.installNeeded && s.travelMinutes == null && s.lat != null && s.lon != null)
      getTravelTimeInMinutes(warehouseLocation, { lat: s.lat, lon: s.lon })
        .then((m) => s.set({ travelMinutes: m }))
        .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const picked = SITUATIONS.filter((x) => s.situations.includes(x.slug));
  const r = s.receive;

  /** 로그인을 강제하지 않고 왔으면 여기서 로그인 화면으로 — 사진을 먼저 올려 두고, 로그인 뒤 이 화면으로 돌아온다 */
  const toLogin = async () => {
    await uploadPendingPhotos().catch(() => undefined);
    setAfterLogin("/request/confirm");
    router.push("/start");
  };

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      if (!loggedIn) return await toLogin();
      const id = orderId ?? (await saveOrder());
      setOrderId(id);
      await sendOrder(id);
      useRequestStore.getState().reset();
      router.replace("/request/done");
    } catch (e) {
      if (e instanceof NotLoggedIn) await toLogin();
      else setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <StepShell
      progress={progressOf(s.situations, "/request/confirm")}
      title="주문 내용을 확인해주세요"
      nextText={busy ? "접수하는 중…" : orderId ? "다시 보내기" : loggedIn ? "주문하기" : "로그인하고 주문하기"}
      nextDisabled={busy}
      onNext={submit}
    >
      <div className="flex flex-col divide-y divide-gray-100">
        {picked.map((x) => {
          const p = s.parts[x.slug];
          return (
            <Row key={x.slug} label={x.name}>
              {[p?.buttons.join(", "), p?.amountNote, p?.memo].filter(Boolean).join("\n")}
            </Row>
          );
        })}
        <Row label="시공">{s.installNeeded ? "필요해요" : "필요 없어요"}</Row>
        <Row label="현장">
          {[s.roadAddress, s.detailAddress].filter(Boolean).join(" ")}
          {`\n${s.pyeong} · 주차 ${s.parking} · 엘리베이터 ${s.elevator ? "있음" : "없음"}`}
        </Row>
        <Row label="담당자">{`${s.contactName} ${s.contactPhone}${s.callTime ? `\n통화 ${s.callTime}` : ""}${s.accessInfo ? `\n출입 ${s.accessInfo}` : ""}`}</Row>
        {s.installNeeded ? (
          <Row label="시공 날짜">{s.urgent ? "3일 이내" : s.preferredDate}</Row>
        ) : (
          <Row label="받는 방법">
            {r?.method === "pickup"
              ? `직접 픽업 · ${r.vehicle === "직접 입력" ? r.vehicleInput : r.vehicle} · ${r.date}`
              : `배송 · ${r?.deliveryMethod === "직접 입력" ? r?.deliveryMethodInput : r?.deliveryMethod} · ${r?.date}`}
          </Row>
        )}
      </div>

      {/* 비용 — 급한 수습 혜택·출장비 산정 방식 설명 문구는 사용자가 준다(지어 넣지 말 것) */}
      {(s.urgent || s.installNeeded) && (
        <div className="flex flex-col divide-y divide-gray-100 rounded-xl bg-gray-50 px-4">
          {s.urgent && <Row label="급한 수습">{won(URGENT_FEE)}</Row>}
          {s.installNeeded && (
            <Row label="출장비">
              {s.travelMinutes == null ? "계산 중" : `${won(travelFeeOf(s.travelMinutes))} (공장에서 ${s.travelMinutes}분)`}
            </Row>
          )}
        </div>
      )}

      <BoxedInput
        label="요청사항"
        value={s.requestNote}
        onChange={(e) => s.set({ requestNote: e.target.value })}
        placeholderClassName="placeholder-gray-500"
      />
      {error && <p className="text-[14px] text-red-500">{error}</p>}
    </StepShell>
  );
}
