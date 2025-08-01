"use client";

import { useRouter } from "next/navigation";
import SalesmanIcon from "public/icons/Salesman";
import { useEffect, useState } from "react";

export default function FloatingButton() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkScreenSize = () => {
      setIsVisible(window.innerWidth >= 1024);
    };

    // 초기 체크
    checkScreenSize();

    // 리사이즈 이벤트 리스너
    window.addEventListener("resize", checkScreenSize);

    // 클린업
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-8 right-8 z-50 flex cursor-pointer items-center gap-2 rounded-[12px] bg-white px-4 py-[10px]"
      style={{
        boxShadow: "0 0 20px 0 rgba(3, 7, 18, 0.10)",
      }}
      onClick={() => {
        router.push("/customer-service");
      }}
    >
      <SalesmanIcon />
      <span className="text-[17px]/[24px] font-600 text-gray-500">바로가구에 문의하기</span>
    </div>
  );
}
