"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from '../Button/Button';

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
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const openPostcodePopup = useCallback(() => {
    if (typeof window === "undefined" || !window.daum?.Postcode) return;

    new window.daum.Postcode({
      oncomplete: data => {
        const address = data.roadAddress || data.address;
        setSelectedAddress(address);
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
      <Button
        type="button"
        onClick={openPostcodePopup}
        className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-base text-[#1e1e1e] shadow-sm"
      >
        {selectedAddress || "건물, 지번 또는 도로명 검색"}
      </Button>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
    </>
  );
};

export default DaumPostcodePopup;
