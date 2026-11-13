"use client";

import { useState } from "react";

import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import Sheet from "@/components/overlay/Sheet";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useItemStore from "@/store/itemStore";

// image 는 타입상 string 이지만 next 빌드에선 StaticImageData({ src }) 로 온다
type ColorItem = { name: string; image: string | { src: string } };

export function parseColorName(name: string) {
    const nameParts = name.split(",").map((s: string) => s.trim());
    return {
        label: [nameParts[1], nameParts[3]].filter(Boolean).join(" "),
        description: [nameParts[0], nameParts[2]].filter(Boolean).join(" ∙ "),
    };
}

const src = (image: ColorItem["image"]) => (typeof image === "string" ? image : image?.src) || undefined;

/**
 * 문·롱문 색 고르기(옛 color/_components 4개 × 2벌을 하나로) — 목록에서 고르거나 직접 입력(시트).
 * 다음은 늘 눌리고, 아무것도 안 골랐으면 목록 칸으로 옮겨 가 알린다.
 */
export default function ColorScreen({ title, colors, onNext }: { title: string; colors: readonly ColorItem[]; onNext: (from: "list" | "direct") => void }) {
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);
    const [sheetOpen, setSheetOpen] = useState(false);
    const selected = item?.color || item?.door_color_direct_input || null;
    const picked = colors.find(c => c.name === item?.color);
    const req = useRequired({ color: !!selected });
    const direct = useRequired({ direct: !!item?.door_color_direct_input?.trim() });

    return (
        <div className="flex flex-col pt-[90px]">
            <TopNavigator />
            <ProgressBar progress={40} />
            <Header size="Large" title={title} />
            <div className="flex flex-col gap-5 px-5">
                <div className="flex flex-col items-start justify-center gap-3 rounded-[16px] border border-[#FFD6A7] bg-[#FFF7ED] p-5">
                    <div className="gap-1">
                        <p className="text-[17px]/[24px] font-600 text-gray-800">
                            원하는 색상이 없어도 <br />
                            직접 입력할 수 있어요
                        </p>
                        <p className="text-[14px]/[20px] font-500 text-gray-500">원하는 브랜드, 색상, 두께를 입력하시면 확인 후 가능 여부를 안내드릴게요</p>
                    </div>
                    <Button variant="outline" size="md" onClick={() => setSheetOpen(true)} className="w-full">
                        색상 직접 입력
                    </Button>
                </div>
                <Field label="색상" required fieldRef={req.ref("color")} error={req.error("color")}>
                    <Choose
                        aria-label="색상"
                        title="색상을 선택해주세요"
                        placeholder={item?.door_color_direct_input ? `직접 입력: ${item.door_color_direct_input}` : "색상을 선택해주세요"}
                        value={item?.color ?? null}
                        onChange={color => updateItem({ color, door_color_direct_input: undefined })}
                        options={colors.map(c => {
                            const { label, description } = parseColorName(c.name);
                            return { value: c.name, label, description: description || undefined, image: src(c.image) };
                        })}
                    />
                </Field>
            </div>
            <div className="h-[150px]" />

            <Sheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                title="색상을 직접 입력해주세요"
                description="브랜드명, 색상명 등 색상 정보를 꼼꼼히 입력해주세요."
                footer={
                    <Button className="w-full" onClick={() => direct.check() && onNext("direct")}>
                        다음
                    </Button>
                }
            >
                <Field fieldRef={direct.ref("direct")} error={direct.error("direct")}>
                    <Input
                        autoFocus
                        placeholder="색상 정보를 입력해주세요"
                        aria-invalid={!!direct.error("direct")}
                        value={item?.door_color_direct_input ?? ""}
                        onChange={e => updateItem({ door_color_direct_input: e.target.value, color: undefined })}
                    />
                </Field>
            </Sheet>

            {!sheetOpen && (
                <BottomBar
                    top={
                        selected && (
                            <div className="flex items-center justify-center gap-2 pb-4 pt-2">
                                {picked && src(picked.image) && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={src(picked.image)} alt="" className="size-5 rounded-[4px] object-cover" />
                                )}
                                <p className="text-[16px]/[22px] font-500 text-primary">
                                    {picked
                                        ? (() => {
                                              const { label, description } = parseColorName(picked.name);
                                              return `${label}${description ? ` (${description})` : ""} 선택됨`;
                                          })()
                                        : `${selected} 선택됨`}
                                </p>
                            </div>
                        )
                    }
                >
                    <Button onClick={() => req.check() && onNext("list")}>다음</Button>
                </BottomBar>
            )}
        </div>
    );
}
