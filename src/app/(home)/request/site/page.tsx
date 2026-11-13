"use client";

import { useRouter } from "next/navigation";

import AddressField from "@/components/form/AddressField";
import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import Pictogram from "@/components/pictogram/Pictogram";
import { Input } from "@/components/ui/input";

import {
  getCoordinatesFromAddress,
  getTravelTimeInMinutes,
  warehouseLocation,
} from "@/utils/CheckDeliveryTime";

import StepShell from "../_components/StepShell";
import { nextPathOf } from "../_lib/flow";
import { useRequestStore } from "../_lib/requestStore";

const PARKING = ["가능", "불가", "유료"] as const;
/** 현장허브 「건물 종류」 select 선택지 그대로(어드민 0141) */
const BUILDING = ["아파트", "단독주택", "빌라/다세대주택", "오피스텔/상업공간"] as const;

/**
 * 현장 — 주소(Daum 검색)·상세 주소·건물 종류·평형, 시공이 필요할 때만 주차·엘리베이터(2026-11-13 QA).
 * 시공이 필요하면 주소로 공장→현장 시간을 잰다(출장비). 완료 판정은 flow.ts doneOf.site 와 같다.
 */
export default function SitePage() {
  const router = useRouter();
  const s = useRequestStore();
  const install = !!s.installNeeded;
  const req = useRequired({
    address: !!s.roadAddress,
    building: !!s.buildingType,
    pyeong: !!s.pyeong.trim(),
    parking: !install || s.parking !== null,
    elevator: !install || s.elevator !== null,
  });

  const pickAddress = async (road: string) => {
    s.set({ roadAddress: road, lat: null, lon: null, travelMinutes: null });
    try {
      const goal = await getCoordinatesFromAddress(road);
      s.set({ lat: goal.lat, lon: goal.lon });
      if (useRequestStore.getState().installNeeded)
        s.set({ travelMinutes: await getTravelTimeInMinutes(warehouseLocation, goal) });
    } catch (e) {
      // 시간을 못 재도 주문은 받는다 — 확인 화면에서 다시 잰다
      console.error("[request] 공장 거리 계산 실패", e);
    }
  };

  return (
    <StepShell
      step="site"
      title="현장 정보를 알려주세요"
      onNext={() => req.check() && router.push(nextPathOf("site"))}
    >
      <Field label="주소" fieldRef={req.ref("address")}>
        <AddressField
          value={s.roadAddress}
          onPick={pickAddress}
          aria-invalid={!!req.error("address")}
        />
        <Input
          placeholder="상세주소 (예: 101동 501호)"
          value={s.detailAddress}
          onChange={e => s.set({ detailAddress: e.target.value })}
        />
      </Field>
      <Field label="건물 종류" fieldRef={req.ref("building")}>
        <Choose
          aria-invalid={!!req.error("building")}
          aria-label="건물 종류"
          value={s.buildingType}
          onChange={v => s.set({ buildingType: v })}
          options={BUILDING.map(b => ({ value: b, label: b }))}
        />
      </Field>
      <Field label="평형" fieldRef={req.ref("pyeong")}>
        <Input
          placeholder="예) 33평형"
          aria-invalid={!!req.error("pyeong")}
          value={s.pyeong}
          onChange={e => s.set({ pyeong: e.target.value })}
        />
      </Field>
      {install && (
        <>
          <Field label="주차" fieldRef={req.ref("parking")}>
            <Choose
              aria-invalid={!!req.error("parking")}
              aria-label="주차"
              value={s.parking}
              onChange={v => s.set({ parking: v })}
              options={PARKING.map(p => ({ value: p, label: p }))}
            />
          </Field>
          <Field label="엘리베이터" fieldRef={req.ref("elevator")}>
            <Choose
              aria-invalid={!!req.error("elevator")}
              aria-label="엘리베이터"
              value={s.elevator === null ? null : s.elevator ? "yes" : "no"}
              onChange={v => s.set({ elevator: v === "yes" })}
              options={[
                { value: "yes", label: "있음", image: <Pictogram name="elevator" /> },
                { value: "no", label: "없음", image: <Pictogram name="stairs" /> },
              ]}
            />
          </Field>
        </>
      )}
    </StepShell>
  );
}
