"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn, imageSrc } from "@/lib/utils";

/**
 * 값 고르기(하나·여러 개) — 바로키친 어드민 form/Choose 와 같은 규칙: 모양은 컴포넌트가 정한다(화면이 고르지 않는다).
 *  - 칸(cells): 설명 없는 선택지가 4개 이하이고 한 칸 폭에 들어가면(2개 10자·3개 7자·4개 5자) 한 줄 칸. 5~6개 짧은 것은 두 줄.
 *  - 줄(cards): 그 밖은 카드 줄(이름 + 설명 + 고름 표시).
 *  - 시트(sheet): 선택지가 9개 이상이면 칸 하나를 누르면 시트에 목록.
 * emphasized = 눈에 띄게(화면 1 「현장 급한 수습」), disabled = 지금은 못 고름(이유는 화면이 보인다).
 * aria-invalid = 골라야 하는데 안 고름 — 글 대신 선택지 테두리를 빨갛게(shadcn 입력칸 오류 표시와 같은 방식, 2026-11-13).
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
        className="h-10 rounded-[12px] border border-transparent bg-secondary px-2 text-[16px] font-500 text-secondary-foreground hover:bg-gray-200 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-[3px] aria-[invalid=true]:ring-destructive/20"
      >
        {o.label}
      </ToggleGroupItem>
    ) : (
      <ToggleGroupItem
        key={o.value}
        value={o.value}
        disabled={o.disabled}
        aria-invalid={invalid}
        className={cn(
          "flex h-auto w-full items-start justify-between gap-3 rounded-[12px] border px-5 py-4 text-left transition-colors aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-[3px] aria-[invalid=true]:ring-destructive/20",
          o.disabled
            ? "border-gray-100 bg-muted text-gray-300"
            : picked(o.value)
              ? "border-primary bg-brand-50"
              : o.emphasized
                ? "border-red-200 bg-red-50"
                : "border-border bg-background hover:bg-muted",
        )}
      >
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
        {picked(o.value) && <Check className="mt-1 size-5 shrink-0 text-primary" strokeWidth={2.5} />}
      </ToggleGroupItem>
    ),
  );

  return props.multiple ? (
    <ToggleGroup type="multiple" value={props.value} onValueChange={(v) => props.onChange(v as V[])} {...common}>
      {items}
    </ToggleGroup>
  ) : (
    // 하나 고르기는 고른 것을 다시 눌러도 비우지 않는다
    <ToggleGroup type="single" value={props.value ?? ""} onValueChange={(v) => v && props.onChange(v as V)} {...common}>
      {items}
    </ToggleGroup>
  );
}

function OptionImage({ image }: { image: string | React.ReactNode }) {
  const src = imageSrc(image);
  if (!src) return <span className="shrink-0">{image}</span>;
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
