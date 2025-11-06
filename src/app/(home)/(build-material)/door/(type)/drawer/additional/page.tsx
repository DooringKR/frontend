"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import BoxedInput from "@/components/Input/BoxedInput";
import ImageUploadInput from "@/components/Input/ImageUploadInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function DrawerDoorAdditionalPageContent() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
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
    const [images, setImages] = useState<File[]>(item?.raw_images || []);

    const handleRequestChange = (newRequest: string) => {
        setDoorRequest(newRequest);
        updateItem({ door_request: newRequest });
    };

    const handleImagesChange = (newImages: File[]) => {
        setImages(newImages);
        updateItem({ raw_images: newImages });
        console.log('이미지 업로드됨:', newImages.length, '개');
    };

    return (
        <div className="flex min-h-screen flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={80} />
            <Header
                title={
                    "추가 정보를 입력해주세요"
                }
            />
            <div className="flex flex-1 flex-col gap-5 px-5">
                <BoxedInput
                    label="제작 시 요청사항"
                    placeholder="제작 시 요청사항 | 예) 시공도 필요해요, …"
                    value={door_request}
                    onChange={e => handleRequestChange(e.target.value)}
                />
                
                <ImageUploadInput
                    label="이미지 첨부"
                    placeholder="이미지를 첨부해주세요"
                    value={images}
                    onChange={handleImagesChange}
                />
            </div>
            <div className="h-[100px]"></div>

            <div id="drawer-door-next-button">
                <BottomButton
                    type={"1button"}
                    button1Text={"다음"}
                    className="fixed bottom-0 w-full max-w-[460px]"
                    button1Disabled={false}
                    onButton1Click={() => {
                        trackClick({
                            object_type: "button",
                            object_name: "confirm",
                            current_page: getScreenName(),
                            modal_name: null,
                        });
                        router.push("/door/report");
                    }}
                />
            </div>

        </div>
    );
}

function DrawerDoorAdditionalPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <DrawerDoorAdditionalPageContent />
        </Suspense>
    );
}

export default DrawerDoorAdditionalPage;
