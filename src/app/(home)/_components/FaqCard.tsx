"use client";

import { useState } from "react";

const faqData = [
    {
        question: "정말 작은 단위의 가구도 주문 가능한가요?",
        answer: "네, 하부장 하나, 상부장 하나도 사이즈를 적어주시면 구매가능합니다. 필요시 시공옵션도 선택하실 수 있습니다"
    },
    {
        question: "시공도 가능한가요? 어떻게 어떻게 진행되나요?",
        answer: "바로가구의 시공은 고객님께서 지정해주신 일정 전까지 가구 전문 시공기사의 스케쥴과 상호 고려하여 가능한 일정을 안내해드리고 있습니다. 배송 뿐만 아니라 시공까지 필요하시다면 주문 창에서 시공을 선택해주세요"
    },
    {
        question: "자재는 어떤 등급인가요?",
        answer: "저희 바로가구는 국산 E0 자재와 (주)한솔홈데코의 정품 라솔라보드 자재를 기본으로 취급합니다. 바로가구는 하이엔드 가구 전문 플랫폼(주)도어링의 공장을 직영으로 보유하고 있습니다."
    },
    {
        question: "비용은 어떻게 산정되나요?",
        answer: "바로가구의 맞춤 가구는 사이즈와 구조에 따라 달라질 수 있습니다. AI 자동견적 서비스에서 산출되는 가격은 최소 가격이며, 추가적인 옵션을 담당자가 안내해드린 후 참고해주시면 됩니다."
    },
    {
        question: "배송 기간은 어떻게 되나요?",
        answer: "주소 입력 시 오늘배송이 가능한지 화면에서 안내가 이루어집니다. 주문 시 오늘 배송 옵션 선택시 금일 배송이 가능합니다. 그 외의 날짜를 선택하면 지정한 날짜와 시간에 맞춰 배송이 진행됩니다."
    }
];

export default function FaqCard() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="px-2 py-[40px] flex flex-col">
            <div className="px-4 text-[20px]/[28px] font-700 text-gray-800">자주 묻는 질문</div>
            {faqData.map((faq, index) => {
                const isOpen = openIndex === index;
                const isFirst = index === 0;
                const isLast = index === faqData.length - 1;

                return (
                    <div key={index}>
                        <div className={`${isOpen ? 'mt-2' : isFirst ? 'mt-2 mb-2' : isLast ? 'my-2' : 'my-2'} px-4 py-3 flex justify-between gap-[10px] items-center`}>
                            <div className={`text-[17px]/[24px] font-500 ${isOpen ? 'text-blue-500' : 'text-gray-500'}`}>
                                {faq.question}
                            </div>
                            <div
                                className="cursor-pointer w-6 h-6 flex items-center justify-center"
                                onClick={() => handleToggle(index)}
                            >
                                {isOpen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                        <path d="M13 1L7 7L1 1" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                                        <path d="M1 1L7 7L1 13" stroke="#99A1AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        {isOpen && (
                            <div className="px-3 pb-3 text-[16px]/[22px] font-400 text-gray-500">
                                {faq.answer}
                            </div>
                        )}
                        {!isLast && (
                            <div className="mx-4 h-[1px] bg-gray-200"></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

