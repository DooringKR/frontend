"use client";

import { Search } from "lucide-react";
import Script from "next/script";
import { useEffect, useState } from "react";

import { inputBox } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * 주소 검색 칸 — Daum 우편번호로 고른다(주소는 전부 지도·주소 API로). 바로키친 어드민 AddressField 와 같은 자리.
 * 고르면 도로명(없으면 지번) 주소를 onPick 으로 넘긴다. 상세 주소·거리 재기는 쓰는 화면이 이어서 한다.
 * 스크립트가 아직 안 떴으면 칸에 「불러오는 중」을 보이고 막는다(예전엔 alert).
 */
export default function AddressField({
  value,
  onPick,
  placeholder = "건물, 지번 또는 도로명 검색",
  className,
  "aria-invalid": invalid,
}: {
  value: string;
  onPick: (address: string) => void;
  placeholder?: string;
  className?: string;
  "aria-invalid"?: boolean;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.daum?.Postcode) setReady(true);
  }, []);

  return (
    <>
      <button
        type="button"
        disabled={!ready}
        aria-invalid={invalid}
        onClick={() =>
          new window.daum.Postcode({
            oncomplete: (d: { roadAddress?: string; address: string }) => onPick(d.roadAddress || d.address),
          }).open()
        }
        className={cn(inputBox, "items-center justify-between gap-2 text-left disabled:bg-background", className)}
      >
        <span className={cn("truncate", value ? "text-gray-700" : "text-gray-400")}>{ready ? value || placeholder : "불러오는 중"}</span>
        <Search className="size-5 shrink-0 text-gray-400" />
      </button>
      <Script src="//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="afterInteractive" onLoad={() => setReady(true)} />
    </>
  );
}
