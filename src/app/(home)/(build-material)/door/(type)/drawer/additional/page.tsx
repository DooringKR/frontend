"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Field from "@/components/form/Field";
import PhotoPick from "@/components/form/PhotoPick";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

export default function DrawerDoorAdditionalPage() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        setScreenName('door_drawer_additional');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    const [door_request, setDoorRequest] = useState(item?.door_request ?? "");
    const [door_construct, setDoorConstruct] = useState<boolean>(item?.door_construct ?? false);
    const [images, setImages] = useState<File[]>(item?.raw_images || []);

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
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="door-construct"
                            checked={door_construct}
                            onCheckedChange={v => {
                                setDoorConstruct(v === true);
                                updateItem({ door_construct: v === true });
                            }}
                        />
                        <Label htmlFor="door-construct" className="text-[16px] text-gray-700">
                            시공도 필요해요
                        </Label>
                    </div>
                </Field>

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
                        trackClick({
                            object_type: "button",
                            object_name: "confirm",
                            current_page: getScreenName(),
                            modal_name: null,
                        });
                        router.push("/door/report");
                    }}
                >
                    다음
                </Button>
            </BottomBar>
        </div>
    );
}
