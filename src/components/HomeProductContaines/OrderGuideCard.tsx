"use client";

import React from "react";
import Image from "next/image";

interface OrderGuideCardProps {
    onClick?: () => void;
}

const OrderGuideCard: React.FC<OrderGuideCardProps> = ({ onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full rounded-2xl bg-brand-50 px-5 py-4 flex items-center justify-between"
        >
            <div className="flex items-center gap-5 flex-1">
                <div className="flex flex-col items-start gap-1 flex-1">
                    <h3 className="text-[17px]/[24px] font-600 text-brand-600 leading-6">
                        자재별 주문 가이드
                    </h3>
                    <p className="text-[14px]/[20px] font-500 text-gray-500 leading-5">
                        각 자재별 상세 주문 방법을 확인하세요
                    </p>
                </div>
            </div>
            <div className="ml-4 flex-shrink-0">
                <Image
                    src="/icons/Arrow_Right.svg"
                    alt="화살표"
                    width={24}
                    height={24}
                    className="text-brand-600"
                />
            </div>
        </button>
    );
};

export default OrderGuideCard;

