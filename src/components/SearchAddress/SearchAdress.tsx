"use client";

import DaumPostcodePopup from "@/components/SearchAddress/DaumPostcode";

export default function SearchAddress() {
  const handleComplete = (data: any) => {
    console.log("주소 선택 완료:", data);
  };

  return <DaumPostcodePopup onComplete={handleComplete} />;
}
