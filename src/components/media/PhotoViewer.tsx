"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

/**
 * 사진 크게 보기 — 검은 바탕 위 한 장, 여러 장이면 ‹ › 로 넘기기, 닫기 X(Esc·바깥 누르기도 닫힘).
 * 옛 ImageCard·장바구니 카드·주문 상세가 따로 짠 덮개 넷을 하나로(shadcn Dialog).
 */
export default function PhotoViewer({
  photos,
  index,
  onIndexChange,
}: {
  /** 그림 주소(object URL·http) */
  photos: { src: string; alt?: string }[];
  /** 보이는 사진 차례, null 이면 닫힘 */
  index: number | null;
  onIndexChange: (i: number | null) => void;
}) {
  const p = index == null ? null : photos[index];
  return (
    <Dialog open={p != null} onOpenChange={(o) => !o && onIndexChange(null)}>
      <DialogContent className="flex max-h-[90vh] max-w-[440px] items-center justify-center border-0 bg-black/90 p-2 [&>button]:hidden">
        <DialogTitle className="sr-only">사진 크게 보기</DialogTitle>
        <DialogDescription className="sr-only">{p?.alt ?? "사진"}</DialogDescription>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p && <img src={p.src} alt={p.alt ?? ""} className="max-h-[85vh] max-w-full object-contain" />}
        <button type="button" aria-label="닫기" onClick={() => onIndexChange(null)} className="absolute right-3 top-3 grid size-8 place-content-center rounded-full bg-black/60 text-white">
          <X className="size-5" />
        </button>
        {photos.length > 1 && index != null && (
          <>
            <button
              type="button"
              aria-label="앞 사진"
              disabled={index === 0}
              onClick={() => onIndexChange(index - 1)}
              className="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-content-center rounded-full bg-black/60 text-white disabled:opacity-30"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="다음 사진"
              disabled={index === photos.length - 1}
              onClick={() => onIndexChange(index + 1)}
              className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-content-center rounded-full bg-black/60 text-white disabled:opacity-30"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
