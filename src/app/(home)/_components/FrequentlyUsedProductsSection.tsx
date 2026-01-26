"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FrequentlyUsedProductsSection: React.FC = () => {
    const router = useRouter();

    const handleFrequentOrderClick = () => {
        // 자주 찾는 주문 클릭 시 동작 (예: 주문 내역 페이지로 이동)
        router.push("/order-history");
    };

    const handleLongDoorClick = () => {
        // 롱문 클릭 시 동작 (예: 문짝 주문 페이지로 이동)
        router.push("/longdoor/color");
    };

    return (
        <div className="px-5 pb-5">
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <div className="text-[18px] font-600 text-gray-800">자주 찾는 제품</div>

                <div className="flex flex-col gap-3">
                    {/* 롱문 카드 */}
                    <button
                        type="button"
                        onClick={handleLongDoorClick}
                        className="w-full pb-5 pt-5 flex items-center justify-between gap-5"
                    >
                        <Image
                            src="/img/preset/longdoor 2.png"
                            alt="롱문"
                            width={100}
                            height={100}
                            className="w-[80px] h-[80px] object-cover rounded-2xl aspect-square"
                        />
                        <div className="flex items-center gap-5 flex-1">
                            <div className="flex flex-col items-start gap-1 flex-1">

                                <h3 className="text-[17px]/[24px] font-600 text-gray-800 leading-6">
                                    롱문
                                </h3>
                                <p className="text-[14px]/[20px] font-500 text-gray-500 leading-5">
                                    붙박이장, 신발장 문짝 교체용
                                </p>
                            </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <Image
                                src="/icons/Arrow_Right.svg"
                                alt="화살표"
                                width={24}
                                height={24}
                                className="text-gray-600"
                            />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FrequentlyUsedProductsSection;

