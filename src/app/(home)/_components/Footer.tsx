"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import InstagramIcon from "public/icons/instagram";
import NaverBlogIcon from "public/icons/naver-blog";
import KakaoIcon from "public/icons/kakao";

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

      {/* 소셜 미디어 링크 */}
      <div className="flex gap-4 items-center justify-end">
        <Link
          href="https://www.instagram.com/dooring_official/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="인스타그램"
        >
          <InstagramIcon />
        </Link>
        <Link
          href="https://blog.naver.com/dooring-"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="네이버 블로그"
        >
          <NaverBlogIcon />
        </Link>
        <Link
          href="https://pf.kakao.com/_BlAHG"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="카카오톡"
        >
          <KakaoIcon />
        </Link>
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
