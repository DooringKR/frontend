"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Footer() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsVisible(window.innerWidth < 1024);
    };

    // 초기 체크
    checkScreenSize();

    // 리사이즈 이벤트 리스너
    window.addEventListener("resize", checkScreenSize);

    // 클린업
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleContactButtonClick = () => {
    router.push("/customer-service");
  };

  return (
    <div className="flex flex-col gap-5 bg-gray-50 px-5 py-[60px] text-sm text-gray-400">
      <div className="flex justify-between">
        <img src={"/img/Logo.png"} alt="주식회사 도어링 로고" className="h-12 w-12" />
        {isVisible && (
          <button
            onClick={handleContactButtonClick}
            className="rounded-xl border-2 border-gray-200 bg-white px-[14px] py-[10px] text-[17px] font-500 text-gray-700"
          >
            문의
          </button>
        )}
      </div>
      <div>
        <h1 className="font-700">주식회사 도어링</h1>
        <h2 className="font-400">사업자 등록번호 : 828-88-03247 | 대표 : 최범주</h2>
        <h2 className="font-400">12048 경기도 남양주시 오남읍 양지로139번길 11-14</h2>
      </div>
      <div className="font-400">@ 2025 주식회사 도어링</div>
    </div>
  );
}

export default Footer;
