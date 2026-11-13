"use client";

import {
  CabinetBehindType,
  CabinetHandleType,
  CabinetLegType,
  CabinetRailType,
  Location,
} from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
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
import { ABSORBER_TYPE_LIST } from "@/constants/absorbertype";
import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { CABINET_DRAWER_TYPE_LIST } from "@/constants/cabinetdrawertype";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import useItemStore, { type BaseItem } from "@/store/itemStore";
import formatColor from "@/utils/formatColor";
import formatLocation from "@/utils/formatLocation";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

export type CabinetKind = "upper" | "lower" | "tall" | "flap" | "drawer" | "open";

const { CHANNEL, OUTER, PULL_DOWN, PUSH } = CabinetHandleType;

/** 종류별 차이 — 손잡이 선택지와 더 받는 칸. 오픈장은 몸통·손잡이·장소 대신 밥솥 레일·하부 서랍장 */
const KIND: Record<CabinetKind, { name: string; handles?: CabinetHandleType[]; leg?: true; absorber?: true; drawer?: true }> = {
  upper: { name: "상부장", handles: [OUTER, PULL_DOWN, PUSH] },
  lower: { name: "하부장", handles: [CHANNEL, OUTER, PUSH], leg: true },
  tall: { name: "키큰장", handles: [CHANNEL, OUTER, PUSH], leg: true },
  flap: { name: "플랩장", handles: [OUTER, PULL_DOWN, PUSH], absorber: true },
  drawer: { name: "서랍장", handles: [CHANNEL, OUTER, PUSH], leg: true, drawer: true },
  open: { name: "오픈장" },
};

/** itemStore 에 쓰는 값 — 키·빈 값 모양은 옛 화면 그대로(리포트·가격 계산이 이 모양을 읽는다) */
type Draft = {
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  color?: string;
  bodyMaterial?: number | null;
  body_material_direct_input?: string;
  behindType?: string;
  cabinet_construct?: boolean;
  request?: string;
  handleType?: string;
  cabinet_location?: string | null;
  legType?: string | null;
  legType_direct_input?: string | null;
  absorber_type?: number | null;
  absorber_type_direct_input?: string;
  drawer_type?: number | null;
  drawer_type_direct_input?: string;
  rail_type?: string;
  rail_type_direct_input?: string;
  riceRail?: string;
  lowerDrawer?: string;
};

const isOf = (e: object, v: unknown) => (Object.values(e) as unknown[]).includes(v);

/** 들어올 때 값 — 종류마다 옛 화면이 쓰던 키만(다른 종류 키를 null 로 남기지 않게) */
function initialDraft(kind: CabinetKind, item: BaseItem | null): Draft {
  const k = KIND[kind];
  const d: Draft = {
    width: item?.width ?? null,
    height: item?.height ?? null,
    depth: item?.depth ?? null,
    color: item?.color ?? "",
    bodyMaterial: typeof item?.bodyMaterial === "number" ? item.bodyMaterial : null,
    body_material_direct_input: item?.body_material_direct_input ?? "",
    behindType: isOf(CabinetBehindType, item?.behindType) ? item?.behindType : CabinetBehindType.URAHOME,
    cabinet_construct: item?.cabinet_construct ?? false,
    request: item?.request ?? "",
  };
  if (kind === "open") return { ...d, riceRail: item?.riceRail ?? "", lowerDrawer: item?.lowerDrawer ?? "" };
  d.handleType = isOf(CabinetHandleType, item?.handleType) ? item?.handleType : "";
  d.cabinet_location = item?.cabinet_location ?? null;
  if (k.leg) {
    d.legType = isOf(CabinetLegType, item?.legType) ? item?.legType : null;
    d.legType_direct_input = item?.legType_direct_input ?? null;
  }
  if (k.absorber) {
    d.absorber_type = typeof item?.absorber_type === "number" ? item.absorber_type : null;
    d.absorber_type_direct_input = item?.absorber_type_direct_input ?? "";
  }
  if (k.drawer) {
    d.drawer_type = typeof item?.drawer_type === "number" ? item.drawer_type : null;
    d.drawer_type_direct_input = item?.drawer_type_direct_input ?? "";
    d.rail_type = item?.rail_type ?? "";
    d.rail_type_direct_input = item?.rail_type_direct_input ?? "";
  }
  return d;
}

