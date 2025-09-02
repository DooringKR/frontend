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
    <div className="flex flex-col gap-3 bg-gray-50 px-5 pt-[32px] pb-[100px] text-[14px]/[20px] text-gray-400">
      <div>
        <div className="font-700">주식회사 도어링</div>
        <div className="font-400 ">사업자 등록번호 : 828-88-03247 | 대표 : 최범주</div>
        <div className="font-400">12048 경기도 남양주시 오남읍 양지로139번길 11-14</div>
      </div>
      <div className="flex justify-between">
        <div className="font-400">@ 2025 주식회사 도어링</div>
        {isVisible && (
          <div className="underline cursor-pointer" onClick={handleContactButtonClick}>
            고객센터
          </div>
        )}
      </div>
    </div>
  );
}

export default Footer;
