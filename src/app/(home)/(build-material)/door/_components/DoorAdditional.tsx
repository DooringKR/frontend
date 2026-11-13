"use client";

import { HingeThickness } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import PhotoPick from "@/components/form/PhotoPick";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import ConfirmSheet from "@/components/overlay/ConfirmSheet";
import ProgressBar from "@/components/Progress";
import SelectableOptionCard from "@/components/SelectableOptionCard";
import Notice from "@/components/state/Notice";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

const THICKNESS_OPTIONS = [
    { value: HingeThickness.FIFTEEN, label: "15T" },
    { value: HingeThickness.EIGHTEEN, label: "18T" },
    { value: HingeThickness.UNKNOWN, label: "모름" },
];

/**
 * 일반문·플랩문·롱문 추가 정보(옛 화면 3벌을 하나로) — 요청사항·경첩 같이 받기(몸통 두께 필수)·시공·사진.
 * 다음은 늘 눌리고, 경첩을 골랐는데 두께가 비면 그 칸으로 옮겨 가 알린다(useRequired).
 */
export default function DoorAdditional({
    screenName,
    nextHref,
    constructBadge,
    constructNotice = false,
    confirmNoImage = false,
    trackConfirm = true,
}: {
    screenName: string;
    nextHref: string;
    /** 시공 카드 띠(롱문 「+30만원」) */
    constructBadge?: string;
    /** 시공 카드 밑 안내(일반문) */
    constructNotice?: boolean;
    /** 사진 없이 넘어가면 한 번 확인(롱문) */
    confirmNoImage?: boolean;
    /** 다음 누름 trackClick(롱문은 원래 보내지 않았다) */
    trackConfirm?: boolean;
}) {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    const [door_request, setDoorRequest] = useState(item?.door_request ?? "");
    const [addOn_hinge, setAddOn_hinge] = useState<boolean>(item?.addOn_hinge ?? false);
    const [door_construct, setDoorConstruct] = useState<boolean>(item?.door_construct ?? false);
    const [images, setImages] = useState<File[]>(item?.raw_images || []);
    const [selectedThickness, setSelectedThickness] = useState<HingeThickness | null>(item?.hinge_thickness ?? null);
    const [noImageOpen, setNoImageOpen] = useState(false);

    const req = useRequired({ thickness: !addOn_hinge || !!selectedThickness });

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        setScreenName(screenName);
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddOnHingeChange = (next: boolean) => {
        setAddOn_hinge(next);
        updateItem({ addOn_hinge: next });
        // 경첩 선택 해제시 두께 선택도 초기화
        if (!next) {
            setSelectedThickness(null);
            updateItem({ hinge_thickness: null });
        }
    };

    const proceed = () => {
        if (trackConfirm)
            trackClick({
                object_type: "button",
                object_name: "confirm",
                current_page: getScreenName(),
                modal_name: null,
            });
        router.push(nextHref);
    };

    return (
        <div className="flex min-h-screen flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={80} />
            <Header title="추가 정보를 입력해주세요" />
            <div className="flex flex-1 flex-col gap-5 px-5">
                <Field label="제작 시 요청사항">
                    <Input
                        placeholder="제작 시 요청사항을 입력해주세요"
                        value={door_request}
                        onChange={e => {
                            setDoorRequest(e.target.value);
                            updateItem({ door_request: e.target.value });
                        }}
                    />
                </Field>

                <Field label="추가선택">
                    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-border">
                        <SelectableOptionCard
                            title="경첩도 같이 받을래요"
                            showImage
                            imageUrl="/img/hardware-category/hinge.png"
                            showChip
                            chipText="인기"
                            chipColor="yellow"
                            showExpandableContent
                            expandableContent={
                                <Field label="몸통 두께" required fieldRef={req.ref("thickness")} error={req.error("thickness")}>
                                    <Choose
                                        aria-label="몸통 두께"
                                        value={selectedThickness}
                                        onChange={v => {
                                            setSelectedThickness(v);
                                            updateItem({ hinge_thickness: v });
                                        }}
                                        options={THICKNESS_OPTIONS}
                                    />
                                </Field>
                            }
                            checked={addOn_hinge}
                            onChange={handleAddOnHingeChange}
                        />
                        <Separator className="bg-gray-100" />
                        <SelectableOptionCard
                            title="시공도 필요해요"
                            description="세부 내용은 상담으로 안내해드려요."
                            showImage
                            imageUrl="/img/door_construction.png"
                            showChip={!!constructBadge}
                            chipText={constructBadge}
                            chipColor="gray"
                            checked={door_construct}
                            onChange={next => {
                                setDoorConstruct(next);
                                updateItem({ door_construct: next });
                            }}
                        />
                    </div>
                </Field>

                {constructNotice && (
                    <Notice tone="blue" title="구체적인 시공 내용은 상담으로 안내해드려요">
                        믿을 수 있는 전문 시공팀과 함께해보세요.
                    </Notice>
                )}

                <Field label="이미지 첨부">
                    <PhotoPick
                        placeholder="이미지를 첨부해주세요"
                        value={images}
                        onChange={files => {
                            setImages(files);
                            updateItem({ raw_images: files });
                        }}
                    />
                </Field>
            </div>
            <div className="h-[100px]" />
            <BottomBar>
                <Button
                    onClick={() => {
                        if (!req.check()) return;
                        if (confirmNoImage && images.length === 0) setNoImageOpen(true);
                        else proceed();
                    }}
                >
                    다음
                </Button>
            </BottomBar>
            {confirmNoImage && (
                <ConfirmSheet
                    open={noImageOpen}
                    onOpenChange={setNoImageOpen}
                    title="이미지를 첨부하지 않으셨습니다"
                    description="주문 접수 후 카카오톡 채널 또는 문자(010-6409-4542)로 시공 현장·도면 사진을 보내주세요."
                    confirmLabel="네 확인했습니다"
                    onConfirm={proceed}
                />
            )}
        </div>
    );
}
