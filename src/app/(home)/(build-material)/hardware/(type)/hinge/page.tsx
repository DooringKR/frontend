"use client";

import { HardwareMadeBy, HingeAngle, HingeThickness } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import NumberInput from "@/components/form/NumberInput";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import useItemStore from "@/store/itemStore";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

const MADEBY = [
  { value: HardwareMadeBy.MOONJOO, label: "국산 (문주)", description: "+ 1,500원" },
  { value: HardwareMadeBy.HAFFLE, label: "헤펠레 (Haffle)", description: "+ 2,500원" },
  { value: HardwareMadeBy.BLUM, label: "블룸 (Blum)", description: "+ 10,500원" },
  { value: HardwareMadeBy.DIRECT_INPUT, label: "직접 입력" },
];
const opts = <V extends string>(e: Record<string, V>) => Object.values(e).map((v) => ({ value: v, label: v }));
/** 직접 입력 숫자는 고르기 값과 같은 꼴(15T·90°)로 저장한다 — 칸에는 숫자만 */
const digits = (s?: string | null) => (s ?? "").replace(/[^\d.]/g, "");

/** 경첩 — 제조사·합판 두께·각도(각각 「직접 입력」이면 그 밑에 칸), 요청사항. 값은 고르는 즉시 itemStore 에 */
export default function HingePage() {
  const router = useRouter();
  const item = useItemStore((s) => s.item);
  const set = useItemStore((s) => s.updateItem);
  const madeby = item?.madeby || null;
  const thickness = item?.thickness || null;
  const angle = item?.angle || null;
  const req = useRequired({
    madeby: !!madeby && (madeby !== HardwareMadeBy.DIRECT_INPUT || !!item?.madebyInput?.trim() || "제조사를 입력해주세요"),
    thickness: !!thickness && (thickness !== HingeThickness.DIRECT_INPUT || !!digits(item?.thicknessInput) || "합판 두께를 입력해주세요"),
    angle: !!angle && (angle !== HingeAngle.DIRECT_INPUT || !!digits(item?.angleInput) || "각도를 입력해주세요"),
  });

  useEffect(() => {
    setScreenName("hardware_hinge");
    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
      previous_screen: getPreviousScreenName(),
    });
  }, []);

  return (
    <div className="flex flex-col pt-[90px]">
      <InitAmplitude />
      <TopNavigator />
      <ProgressBar progress={60} />
      <Header title="경첩 정보를 입력해주세요" />
      <div className="h-5" />
      <div className="flex flex-col gap-5 px-5">
        <Field label="제조사" required fieldRef={req.ref("madeby")} error={req.error("madeby")}>
          <Choose<HardwareMadeBy>
            aria-label="제조사"
            value={madeby}
            onChange={(v) => set({ madeby: v, madebyInput: v === HardwareMadeBy.DIRECT_INPUT ? item?.madebyInput ?? "" : "" })}
            options={MADEBY}
          />
          {madeby === HardwareMadeBy.DIRECT_INPUT && (
            <Input
              placeholder="제조사 직접 입력"
              aria-invalid={!!req.error("madeby")}
              value={item?.madebyInput ?? ""}
              onChange={(e) => set({ madebyInput: e.target.value })}
            />
          )}
        </Field>
        <Field label="합판 두께" required fieldRef={req.ref("thickness")} error={req.error("thickness")}>
          <Choose<HingeThickness>
            aria-label="합판 두께"
            value={thickness}
            onChange={(v) => set({ thickness: v, thicknessInput: v === HingeThickness.DIRECT_INPUT ? item?.thicknessInput ?? "" : "" })}
            options={opts(HingeThickness)}
          />
          {thickness === HingeThickness.DIRECT_INPUT && (
            <NumberInput
              unit="T"
              decimal
              placeholder="합판 두께 직접 입력"
              aria-invalid={!!req.error("thickness")}
              value={digits(item?.thicknessInput)}
              onChange={(v) => set({ thicknessInput: v && `${v}T` })}
            />
          )}
        </Field>
        <Field label="각도" required fieldRef={req.ref("angle")} error={req.error("angle")}>
          <Choose<HingeAngle>
            aria-label="각도"
            value={angle}
            onChange={(v) => set({ angle: v, angleInput: v === HingeAngle.DIRECT_INPUT ? item?.angleInput ?? "" : "" })}
            options={opts(HingeAngle)}
          />
          {angle === HingeAngle.DIRECT_INPUT && (
            <NumberInput
              unit="°"
              placeholder="각도 직접 입력"
              aria-invalid={!!req.error("angle")}
              value={digits(item?.angleInput)}
              onChange={(v) => set({ angleInput: v && `${v}°` })}
            />
          )}
        </Field>
        <Field label="제작 시 요청사항">
          <Input placeholder="제작 시 요청사항을 입력해주세요" value={item?.request ?? ""} onChange={(e) => set({ request: e.target.value })} />
        </Field>
      </div>
      <div className="h-[100px]" />
      <BottomBar>
        <Button
          onClick={() => {
            if (!req.check()) return;
            trackClick({ object_type: "button", object_name: "confirm", current_page: getScreenName(), modal_name: null });
            router.push("/hardware/report");
          }}
        >
          다음
        </Button>
      </BottomBar>
    </div>
  );
}
