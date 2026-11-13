"use client";

import Link from "next/link";

import { cn, imageSrc } from "@/lib/utils";

/**
 * 눌러서 이동 — 큰 그림 타일 모양(종류 고르기 화면: 부분장·마감재·부속·문 종류). NavRow 와 같은 동작(누르면 바로 다음 화면).
 * 값을 고르는 일이 아니라 갈 곳을 고르는 일이라 Choose 가 아니다. 두 칸씩, 그림 위·이름 아래.
 * 고른 표시(selected)는 이미 넣던 종류를 알려 줄 때만.
 */
export interface NavTile {
  key: string;
  label: string;
  description?: React.ReactNode;
  /** 그림 주소 또는 그림(svg 등) */
  image?: string | React.ReactNode;
  href?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export default function NavTiles({ items, className }: { items: NavTile[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {items.map((t) => {
        const cls = cn(
          "flex flex-col items-center gap-2 rounded-[12px] border px-3 pb-4 pt-3 text-center transition-colors",
          t.disabled ? "cursor-not-allowed border-gray-100 bg-muted text-gray-300" : t.selected ? "border-primary bg-brand-50" : "border-border bg-background hover:bg-muted",
        );
        const body = (
          <>
            {t.image &&
              (imageSrc(t.image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageSrc(t.image)} alt="" className="aspect-square w-full rounded-[12px] object-contain" />
              ) : (
                <span className="grid aspect-square w-full place-content-center">{t.image}</span>
              ))}
            <span className={cn("text-[16px] font-600", t.disabled ? "" : "text-gray-800")}>{t.label}</span>
            {t.description && <span className="text-[14px] text-gray-500">{t.description}</span>}
          </>
        );
        return t.href && !t.disabled ? (
          <Link key={t.key} href={t.href} className={cls}>
            {body}
          </Link>
        ) : (
          <button key={t.key} type="button" disabled={t.disabled} onClick={t.onClick} className={cls}>
            {body}
          </button>
        );
      })}
    </div>
  );
}
