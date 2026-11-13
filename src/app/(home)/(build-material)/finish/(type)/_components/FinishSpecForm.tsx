"use client";

import { FinishEdgeCount, Location } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import NumberInput from "@/components/form/NumberInput";
import PhotoPick from "@/components/form/PhotoPick";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import NavRow from "@/components/nav/NavRow";
import BottomBar from "@/components/overlay/BottomBar";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { goBack } from "@/lib/nav/go";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import useItemStore, { type BaseItem } from "@/store/itemStore";
import formatColor from "@/utils/formatColor";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

const num = (v: string) => (v === "" ? null : Number(v));

/**
 * 가로·높이 합계 검사 — 예전 검증 훅 3벌(ep·galle·molding)을 하나로.
 * sheet(EP) = 원장 한 장(1220×2440) 안: 한 변이 1221mm 이상이면 다른 변은 1220mm 까지, 최대 2440mm. 갈레·몰딩은 99999mm 까지.
 */
function sizeProblems(i: BaseItem | null, sheet: boolean) {
  const d = (i?.depth ?? 0) + (i?.depthIncrease ?? 0);
  const h = (i?.height ?? 0) + (i?.heightIncrease ?? 0);
  const max = sheet ? 2440 : 99999;
  const check = (base: unknown, total: number, other: number, name: string, otherName: string): boolean | string => {
    if (base == null) return false;
    if (total < 1) return `${name} 합계는 최소 1mm 이상이어야 합니다.`;
    if (sheet && other >= 1221 && total > 1220) return `${otherName} 길이가 1221mm 이상일 때는 ${name} 합계가 최대 1220mm 이하여야 합니다.`;
    if (total > max) return `${name} 합계는 최대 ${max}mm 이하여야 합니다.`;
    return true;
  };
  return { depth: check(i?.depth, d, h, "가로", "높이"), height: check(i?.height, h, d, "높이", "가로") };
}

/** 「키우기」 — 켜면 추가 길이 칸과 합산이 나온다. 끄면 추가 길이를 지운다 */
function Increase({
  label,
  sumLabel,
  base,
  value,
  onChange,
}: {
  label: string;
  sumLabel: string;
  base: number | null | undefined;
  value: number | null | undefined;
  onChange: (v: number | null) => void;
}) {
  const [on, setOn] = useState(value != null);
  return (
    <div className="flex gap-3">
      <Separator orientation="vertical" className="h-auto" />
      <div className="flex flex-1 flex-col gap-3">
        <label className="flex items-center justify-between text-[16px] text-gray-700">
          {label}
          <Switch
            checked={on}
            onCheckedChange={(v) => {
              setOn(v);
              if (!v) onChange(null);
            }}
          />
        </label>
        {on && (
          <>
            <NumberInput unit="mm" placeholder="추가할 길이를 입력해주세요" value={value} onChange={(v) => onChange(num(v))} />
            <p className="flex items-center justify-between text-[16px]">
              <span className="text-gray-600">{sumLabel}</span>
              <span className="font-600 text-primary">{value != null && base != null ? `${value + base}mm` : "값을 입력해주세요"}</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * 마감재(EP·갈레·몰딩) 정보 입력 — 세 화면이 글자까지 같은 복사본이라 하나로 합쳤다.
 * sheet = EP 원장 크기 한도, depthIncrease = 가로 키우기(EP·몰딩, 갈레는 없음).
 */
export default function FinishSpecForm({ screen, sheet = false, depthIncrease = false }: { screen: string; sheet?: boolean; depthIncrease?: boolean }) {
  const router = useRouter();
  const item = useItemStore((s) => s.item);
  const set = useItemStore((s) => s.updateItem);
  const size = sizeProblems(item, sheet);
  const req = useRequired({
    color: !!(item?.color || item?.finish_color_direct_input),
    edge: !!item?.edgeCount,
    depth: size.depth,
    height: size.height,
    location: !!item?.finish_location,
  });

  useEffect(() => {
    setScreenName(screen);
    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
      previous_screen: getPreviousScreenName(),
    });
  }, [screen]);

  return (
    <div className="flex flex-col pt-[90px]">
      <InitAmplitude />
      <TopNavigator />
      <ProgressBar progress={80} />
      <Header size="Large" title={`${item?.type} 정보를 입력해주세요`} />
      <div className="h-5" />
      <div className="flex flex-col gap-5 px-5">
        <Field label="색상" required fieldRef={req.ref("color")} error={req.error("color")}>
          <NavRow
            card
            label={formatColor(item?.color) || item?.finish_color_direct_input || "색상을 선택해주세요"}
            onClick={() => goBack(router, "/finish/color")}
          />
        </Field>
        <Field label="엣지 면 수" required fieldRef={req.ref("edge")} error={req.error("edge")}>
          <Choose<FinishEdgeCount>
            aria-label="엣지 면 수"
            value={item?.edgeCount ?? null}
            onChange={(v) => set({ edgeCount: v })}
            options={Object.values(FinishEdgeCount).map((v) => ({ value: v, label: v }))}
          />
        </Field>
        <Field label="가로" required fieldRef={req.ref("depth")} error={req.error("depth")}>
          <NumberInput
            unit="mm"
            placeholder="가로를 입력해주세요"
            aria-invalid={!!req.error("depth")}
            value={item?.depth}
            onChange={(v) => set({ depth: num(v) })}
          />
          {depthIncrease && (
            <Increase label="가로 키우기" sumLabel="합산 가로" base={item?.depth} value={item?.depthIncrease} onChange={(v) => set({ depthIncrease: v })} />
          )}
        </Field>
        <Field label="높이(세로)" required fieldRef={req.ref("height")} error={req.error("height")}>
          <NumberInput
            unit="mm"
            placeholder="높이를 입력해주세요"
            aria-invalid={!!req.error("height")}
            value={item?.height}
            onChange={(v) => set({ height: num(v) })}
          />
          <Increase label="높이 키우기" sumLabel="합산 높이" base={item?.height} value={item?.heightIncrease} onChange={(v) => set({ heightIncrease: v })} />
        </Field>
        <Field label="용도 ∙ 장소" required fieldRef={req.ref("location")} error={req.error("location")}>
          <Choose<Location>
            aria-label="용도 ∙ 장소"
            value={item?.finish_location ?? null}
            onChange={(v) => set({ finish_location: v })}
            options={Object.values(Location).map((v) => ({ value: v, label: v }))}
          />
        </Field>
        <Field label="제작 시 요청사항">
          <Input placeholder="제작 시 요청사항 | 예) 시공도 필요해요, …" value={item?.request ?? ""} onChange={(e) => set({ request: e.target.value })} />
        </Field>
        <Field label="이미지 첨부">
          <PhotoPick placeholder="이미지를 첨부해주세요" value={item?.raw_images ?? []} onChange={(f) => set({ raw_images: f })} />
        </Field>
      </div>
      <div className="h-[100px]" />
      <BottomBar>
        <Button
          onClick={() => {
            if (!req.check()) return;
            trackClick({ object_type: "button", object_name: "confirm", current_page: getScreenName(), modal_name: null });
            router.push("/finish/report");
          }}
        >
          다음
        </Button>
      </BottomBar>
    </div>
  );
}
