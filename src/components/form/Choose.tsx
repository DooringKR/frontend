"use client";

import { Check, ChevronDown, ChevronRight, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { checkboxVariants } from "@/components/ui/checkbox";
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/components/ui/carousel";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn, imageSrc } from "@/lib/utils";

/**
 * 값 고르기(하나·여러 개) — 바로키친 어드민 form/Choose 와 같은 규칙: 모양은 컴포넌트가 정한다(화면이 고르지 않는다).
 *  - 칸(cells): 설명 없는 선택지가 4개 이하이고 한 칸 폭에 들어가면(2개 10자·3개 7자·4개 5자) 한 줄 칸. 5~6개 짧은 것은 두 줄.
 *  - 줄(cards): 그 밖은 카드 줄(이름 + 설명 + 고름 표시).
 *  - 시트(sheet): 선택지가 9개 이상이면 칸 하나를 누르면 시트에 목록.
 * emphasized = 눈에 띄게(화면 1 「바로배송」), disabled = 지금은 못 고름(이유는 화면이 보인다).
 * 누를 수 있다는 표시(2026-11-13 사용자 「체크·라디오 표시」): 줄은 왼쪽에 빈 네모(여러 개)·동그라미(하나)를 늘 보이고 고르면 채운다
 * (프로젝트 shadcn Checkbox square·circle 모양 그대로 — 카드가 이미 버튼이라 안에 버튼을 또 넣지 않고 모양만), 칸은 shadcn Toggle outline.
 * aria-invalid = 골라야 하는데 안 고름 — 선택지 테두리를 빨간 1px로(그림자 링은 겹쳐 두꺼워 보여 뺌, 2026-11-15). 알림 글은 Field 이름 줄 오른쪽.
 */
export interface ChooseOption<V extends string> {
  value: V;
  label: string;
  description?: React.ReactNode;
  disabled?: boolean;
  emphasized?: boolean;
  /** 견본 그림 — 주소면 카드 왼쪽 24px, 그림(ReactNode)이면 그대로. 있으면 카드 모양(시트 줄에도 보인다) */
  image?: string | React.ReactNode;
  /** 이름 옆 짧은 띠(「추천」「인기」) */
  badge?: React.ReactNode;
  /**
   * 자세히 보기 — 카드 오른쪽 「자세히 ›」를 누르면 팝업(제목 = 이름, 설명 = text, 사진 여러 장은 밀어 넘기기). 카드는 그림·이름만 두고 고르기만 한다
   * (2026-11-15 사용자 「선택과 내용 보기를 구분」). 「자세히」는 카드 버튼 안이 아니라 옆에 둔다(버튼 안 버튼 금지).
   */
  detail?: { text: React.ReactNode; images?: string[] };
  /** 카드 아래 칸 — 체크·그림·글 줄 밑에 카드 왼쪽 끝부터 오른쪽 끝까지(상황 입력 첫 장 품목 미리보기, 2026-11-15) */
  extra?: React.ReactNode;
}

type Single<V extends string> = { multiple?: false; value: V | null; onChange: (v: V) => void };
type Multi<V extends string> = { multiple: true; value: V[]; onChange: (v: V[]) => void };

export type ChooseProps<V extends string> = (Single<V> | Multi<V>) & {
  options: ChooseOption<V>[];
  /** 시트 모양일 때 칸에 보일 글·시트 제목 */
  placeholder?: string;
  title?: string;
  className?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
};

const FIT: Record<number, number> = { 2: 10, 3: 7, 4: 5, 5: 5, 6: 5 };

export function shapeOf(options: ChooseOption<string>[]): "cells" | "cards" | "sheet" {
  if (options.length >= 9) return "sheet";
  const plain = options.every((o) => !o.description && !o.emphasized && !o.image && !o.badge);
  const max = Math.max(...options.map((o) => o.label.length));
  if (plain && options.length >= 2 && options.length <= 6 && max <= (FIT[options.length] ?? 0)) return "cells";
  // 짧진 않아도 4개 이하·설명 없음·10자 이하면 두 칸씩
  if (plain && options.length <= 4 && max <= 10) return "cells";
  return "cards";
}

export default function Choose<V extends string>(props: ChooseProps<V>) {
  const { options, className } = props;
  const shape = shapeOf(options);
  const picked = (v: V) => (props.multiple ? props.value.includes(v) : props.value === v);
  // 시트가 닫히는 동안에도 내용이 남게 — 연 선택지와 열림을 따로 둔다
  const [shown, setShown] = useState<ChooseOption<V> | null>(null);
  const [open, setOpen] = useState(false);

  if (shape === "sheet") return <ChooseSheet {...props} />;

  const cols = shape === "cells" ? (options.length <= 3 ? options.length : options.length === 4 && Math.max(...options.map((o) => o.label.length)) <= 5 ? 4 : 2) : 1;
  const common = {
    className: cn("grid w-full gap-2", className),
    style: { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` },
    "aria-label": props["aria-label"],
  };
  const invalid = props["aria-invalid"] || undefined;
  const items = options.map((o) =>
    shape === "cells" ? (
      <ToggleGroupItem
        key={o.value}
        value={o.value}
        disabled={o.disabled}
        aria-invalid={invalid}
        variant="outline"
        className="h-10 rounded-[12px] bg-background px-2 text-[16px] font-500 text-gray-700 data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground aria-[invalid=true]:border-destructive"
      >
        {o.label}
      </ToggleGroupItem>
    ) : (
      <CardFrame
        key={o.value}
        option={o}
        invalid={invalid}
        look={
          o.disabled
            ? "border-gray-100 bg-muted text-gray-300"
            : picked(o.value)
              ? "border-primary bg-brand-50"
              : o.emphasized
                ? "border-red-200 bg-red-50"
                : "border-border bg-background hover:bg-muted"
        }
        onDetail={() => {
          setShown(o);
          setOpen(true);
        }}
      >
        <CardBody extra={o.extra}>
        <span
          aria-hidden
          data-state={picked(o.value) ? "checked" : "unchecked"}
          className={cn(checkboxVariants({ variant: props.multiple ? "square" : "circle" }), "mt-0.5", o.disabled && "opacity-40")}
        >
          {picked(o.value) && <Check strokeWidth={3} />}
        </span>
        {o.image && <OptionImage image={o.image} />}
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            className={cn(
              "text-[17px] font-600",
              o.disabled ? "" : o.emphasized && !picked(o.value) ? "text-red-600" : "text-gray-800",
            )}
          >
            {o.label}
            {o.badge && <span className="ml-1.5 align-middle">{o.badge}</span>}
          </span>
          {o.description && <span className={cn("text-[14px] font-400", o.disabled ? "" : "text-gray-500")}>{o.description}</span>}
        </span>
        </CardBody>
      </CardFrame>
    ),
  );

  return (
    <>
      {props.multiple ? (
        <ToggleGroup type="multiple" value={props.value} onValueChange={(v) => props.onChange(v as V[])} {...common}>
          {items}
        </ToggleGroup>
      ) : (
        // 하나 고르기는 고른 것을 다시 눌러도 비우지 않는다
        <ToggleGroup type="single" value={props.value ?? ""} onValueChange={(v) => v && props.onChange(v as V)} {...common}>
          {items}
        </ToggleGroup>
      )}
      {shown?.detail && <DetailPopup open={open} onOpenChange={setOpen} title={shown.label} {...shown.detail} />}
    </>
  );
}

/**
 * 자세히 팝업(2026-11-15 사용자 「팝업으로, 사진 여러 장, 여러 장이면 슬라이드」) — 가운데 창(shadcn Dialog).
 * 바깥 모양은 바텀시트(Drawer)와 같게: 양옆 10·최대 폭 440·둥글기 24·높이 최대 85%. 머리는 Sheet 처럼 제목 줄 오른쪽에 버튼(닫기 X — NavRow 꺾쇠와 같은 20·회색),
 * 제목·설명 글은 Drawer 제목·설명과 같은 글자. 사진이 둘 이상이면 Carousel 로 밀어 넘기고 밑에 점(CarouselDots).
 */
function DetailPopup({
  open,
  onOpenChange,
  title,
  text,
  images = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  text: React.ReactNode;
  images?: string[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-[calc(100%-20px)] max-w-[440px] flex-col gap-5 overflow-y-auto rounded-[24px] border-0 p-5 [&>button]:hidden">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-[20px]/[28px] font-700 text-gray-900">{title}</DialogTitle>
            <DialogClose aria-label="닫기" className="shrink-0 text-gray-400">
              <X className="size-5" />
            </DialogClose>
          </div>
          <DialogDescription className="text-[16px]/[22px] font-400 text-gray-500">{text}</DialogDescription>
        </div>
        {images.length > 0 && (
          <Carousel>
            <CarouselContent>
              {images.map((src, i) => (
                <CarouselItem key={`${i}-${src}`}>
                  {/* 비율이 다른 사진도 같은 틀(가장 긴 사진 높이) 가운데에 — 넘길 때 칸이 들쭉날쭉하지 않게 */}
                  <div className="flex h-full items-center overflow-hidden rounded-[12px] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${title} 사진 ${i + 1}`} className="w-full" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && <CarouselDots className="mt-3" />}
          </Carousel>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** 카드 속 — 아래 칸(extra)이 있으면 체크·그림·글 줄 밑에 카드 폭 전체로, 사이는 카드 안 간격(12) */
function CardBody({ extra, children }: { extra?: React.ReactNode; children: React.ReactNode }) {
  if (!extra) return <>{children}</>;
  return (
    <span className="flex w-full flex-col gap-3">
      <span className="flex w-full items-start gap-3">{children}</span>
      {extra}
    </span>
  );
}

/** 카드 한 칸 — 자세히가 있으면 테두리를 바깥 틀로 옮기고 오른쪽에 「자세히 ›」(글 = Sheet 머리 글 버튼, 꺾쇠 = NavRow, 오른쪽 여백 = 카드 px-5) */
function CardFrame<V extends string>({
  option: o,
  invalid,
  look,
  onDetail,
  children,
}: {
  option: ChooseOption<V>;
  invalid?: boolean;
  look: string;
  onDetail: () => void;
  children: React.ReactNode;
}) {
  const item = (
    <ToggleGroupItem
      value={o.value}
      disabled={o.disabled}
      aria-invalid={invalid}
      className={cn(
        "flex h-auto items-start justify-start gap-3 rounded-[12px] px-5 py-4 text-left transition-colors",
        o.detail ? "min-w-0 flex-1 hover:bg-transparent data-[state=on]:bg-transparent" : cn("w-full border aria-[invalid=true]:border-destructive", look),
      )}
    >
      {children}
    </ToggleGroupItem>
  );
  if (!o.detail) return item;
  return (
    <div className={cn("flex rounded-[12px] border transition-colors", look, invalid && "border-destructive")}>
      {item}
      <button type="button" onClick={onDetail} className="flex shrink-0 items-center self-stretch pl-3 pr-5 text-[15px]/[22px] font-500 text-gray-400">
        자세히
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

function OptionImage({ image }: { image: string | React.ReactNode }) {
  const src = imageSrc(image);
  if (!src) return <span className="-my-1 shrink-0">{image}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="size-6 shrink-0 rounded-[4px] object-cover shadow-[inset_0_0_0_1px_rgba(3,7,18,0.05)]" />;
}

function ChooseSheet<V extends string>(props: ChooseProps<V>) {
  const [open, setOpen] = useState(false);
  const { options, placeholder = "선택해 주세요", title } = props;
  const labels = options.filter((o) => (props.multiple ? props.value.includes(o.value) : props.value === o.value)).map((o) => o.label);
  const pick = (v: V) => {
    if (props.multiple) props.onChange(props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v]);
    else {
      props.onChange(v);
      setOpen(false);
    }
  };
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={props["aria-label"]}
        className={cn(
          "flex h-[50px] w-full items-center justify-between rounded-[12px] border border-input bg-background px-4 text-left text-[17px] transition-colors hover:border-brand-100 focus-visible:border-brand-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-300",
          props.className,
        )}
      >
        <span className={cn("truncate", labels.length ? "text-gray-700" : "text-gray-400")}>{labels.join(", ") || placeholder}</span>
        <ChevronDown className="size-5 shrink-0 text-gray-400" />
      </button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title ?? placeholder}</DrawerTitle>
            <DrawerDescription className="sr-only">{title ?? placeholder}</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col overflow-y-auto px-2 py-3">
            {options.map((o) => {
              const on = props.multiple ? props.value.includes(o.value) : props.value === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  disabled={o.disabled}
                  onClick={() => pick(o.value)}
                  className="flex min-h-12 w-full items-center gap-3 rounded-[12px] px-3 py-2 text-left text-[17px] font-500 text-gray-700 hover:bg-muted disabled:text-gray-300"
                >
                  {o.image && <OptionImage image={o.image} />}
                  <span className="flex min-w-0 flex-1 flex-col">
                    {o.label}
                    {o.description && <span className="text-[14px] font-400 text-gray-500">{o.description}</span>}
                  </span>
                  {on && <Check className="size-5 shrink-0 text-primary" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
          {props.multiple && (
            <div className="p-5 pt-2">
              <Button className="w-full" onClick={() => setOpen(false)}>
                {labels.length}개 고르기
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
