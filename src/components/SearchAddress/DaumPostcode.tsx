"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

interface DaumPostcodePopupProps {
  address1: string;
  onComplete: (address: string) => void;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (config: { oncomplete: (data: any) => void }) => { open: () => void };
    };
  }
}

export default function DaumPostcodePopup({ address1, onComplete }: DaumPostcodePopupProps) {
  const scriptLoadedRef = useRef(false);

  const openPostcodePopup = useCallback(() => {
    if (typeof window === "undefined" || !window.daum?.Postcode) return;

    new window.daum.Postcode({
      oncomplete: data => {
        const address = data.roadAddress || data.address;
        onComplete(address);
      },
    }).open();
  }, [onComplete]);

  const handleScriptLoad = useCallback(() => {
    scriptLoadedRef.current = true;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.daum?.Postcode) {
      scriptLoadedRef.current = true;
    }
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openPostcodePopup}
        className="min-h-[40px] w-full cursor-pointer border-b-2 border-gray-300 bg-white px-4 py-3 text-left text-base shadow-sm"
      >
        <span className={address1 ? "text-gray-800" : "text-gray-400"}>
          {address1 || "건물, 지번 또는 도로명 검색"}
        </span>
      </button>

      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
    </>
  );
}
