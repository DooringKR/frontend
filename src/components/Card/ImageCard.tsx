"use client";

import { useEffect, useMemo } from "react";

import PhotoThumbs from "@/components/media/PhotoThumbs";

/** 첨부한 사진 모아 보기(File) — 누르면 크게 */
function ImageCard({ images, title = "첨부된 이미지" }: { images: File[]; title?: string }) {
  const photos = useMemo(() => (images ?? []).map((f) => ({ src: URL.createObjectURL(f), alt: f.name })), [images]);
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.src)), [photos]);
  if (photos.length === 0) return null;
  return (
    <div className="rounded-[12px] border border-border bg-background p-4">
      <h3 className="mb-3 text-[14px] font-500 text-gray-900">{title}</h3>
      <PhotoThumbs photos={photos} />
    </div>
  );
}

export default ImageCard;
