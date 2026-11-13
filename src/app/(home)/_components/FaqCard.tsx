"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

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

/** 자주 묻는 질문 — 한 번에 하나만 펼친다. 질문 줄 전체가 펼치기 버튼. */
export default function FaqCard() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="px-2 py-[40px] flex flex-col">
            <div className="px-4 text-[20px]/[28px] font-700 text-gray-800">자주 묻는 질문</div>
            {faqData.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                    <Collapsible key={index} open={isOpen} onOpenChange={(o) => setOpenIndex(o ? index : null)}>
                        <CollapsibleTrigger
                            className={`${isOpen ? "mt-2" : "my-2"} flex w-full items-center justify-between gap-[10px] px-4 py-3 text-left`}
                        >
                            <span className={`text-[17px]/[24px] font-500 ${isOpen ? "text-blue-500" : "text-gray-500"}`}>{faq.question}</span>
                            <ChevronDown className={`size-5 shrink-0 transition-transform ${isOpen ? "rotate-180 text-blue-500" : "-rotate-90 text-gray-400"}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-3 pb-3 text-[16px]/[22px] font-400 text-gray-500">{faq.answer}</CollapsibleContent>
                        {index < faqData.length - 1 && <Separator className="mx-4 w-auto" />}
                    </Collapsible>
                );
            })}
        </div>
    );
}
