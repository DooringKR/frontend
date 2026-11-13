"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import PhotoViewer from "./PhotoViewer";

/**
 * 사진 썸네일 — 누르면 PhotoViewer 로 크게(‹ › 넘기기). size="row" 는 80px 한 줄(주문 상세), "grid" 는 세 칸(첨부 사진 카드).
 */
export default function PhotoThumbs({
  photos,
  size = "grid",
  className,
}: {
  photos: { src: string; alt?: string }[];
  size?: "row" | "grid";
  className?: string;
}) {
  const [at, setAt] = useState<number | null>(null);
  if (photos.length === 0) return null;
  return (
    <>
      <div className={cn(size === "row" ? "flex gap-2" : "grid grid-cols-3 gap-3", className)}>
        {photos.map((p, i) => (
          <button
            key={`${i}-${p.src}`}
            type="button"
            aria-label={`${p.alt ?? "사진"} 크게 보기`}
            onClick={() => setAt(i)}
            className={cn("overflow-hidden rounded-[12px] bg-gray-100", size === "row" ? "size-20 shrink-0" : "aspect-square")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt ?? ""} className="size-full object-cover" />
          </button>
        ))}
      </div>
      <PhotoViewer photos={photos} index={at} onIndexChange={setAt} />
    </>
  );
}
