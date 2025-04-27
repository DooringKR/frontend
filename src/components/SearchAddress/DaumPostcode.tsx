"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

interface DaumPostcodeData {
  address: string;
  addressType: "R" | "J";
  bname: string;
  buildingName: string;
  zonecode: string;
  roadAddress: string;
  roadname: string;
  jibunAddress: string;
  sido: string;
  sigungu: string;
  userSelectedType: "R" | "J";
}

interface DaumPostcodePopupProps {
  onComplete: (data: DaumPostcodeData) => void;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: DaumPostcodeData) => void;
        onclose?: () => void;
      }) => {
        open: () => void;
      };
    };
  }
}

const DaumPostcodePopup = ({ onComplete }: DaumPostcodePopupProps) => {
  const scriptLoadedRef = useRef(false);

  const openPostcodePopup = useCallback(() => {
    if (typeof window === "undefined" || !window.daum?.Postcode) return;

    new window.daum.Postcode({
      oncomplete: data => {
        onComplete(data);
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
        className="rounded"
      >
        우편번호 검색
      </button>

      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
    </>
  );
};

export default DaumPostcodePopup;
