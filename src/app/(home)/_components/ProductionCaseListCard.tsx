import { Chip } from "@/components/Chip/Chip";

export default function ProductionCaseListCard() {
    return (
        <div className="px-5 py-[40px] flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <div className="text-[20px]/[28px] font-700 text-gray-800">실제 제작 사례</div>
                <div className="text-[16px]/[22px] font-400 text-gray-500">고객 사례 레퍼런스를 확인해보세요.</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <div className="w-full aspect-square cursor-pointer" onClick={() => {
                        window.open("https://dooring.notion.site/25-10-23-bar-29db6a70ff398094b7f5d6b3ec247b10?pvs=74", "_blank");
                    }}>
                        <img
                            src="/img/production-case/case1_thumbnail.png"
                            alt="picture1"
                            className="w-full h-full object-cover rounded-[12px]"
                        />
                    </div>
                    <div>“오늘 3시까지 하부장 배송 돼요?”</div>
                    <div className="flex gap-2">
                        <Chip text="하부장" color="blue" />
                        <Chip text="배송" color="gray" />
                        <Chip text="시공 O" color="gray" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="w-full aspect-square cursor-pointer" onClick={() => {
                        window.open("https://dooring.notion.site/25-06-29db6a70ff39804d8deff1de2bd52468?pvs=74", "_blank");
                    }}>
                        <img
                            src="/img/production-case/case2_thumbnail.png"
                            alt="picture1"
                            className="w-full h-full object-cover rounded-[12px]"
                        />
                    </div>
                    <div>“냉장고에 냉장고장 플랩문이 걸려요”</div>
                    <div className="flex gap-2">
                        <Chip text="플랩장" color="blue" />
                        <Chip text="픽업" color="gray" />
                    </div>
                </div>


            </div>
        </div>
    );
}