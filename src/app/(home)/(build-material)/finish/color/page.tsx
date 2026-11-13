"use client";

import { FINISH_COLOR_LIST } from "dooring-core-domain/dist/constants/color";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import Sheet from "@/components/overlay/Sheet";
import ProgressBar from "@/components/Progress";
import Notice from "@/components/state/Notice";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FINISH_CATEGORY_LIST } from "@/constants/category";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import useItemStore from "@/store/itemStore";
import formatColor from "@/utils/formatColor";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

// 견본 그림은 패키지 png 라 번들러가 { src } 로 바꿔 줄 수 있다
const srcOf = (img: unknown) => (typeof img === "string" ? img : (img as { src: string }).src);
// 「헤링본」이 두께만 다른 채 여럿이라 이름에 재질·두께까지 넣는다
const OPTIONS = FINISH_COLOR_LIST.map((c) => ({ value: c.name, label: formatColor(c.name), image: srcOf(c.image) }));

/** 마감재 색 — 목록에서 고르거나 직접 입력(시트). 둘 중 하나만 남긴다 */
export default function FinishColorPage() {
    const router = useRouter();
    const item = useItemStore((s) => s.item);
    const updateItem = useItemStore((s) => s.updateItem);
    const [directOpen, setDirectOpen] = useState(false);
    const direct = item?.finish_color_direct_input ?? "";
    const picked = item?.color || direct;
    const req = useRequired({ color: !!picked });
    const directReq = useRequired({ direct: !!direct.trim() });

    useEffect(() => {
        setScreenName("finish_color");
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
            previous_screen: getPreviousScreenName(),
        });
    }, []);

    const next = () => router.push(`/finish/${FINISH_CATEGORY_LIST.find((c) => c.type === item?.type)?.slug ?? ""}`);

    return (
        <div className="flex flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={40} />
            <Header size="Large" title={`${item?.type} 색상을 선택해주세요`} />
            <div className="flex flex-col gap-5 px-5 pt-5">
                <Notice title="원하는 색상이 없어도 직접 입력할 수 있어요">
                    원하는 브랜드, 색상, 두께를 입력하시면 확인 후 가능 여부를 안내드릴게요
                    <Button variant="outline" size="md" className="mt-3 w-full" onClick={() => setDirectOpen(true)}>
                        색상 직접 입력
                    </Button>
                </Notice>
                <Field label="색상" required fieldRef={req.ref("color")} error={req.error("color")}>
                    <Choose
                        aria-label="색상"
                        title="색상을 선택해주세요"
                        placeholder={direct ? `직접 입력 · ${direct}` : "색상을 선택해주세요"}
                        value={item?.color ?? null}
                        onChange={(color) => updateItem({ color, finish_color_direct_input: undefined })}
                        options={OPTIONS}
                    />
                </Field>
            </div>
            <div className="h-[150px]" />
            <Sheet
                open={directOpen}
                onOpenChange={setDirectOpen}
                title="색상을 직접 입력해주세요"
                description="브랜드명, 색상명 등 색상 정보를 꼼꼼히 입력해주세요."
                footer={
                    <Button className="w-full" onClick={() => directReq.check() && next()}>
                        다음
                    </Button>
                }
            >
                <Field fieldRef={directReq.ref("direct")} error={directReq.error("direct")}>
                    <Input
                        autoFocus
                        placeholder="색상 정보를 입력해주세요"
                        aria-invalid={!!directReq.error("direct")}
                        value={direct}
                        onChange={(e) => updateItem({ finish_color_direct_input: e.target.value, color: undefined })}
                    />
                </Field>
            </Sheet>
            <BottomBar top={picked && <p className="mb-3 text-center text-[16px] font-500 text-primary">{formatColor(picked)} 선택됨</p>}>
                <Button
                    onClick={() => {
                        if (!req.check()) return;
                        trackClick({ object_type: "button", object_name: "confirm", current_page: getScreenName(), modal_name: null });
                        next();
                    }}
                >
                    다음
                </Button>
            </BottomBar>
        </div>
    );
}
