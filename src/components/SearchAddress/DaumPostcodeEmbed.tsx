"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

interface DaumPostcodeEmbedProps {
  onComplete: (address: string) => void;
  onClose?: () => void;
}

const DaumPostcodeEmbed: React.FC<DaumPostcodeEmbedProps> = ({ onComplete, onClose }) => {
  const scriptLoadedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        if (onClose) onClose();
      },
      onresize: size => {
        containerRef.current!.style.height = size.height + "px";
      },
      width: "100%",
      height: "100%",
    }).embed(containerRef.current);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="mt-2 w-full overflow-hidden rounded-md border"
        style={{ height: "400px" }}
      />
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
