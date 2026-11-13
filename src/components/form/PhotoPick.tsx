"use client";

import { ImagePlus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * 사진 고르기 — 점선 상자(누르기·끌어다 놓기) + 고른 사진 칸(지우기 X). 바로키친 어드민 FileDrop 과 같은 규칙.
 * 크기·개수를 넘으면 말없이 버리지 않고 상자 밑에 무엇을 뺐는지 알린다(옛 ImageUploadInput 은 console 에만 남겼다).
 */
export default function PhotoPick({
  value,
  onChange,
  maxFiles = 5,
  maxSizeMB = 5,
  accept = "image/*",
  placeholder = "사진을 첨부해주세요",
  disabled,
  className,
}: {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const urls = useMemo(() => value.map((f) => URL.createObjectURL(f)), [value]);
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);
  const full = value.length >= maxFiles;

  const add = (list: FileList | null) => {
    if (!list) return;
    const files = Array.from(list);
    const big = files.filter((f) => f.size > maxSizeMB * 1024 * 1024);
    const ok = files.filter((f) => f.size <= maxSizeMB * 1024 * 1024 && f.type.startsWith("image/"));
    const room = Math.max(0, maxFiles - value.length);
    const taken = ok.slice(0, room);
    const msgs = [
      big.length ? `${maxSizeMB}MB 넘는 사진 ${big.length}장은 뺐어요` : null,
      ok.length > room ? `${maxFiles}장까지라 ${ok.length - room}장은 뺐어요` : null,
    ].filter(Boolean);
    setNotice(msgs.length ? msgs.join(" · ") : null);
    if (taken.length) onChange([...value, ...taken]);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <button
        type="button"
        disabled={disabled || full}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center gap-1 rounded-[12px] border border-dashed px-6 py-5 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          over ? "border-brand-300 bg-brand-50" : "border-input hover:border-brand-100",
        )}
      >
        <ImagePlus className="size-7 text-gray-400" />
        <span className="text-[14px] text-gray-500">{full ? `${maxFiles}장을 다 골랐어요` : placeholder}</span>
        <span className="text-[12px] text-gray-400">
          최대 {maxSizeMB}MB · {maxFiles}장
        </span>
      </button>
      <input ref={input} type="file" accept={accept} multiple hidden onChange={(e) => (add(e.target.files), (e.target.value = ""))} />
      {notice && (
        <p role="alert" className="text-[14px] text-destructive">
          {notice}
        </p>
      )}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {value.map((f, i) => (
            <div key={`${f.name}-${i}`} className="relative aspect-square overflow-hidden rounded-[12px] bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urls[i]} alt={f.name} className="size-full object-cover" />
              <button
                type="button"
                aria-label={`${f.name} 빼기`}
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="absolute right-1.5 top-1.5 grid size-6 place-content-center rounded-full bg-black/60 text-white"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