const DIRECT = "direct";
/** 서랍 종류 「직접입력」 id — 이것만 직접 입력 글을 같이 저장한다 */
const DRAWER_DIRECT_ID = CABINET_DRAWER_TYPE_LIST.find((o) => o.name === "직접입력")!.id;
const SIZE = [
  { key: "width", label: "너비", max: 99999 },
  { key: "height", label: "높이", max: 9999 },
  { key: "depth", label: "깊이", max: 9999 },
] as const;
const ADD = ["추가", "추가 안 함"].map((v) => ({ value: v, label: v }));

/** 치수 규칙(옛 useCabinetValidation 6벌을 하나로) — 빈 칸은 필수, 범위 밖은 누를 때 칸 밑에 */
const sizeRule = (v: number | null | undefined, max: number) => (v == null ? false : (v >= 1 && v <= max) || `1~${max}mm 로 넣어 주세요`);
const filled = (s: string | null | undefined) => !!s?.trim();

/** 부분장 종류 6가지 입력 화면 — 값은 고칠 때마다 itemStore 에 쓰고, 다음을 누르면 빈 칸으로 옮겨 가 알린다 */
export default function CabinetForm({ kind }: { kind: CabinetKind }) {
  const router = useRouter();
  const item = useItemStore((s) => s.item);
  const updateItem = useItemStore((s) => s.updateItem);
  const k = KIND[kind];
  const open = kind === "open";

  const [f, setF] = useState(() => initialDraft(kind, item));
  const set = (u: Draft) => setF((p) => ({ ...p, ...u }));
  // 「직접 입력」을 골랐지만 아직 안 친 상태 — 저장 모양(null + 빈 글)으로는 구분이 안 돼 화면이 들고 있는다
  const [direct, setDirect] = useState({
    body: filled(f.body_material_direct_input),
    absorber: filled(f.absorber_type_direct_input),
    rail: filled(f.rail_type_direct_input),
  });
  const [images, setImages] = useState<File[]>(item?.raw_images || []);

  useEffect(() => {
    updateItem(f);
  }, [f, updateItem]);

  useEffect(() => {
    setScreenName(`cabinet_${kind}`);
    const prev = getPreviousScreenName();
    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
      previous_screen: prev,
    });
  }, [kind]);

  const req = useRequired({
    color: !!(f.color || item?.cabinet_color_direct_input),
    body: open || f.bodyMaterial != null || filled(f.body_material_direct_input),
    width: sizeRule(f.width, 99999),
    height: sizeRule(f.height, 9999),
    depth: sizeRule(f.depth, 9999),
    absorber: !k.absorber || f.absorber_type != null || filled(f.absorber_type_direct_input),
    drawer: !k.drawer || (f.drawer_type != null && (f.drawer_type !== DRAWER_DIRECT_ID || filled(f.drawer_type_direct_input))),
    handle: open || !!f.handleType,
    rail: !k.drawer || !!f.rail_type || filled(f.rail_type_direct_input),
    riceRail: !open || !!f.riceRail,
    lowerDrawer: !open || !!f.lowerDrawer,
    behind: !!f.behindType,
    location: open || !!f.cabinet_location,
    leg: !k.leg || (!!f.legType && (f.legType !== CabinetLegType.DIRECT_INPUT || filled(f.legType_direct_input))),
  });

  const next = () => {
    if (!req.check()) return;
    trackClick({ object_type: "button", object_name: "confirm", current_page: getScreenName(), modal_name: null });
    router.push("/cabinet/report");
  };

  return (
    <div className="flex flex-col pt-[90px]">
      <InitAmplitude />
      <TopNavigator />
      <ProgressBar progress={80} />
      <Header title={`${k.name} 정보를 입력해주세요`} />
      <div className="h-5" />
      <div className="flex flex-col gap-5 px-5">
        <Field label={open ? "바디 색상" : "도어 색상"} required fieldRef={req.ref("color")} error={req.error("color")}>
          <NavRow
            card
            label={formatColor(f.color) || item?.cabinet_color_direct_input || "색상을 골라 주세요"}
            onClick={() => router.push("/cabinet/color?back=1")}
          />
        </Field>
        {!open && (
          <ChooseOrType
            label="몸통 소재 및 두께"
            fieldRef={req.ref("body")}
            error={req.error("body")}
            options={BODY_MATERIAL_LIST.filter((o) => o.name !== "직접입력").map((o) => ({ value: String(o.id), label: o.name }))}
            value={f.bodyMaterial != null ? String(f.bodyMaterial) : direct.body ? DIRECT : null}
            onChange={(v) => {
              setDirect((d) => ({ ...d, body: v === DIRECT }));
              set(v === DIRECT ? { bodyMaterial: null } : { bodyMaterial: Number(v), body_material_direct_input: "" });
            }}
            text={f.body_material_direct_input ?? ""}
            onText={(t) => set({ body_material_direct_input: t })}
            placeholder="브랜드, 소재, 두께 등"
          />
        )}
        {SIZE.map(({ key, label }) => (
          <Field key={key} label={label} required fieldRef={req.ref(key)} error={req.error(key)}>
            <NumberInput
              unit="mm"
              placeholder={`${label}를 입력해주세요`}
              value={f[key]}
              onChange={(v) => set({ [key]: v ? Number(v) : null })}
              aria-invalid={!!req.error(key)}
            />
          </Field>
        ))}
        {k.absorber && (
          <ChooseOrType
            label="쇼바 종류"
            fieldRef={req.ref("absorber")}
            error={req.error("absorber")}
            options={ABSORBER_TYPE_LIST.filter((o) => o.name !== "직접입력").map((o) => ({ value: String(o.id), label: o.name }))}
            value={f.absorber_type != null ? String(f.absorber_type) : direct.absorber ? DIRECT : null}
            onChange={(v) => {
              setDirect((d) => ({ ...d, absorber: v === DIRECT }));
              set(v === DIRECT ? { absorber_type: null } : { absorber_type: Number(v), absorber_type_direct_input: "" });
            }}
            text={f.absorber_type_direct_input ?? ""}
            onText={(t) => set({ absorber_type_direct_input: t })}
            placeholder="쇼바 종류를 입력해주세요"
          />
        )}
        {k.drawer && (
          <ChooseOrType
            label="서랍 종류"
            fieldRef={req.ref("drawer")}
            error={req.error("drawer")}
            options={CABINET_DRAWER_TYPE_LIST.filter((o) => o.id !== DRAWER_DIRECT_ID).map((o) => ({ value: String(o.id), label: o.name }))}
            value={f.drawer_type == null ? null : f.drawer_type === DRAWER_DIRECT_ID ? DIRECT : String(f.drawer_type)}
            onChange={(v) => set(v === DIRECT ? { drawer_type: DRAWER_DIRECT_ID } : { drawer_type: Number(v), drawer_type_direct_input: "" })}
            text={f.drawer_type_direct_input ?? ""}
            onText={(t) => set({ drawer_type_direct_input: t })}
            placeholder="구체적으로 꼼꼼히 입력해주세요"
          />
        )}
        {k.handles && (
          <Field label="손잡이 종류" required fieldRef={req.ref("handle")} error={req.error("handle")}>
            <Choose<string>
              aria-label="손잡이 종류"
              value={f.handleType || null}
              onChange={(v) => set({ handleType: v })}
              options={k.handles.map((h) => ({ value: h, label: h }))}
            />
          </Field>
        )}
        {k.drawer && (
          <ChooseOrType
            label="레일 종류"
            fieldRef={req.ref("rail")}
            error={req.error("rail")}
            options={Object.values(CabinetRailType)
              .filter((r) => r !== CabinetRailType.DIRECT_INPUT)
              .map((r) => ({ value: r, label: r }))}
            value={f.rail_type || (direct.rail ? DIRECT : null)}
            onChange={(v) => {
              setDirect((d) => ({ ...d, rail: v === DIRECT }));
              set(v === DIRECT ? { rail_type: "" } : { rail_type: v, rail_type_direct_input: "" });
            }}
            text={f.rail_type_direct_input ?? ""}
            onText={(t) => set({ rail_type: "", rail_type_direct_input: t })}
            placeholder="레일 종류를 입력해주세요"
          />
        )}
        {open && (
          <>
            <Field label="밥솥 레일 추가 여부" required fieldRef={req.ref("riceRail")} error={req.error("riceRail")}>
              <Choose aria-label="밥솥 레일 추가 여부" value={f.riceRail || null} onChange={(v) => set({ riceRail: v })} options={ADD} />
            </Field>
            <Field label="하부 서랍장 추가 여부" required fieldRef={req.ref("lowerDrawer")} error={req.error("lowerDrawer")}>
              <Choose aria-label="하부 서랍장 추가 여부" value={f.lowerDrawer || null} onChange={(v) => set({ lowerDrawer: v })} options={ADD} />
            </Field>
          </>
        )}
        <Field label="마감 방식" required fieldRef={req.ref("behind")} error={req.error("behind")}>
          <Choose<string>
            aria-label="마감 방식"
            value={f.behindType || null}
            onChange={(v) => set({ behindType: v })}
            options={[
              { value: CabinetBehindType.URAHOME, label: "일반 (우라홈)" },
              { value: CabinetBehindType.MAK_URA, label: CabinetBehindType.MAK_URA },
            ]}
          />
        </Field>
        {!open && (
          <Field label="용도 ∙ 장소" required fieldRef={req.ref("location")} error={req.error("location")}>
            <Choose<string>
              aria-label="용도 ∙ 장소"
              value={f.cabinet_location ?? null}
              onChange={(v) => set({ cabinet_location: v })}
              options={Object.values(Location).map((l) => ({ value: l, label: formatLocation(l) }))}
            />
          </Field>
        )}
        <Field label="시공 필요 여부">
          <Choose
            aria-label="시공 필요 여부"
            value={f.cabinet_construct ? "yes" : "no"}
            onChange={(v) => set({ cabinet_construct: v === "yes" })}
            options={[
              { value: "yes", label: "시공도 필요해요" },
              { value: "no", label: "필요 없어요" },
            ]}
          />
        </Field>
        {k.leg && (
          <ChooseOrType
            label="다리발"
            fieldRef={req.ref("leg")}
            error={req.error("leg")}
            options={Object.values(CabinetLegType)
              .filter((l) => l !== CabinetLegType.DIRECT_INPUT)
              .map((l) => ({ value: l, label: l }))}
            value={!f.legType ? null : f.legType === CabinetLegType.DIRECT_INPUT ? DIRECT : f.legType}
            onChange={(v) => set(v === DIRECT ? { legType: CabinetLegType.DIRECT_INPUT } : { legType: v, legType_direct_input: "" })}
            text={f.legType_direct_input ?? ""}
            onText={(t) => set({ legType_direct_input: t })}
            placeholder="다리발 종류를 입력해주세요"
          />
        )}
        <Field label="제작 시 요청사항">
          <Input
            placeholder="예) 한쪽에 EP마감이 들어가요, 걸레받이 넣어주세요 등"
            value={f.request ?? ""}
            onChange={(e) => set({ request: e.target.value })}
          />
        </Field>
        <Field label="이미지 첨부">
          <PhotoPick
            value={images}
            placeholder="이미지를 첨부해주세요"
            onChange={(files) => {
              setImages(files);
              updateItem({ raw_images: files });
            }}
          />
        </Field>
      </div>
      <div className="h-[100px]" />
      <BottomBar id="cabinet-next-button">
          <Button onClick={next}>다음</Button>
        </BottomBar>
    </div>
  );
}

/** 고르기 + 「직접 입력」 — 직접 입력을 고르면 같은 칸 안 Choose 밑에 글자 칸 */
function ChooseOrType(p: {
  label: string;
  fieldRef: (el: HTMLElement | null) => void;
  error?: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (v: string) => void;
  text: string;
  onText: (t: string) => void;
  placeholder: string;
}) {
  return (
    <Field label={p.label} required fieldRef={p.fieldRef} error={p.error}>
      <Choose aria-label={p.label} options={[...p.options, { value: DIRECT, label: "직접 입력" }]} value={p.value} onChange={p.onChange} />
      {p.value === DIRECT && (
        <Input
          aria-label={`${p.label} 직접 입력`}
          placeholder={p.placeholder}
          value={p.text}
          onChange={(e) => p.onText(e.target.value)}
          aria-invalid={!!p.error}
        />
      )}
    </Field>
  );
}
