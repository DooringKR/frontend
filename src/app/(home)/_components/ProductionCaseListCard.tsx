import { Badge } from "@/components/ui/badge";

const CASES = [
    {
        href: "https://dooring.notion.site/25-10-23-bar-29db6a70ff398094b7f5d6b3ec247b10?pvs=74",
        image: "/img/production-case/case1_thumbnail.png",
        quote: "“오늘 3시까지 하부장 배송 돼요?”",
        tags: ["하부장", "배송", "시공 O"],
    },
    {
        href: "https://dooring.notion.site/25-06-29db6a70ff39804d8deff1de2bd52468?pvs=74",
        image: "/img/production-case/case2_thumbnail.png",
        quote: "“냉장고에 냉장고장 플랩문이 걸려요”",
        tags: ["플랩장", "픽업"],
    },
];

export default function ProductionCaseListCard() {
    return (
        <div className="px-5 py-[40px] flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <div className="text-[20px]/[28px] font-700 text-gray-800">실제 제작 사례</div>
                <div className="text-[16px]/[22px] font-400 text-gray-500">고객 사례 레퍼런스를 확인해보세요.</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {CASES.map((c) => (
                    <div key={c.href} className="flex flex-col gap-2">
                        <a href={c.href} target="_blank" rel="noopener noreferrer" className="block w-full aspect-square">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={c.image} alt={c.quote} className="w-full h-full object-cover rounded-[12px]" />
                        </a>
                        <div>{c.quote}</div>
                        <div className="flex gap-2">
                            {c.tags.map((t, i) => (
                                <Badge key={t} color={i === 0 ? "blue" : "gray"}>
                                    {t}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
