"use client";

import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


function BridgePage() {

    const router = useRouter();  
    const userId = useUserStore(state => state.id);

    // 로그인 상태 체크
    useEffect(() => {
      if (userId) {
      router.replace("/");
      }
    }, [userId, router]);


  return (
    <>
  <div className="flex min-h-screen flex-col px-5 py-[60px] bg-gray-100">
        {/* 상단 */}
        <div className="flex flex-col gap-8 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="77" height="21" viewBox="0 0 77 21" fill="none">
                <g clip-path="url(#clip0_2591_11354)">
                    <path d="M72.9563 1.58089V1.25781H60.7441V3.92858H69.8644C69.839 4.34615 69.773 5.00504 69.6633 5.91455L69.6631 5.91644L69.6628 5.91835C69.535 7.09778 69.3287 8.35767 69.0433 9.69826L68.9605 10.0886H72.0365L72.0886 9.82886C72.32 8.67094 72.5223 7.39213 72.6955 5.99286C72.8695 4.58583 72.9563 3.11509 72.9563 1.58089Z" fill="#99A1AF"/>
                    <path d="M68.4768 13.0283H77.0061V10.3359H57.4492V13.0283H65.44V20.9975H68.4768V13.0283Z" fill="#99A1AF"/>
                    <path d="M48.6879 3.04831L48.7404 2.67969H38.9989V5.35044H45.2495C44.3878 8.21036 42.2945 11.0369 38.9222 13.8245L38.623 14.0719L40.8479 15.9352L41.0546 15.7676C45.4305 12.2203 47.9855 7.97925 48.6879 3.04831Z" fill="#99A1AF"/>
                    <path d="M57.4479 7.02154H54.0447V0H51.0508V20.6123H54.0447V9.8H57.4479V7.02154Z" fill="#99A1AF"/>
                    <path d="M25.4629 8.9886H33.7983V1.85938H22.3398V4.48707H30.7612V6.36092H22.4259V13.6194H26.7766V15.5363H18.4844V18.2286H38.0412V15.5363H29.8351V13.6194H34.2075V10.9917H25.4629V8.9886Z" fill="#99A1AF"/>
                    <path d="M15.2708 6.95693H18.6739V9.73539H15.2708V20.6123H12.2769V0H15.2708V6.95693ZM2.95078 6.50461H7.08615V2.52H10.0369V14.6892H0V2.52H2.95078V6.50461ZM2.95078 9.15385V12.0185H7.08615V9.15385H2.95078Z" fill="#99A1AF"/>
                </g>
                <defs>
                    <clipPath id="clip0_2591_11354">
                    <rect width="77" height="21" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
      <div>
        <div className="text-[26px] leading-[36px] text-gray-900 font-bold">주문 즉시 제작,</div>
        <div className="text-[26px] leading-[36px] font-bold bg-gradient-to-r from-[#172554] to-[#2563EB] bg-clip-text text-transparent">오늘 안에 배송.</div>
      </div>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="81" height="80" viewBox="0 0 81 80" fill="none">
                <g clip-path="url(#clip0_2591_11364)">
                    <path d="M78.2603 43.7016C78.2603 40.0036 75.9123 36.7156 72.4163 35.5136L66.8463 33.6016H6.53633C4.43833 33.6016 2.73633 35.3036 2.73633 37.4016V56.9516H78.2623L78.2603 43.7016Z" fill="#4592FB"/>
                    <path d="M2.73633 56.9531V59.0191C2.73633 61.0131 4.35233 62.6291 6.34633 62.6291H74.4603C76.5583 62.6291 78.2603 60.9271 78.2603 58.8291V56.9531H2.73633Z" fill="#2D67D5"/>
                    <path d="M63.7012 69.7344C69.224 69.7344 73.7012 65.2572 73.7012 59.7344C73.7012 54.2115 69.224 49.7344 63.7012 49.7344C58.1783 49.7344 53.7012 54.2115 53.7012 59.7344C53.7012 65.2572 58.1783 69.7344 63.7012 69.7344Z" fill="#313D4C"/>
                    <path d="M63.7012 63.7344C65.9103 63.7344 67.7012 61.9435 67.7012 59.7344C67.7012 57.5252 65.9103 55.7344 63.7012 55.7344C61.492 55.7344 59.7012 57.5252 59.7012 59.7344C59.7012 61.9435 61.492 63.7344 63.7012 63.7344Z" fill="#6B7683"/>
                    <path d="M17.2988 69.7344C22.8217 69.7344 27.2988 65.2572 27.2988 59.7344C27.2988 54.2115 22.8217 49.7344 17.2988 49.7344C11.776 49.7344 7.29883 54.2115 7.29883 59.7344C7.29883 65.2572 11.776 69.7344 17.2988 69.7344Z" fill="#313D4C"/>
                    <path d="M17.2988 63.7344C19.508 63.7344 21.2988 61.9435 21.2988 59.7344C21.2988 57.5252 19.508 55.7344 17.2988 55.7344C15.0897 55.7344 13.2988 57.5252 13.2988 59.7344C13.2988 61.9435 15.0897 63.7344 17.2988 63.7344Z" fill="#6B7683"/>
                    <path d="M78.2598 48.6582H76.6758C75.3638 48.6582 74.2998 47.5942 74.2998 46.2822C74.2998 44.9702 75.3638 43.9062 76.6758 43.9062H78.2598V48.6582Z" fill="white"/>
                    <path d="M2.7373 48.6562H6.2213C7.53331 48.6562 8.5973 47.5923 8.5973 46.2823C8.5973 44.9703 7.5333 43.9062 6.2233 43.9062H2.7393V48.6562H2.7373Z" fill="#EF4452"/>
                    <path d="M60.1032 17.0571C58.9472 14.1771 56.1552 12.2891 53.0512 12.2891H18.0472C14.1972 12.2891 10.8952 15.0311 10.1852 18.8131L7.40918 33.6011H66.7452L60.1032 17.0571Z" fill="#313D4C"/>
                </g>
                <defs>
                    <clipPath id="clip0_2591_11364">
                    <rect width="80" height="80" fill="white" transform="translate(0.5)"/>
                    </clipPath>
                </defs>
                </svg>
            </div>
        </div>
  <div className="h-[60px]"></div>
       {/* 웹 주문 */}
       <div
         className="px-4 py-5 cursor-pointer rounded-[12px] bg-white border-4 border-[#BFDBFE] flex flex-col gap-3 items-center"
         onClick={() => {
            router.push('/');
         }}
       >
            <div className="text-[17px] leading-[24px] text-center font-pretendard font-semibold text-[#364153]">웹으로 시작하기</div>
            <div className="flex justify-center items-center gap-2 w-full">
                <div className="flex justify-center items-center gap-1 rounded-[8px] bg-[#FEF2F2] px-[10px] py-[4px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <g clipPath="url(#clip0_2591_11383)">
                        <path d="M17.874 9.99813C17.874 9.10063 18.6015 8.37313 19.499 8.37313V4.27112C19.499 3.81912 19.1325 3.45312 18.681 3.45312H2.31702C1.86502 3.45312 1.49902 3.81962 1.49902 4.27112V8.37313C2.39652 8.37313 3.12402 9.10063 3.12402 9.99813C3.12402 10.8956 2.39652 11.6231 1.49902 11.6231V15.7251C1.49902 16.1771 1.86552 16.5431 2.31702 16.5431H18.6805C19.1325 16.5431 19.4985 16.1766 19.4985 15.7251V11.6231C18.601 11.6231 17.874 10.8956 17.874 9.99813Z" fill="#F56570"/>
                        <path d="M13.254 8.97266L11.3515 8.69616L10.501 6.97266L9.65055 8.69616L7.74805 8.97266L9.12455 10.3147L8.79955 12.2092L10.501 11.3147L12.2025 12.2092L11.8775 10.3147L13.254 8.97266Z" fill="#E32939"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_2591_11383">
                          <rect width="20" height="20" fill="white" transform="translate(0.5)"/>
                        </clipPath>
                      </defs>
                    </svg>
                    <div className="text-center font-pretendard font-medium text-[#EF4444] text-[14px] leading-[20px]">첫 주문 50% 할인</div>
                </div>
                <div className="flex justify-center items-center gap-1 rounded-[8px] bg-[#EFF6FF] px-[10px] py-[4px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <g clipPath="url(#clip0_2591_11389)">
                        <path d="M9.60935 17.3057C10.1504 17.6632 10.8489 17.6632 11.3899 17.3057C13.1074 16.1707 16.8504 13.4597 18.4619 10.4252C20.5874 6.42219 18.0914 2.42969 14.7929 2.42969C12.9124 2.42969 11.7809 3.41219 11.1554 4.25669C10.8259 4.70169 10.1744 4.70169 9.84435 4.25669C9.21885 3.41219 8.08735 2.42969 6.20685 2.42969C2.90835 2.42969 0.412351 6.42219 2.53785 10.4252C4.14885 13.4592 7.89185 16.1707 9.60935 17.3057Z" fill="#1E6EF4"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_2591_11389">
                          <rect width="20" height="20" fill="white" transform="translate(0.5)"/>
                        </clipPath>
                      </defs>
                    </svg>
                    <div className="text-center font-pretendard font-medium text-[#3B82F6] text-[14px] leading-[20px]">인기</div>
                </div>
            </div>
       </div>
  <div className="h-5"></div>
    {/* 전화 주문 */}
    <div className="flex flex-col justify-center items-center gap-[10px] w-full rounded-[12px] bg-white px-4 py-3">
      <div className="w-full text-center font-pretendard font-semibold text-[#364153] text-[17px] leading-[24px] cursor-pointer" onClick={() => {
        window.open("tel:010-9440-1874", "_blank");
      }}>전화 주문</div>
    </div>
      </div>
    </>
  );
}

export default BridgePage;