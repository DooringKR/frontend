"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface DaumPostcodeEmbedProps {
  onComplete: (address: string) => void;
  onClose?: () => void;
}

const DaumPostcodeEmbed: React.FC<DaumPostcodeEmbedProps> = ({ onComplete, onClose }) => {
  const scriptLoadedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true); // 검색창 보이기 여부

  useEffect(() => {
    if (typeof window !== "undefined" && window.daum?.Postcode) {
      scriptLoadedRef.current = true;
      loadPostcode();
    }
  }, []);

  const loadPostcode = () => {
    if (!scriptLoadedRef.current || !containerRef.current) return;

    new window.daum.Postcode({
      oncomplete: data => {
        const address = data.roadAddress || data.address;
        onComplete(address);
        handleClose(); // 자동 닫기
      },
      onresize: size => {
        containerRef.current!.style.height = size.height + "px";
      },
      width: "100%",
      height: "100%",
    }).embed(containerRef.current);
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null; // 닫힘 상태면 아무것도 안 보여줌

  return (
    <>
      <div className="mt-2 w-full overflow-hidden rounded-md border" style={{ height: "400px" }}>
        <div ref={containerRef} className="h-full w-full" />
      </div>

      {/* ✅ 아래쪽에 닫기 버튼 배치 */}
      <div className="mt-2 flex justify-end">
        <button
          onClick={handleClose}
          className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-200"
        >
          닫기
        </button>
      </div>

      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={() => {
          scriptLoadedRef.current = true;
          loadPostcode();
        }}
      />
    </>
  );
};

export default DaumPostcodeEmbed;
