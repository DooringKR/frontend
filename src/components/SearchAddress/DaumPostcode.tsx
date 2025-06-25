"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

interface DaumPostcodePopupProps {
  address1: string;
  onComplete: (address: string) => void;
}

// declare global {
//   interface Window {
//     daum: {
//       Postcode: new (config: { oncomplete: (data: any) => void }) => { open: () => void };
//     };
//   }
// }

export default function DaumPostcodePopup({ address1, onComplete }: DaumPostcodePopupProps) {
  console.log("버튼 클릭됨");

  const scriptLoadedRef = useRef(false);

  const openPostcodePopup = useCallback(() => {
    console.log("스크립트 아직 로드 안 됐음");
    // if (typeof window === "undefined" || !window.daum?.Postcode) return;
    if (!scriptLoadedRef.current) {
      alert("주소 검색 스크립트가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    console.log("스크립트 로드됨, 팝업 실행");

    new window.daum.Postcode({
      oncomplete: data => {
        const address = data.roadAddress || data.address;
        onComplete(address);
      },
    }).open();
  }, [onComplete]);

  const handleScriptLoad = useCallback(() => {
    console.log("다음 스크립트 로드 완료");
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
