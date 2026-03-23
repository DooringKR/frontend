"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import BoxedInput from "@/components/Input/BoxedInput";
import ImageUploadInput from "@/components/Input/ImageUploadInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import Checkbox from "@/components/Checkbox";
import SelectableOptionCard from "@/components/SelectableOptionCard";
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";

import { HingeDirection, HingeThickness } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

function LongDoorAdditionalPageContent() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    useEffect(() => {
        setScreenName("preset_longdoor_additional");
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    const [door_request, setDoorRequest] = useState(item?.door_request ?? "");
    const [addOn_hinge, setAddOn_hinge] = useState(item?.addOn_hinge ?? false);
    const [images, setImages] = useState<File[]>(item?.raw_images || []);

    const [selectedThickness, setSelectedThickness] = useState<HingeThickness | null>(item?.hinge_thickness ?? null);

    const [hasValidationFailed, setHasValidationFailed] = useState(false);
    const thicknessRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    /** 이미지 미첨부 시 확인 팝업 */
    const [isNoImageConfirmOpen, setIsNoImageConfirmOpen] = useState(false);
    const [noImageConfirmChecked, setNoImageConfirmChecked] = useState(false);

    const handleRequestChange = (newRequest: string) => {
        setDoorRequest(newRequest);
        updateItem({ door_request: newRequest });
    };

    const handleImagesChange = (newImages: File[]) => {
        setImages(newImages);
        updateItem({ raw_images: newImages });
    };

    const handleAddOnHingeChange = (newAddOnHinge: boolean) => {
        setAddOn_hinge(newAddOnHinge);
        updateItem({ addOn_hinge: newAddOnHinge });

        if (!newAddOnHinge) {
            setSelectedThickness(null);
            updateItem({ hinge_thickness: null });
        }
    };

    useEffect(() => {
        updateItem({ door_construct: false });
    }, [updateItem]);

    const handleThicknessChange = (thickness: HingeThickness) => {
        const newValue = selectedThickness === thickness ? null : thickness;
        setSelectedThickness(newValue);
        updateItem({ hinge_thickness: newValue });
        if (hasValidationFailed && newValue !== null) {
            setHasValidationFailed(false);
        }
    };

    const hasImages = images && images.length > 0;

    const proceedToReport = () => {
        setHasValidationFailed(false);
        router.push("/longdoor/report");
    };

    const validateAndProceed = () => {
        // 경첩 두께 검증
        if (addOn_hinge && !selectedThickness) {
            setHasValidationFailed(true);
            setTimeout(() => {
                thicknessRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
            return;
        }

        // 이미지 없으면 확인 팝업
        if (!hasImages) {
            setNoImageConfirmChecked(false);
            setIsNoImageConfirmOpen(true);
            return;
        }

        proceedToReport();
    };

    const handleNoImageConfirm = () => {
        if (!noImageConfirmChecked) return;
        setIsNoImageConfirmOpen(false);
        setNoImageConfirmChecked(false);
        proceedToReport();
    };

    return (
        <div className="flex min-h-screen flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={80} />
            <Header title={"추가 정보를 입력해주세요"} />
            {/* 검증용: itemStore 정보 표시 */}
            {/* <div className="mt-8 mb-4 rounded-2xl border-2 border-blue-300 bg-blue-50 p-4">
                <div className="mb-3 text-[16px] font-700 text-blue-800">🔍 ItemStore 검증 정보</div>

                <div className="mb-4 space-y-2">
                    <div className="text-[14px] font-600 text-gray-800">공통 속성</div>
                    <div className="rounded-lg bg-white p-3 text-[12px] font-400 text-gray-700">
                        <div>색상: {item?.color || item?.door_color_direct_input || "미입력"}</div>
                        <div>용도/장소: {item?.door_location || "미입력"}</div>
                        <div>손잡이 종류: {item?.handleType || "미입력"}</div>
                        <div>세로 길이: {item?.door_height ? `${item?.door_height}mm` : "미입력"}</div>
                        <div>보링 개수: {item?.boringNum ? `${item?.boringNum}개` : "미입력"}</div>
                        <div>보링 치수: {item?.hinge && item?.hinge.length > 0 ? `[${item?.hinge.map(h => h ?? "null").join(", ")}]` : "미입력"}</div>
                        <div>문짝 수량: {item?.doors && item?.doors.length > 0 ? `${item?.doors.length}개` : "미입력"}</div>
                    </div>
                </div>

                <div className="mb-4 space-y-2">
                    <div className="text-[14px] font-600 text-gray-800">개별 문 정보 (doors 배열)</div>
                    <div className="space-y-2">
                        {item?.doors && item?.doors.length > 0 && item?.doors.map((door: any, idx: number) => (
                            <div key={idx} className="rounded-lg bg-white p-3 text-[12px] font-400 text-gray-700">
                                <div className="mb-1 font-600 text-gray-800">문 {idx + 1}</div>
                                <div>가로 길이: {door.door_width ? `${door.door_width}mm` : "미입력"}</div>
                                <div>경첩 방향: {
                                    door.hinge_direction === HingeDirection.LEFT ? "좌경첩" :
                                        door.hinge_direction === HingeDirection.RIGHT ? "우경첩" :
                                            door.hinge_direction === HingeDirection.UNKNOWN ? "모름" :
                                                "미입력"
                                }</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-[14px] font-600 text-gray-800">전체 ItemStore JSON</div>
                    <div className="max-h-[300px] overflow-auto rounded-lg bg-white p-3">
                        <pre className="text-[10px] font-400 text-gray-700 whitespace-pre-wrap break-words">
                            {JSON.stringify(item, null, 2)}
                        </pre>
                    </div>
                </div>
            </div> */}
            <div className="flex flex-1 flex-col gap-5 px-5">
                <BoxedInput
                    label="제작 시 요청사항"
                    placeholder="제작 시 요청사항을 입력해주세요"
                    value={door_request}
                    onChange={e => handleRequestChange(e.target.value)}
                />

                <div className="w-full text-[14px] font-400 text-gray-600"> 추가선택</div>

                <div className="w-full rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-start items-start overflow-hidden">
                    <SelectableOptionCard
                        title="경첩도 같이 받을래요"
                        showImage={true}
                        imageUrl="/img/hardware-category/hinge.png"
                        showChip={true}
                        chipText="인기"
                        chipColor="yellow"
                        showExpandableContent={true}
                        expandableContent={
                            <div className="w-full" onClick={e => e.stopPropagation()}>
                                <div className="w-full justify-start text-gray-500 text-sm font-normal font-['Pretendard'] leading-5">
                                    몸통 두께
                                </div>
                                <div className="w-full inline-flex justify-center items-center">
                                    {[
                                        { value: HingeThickness.FIFTEEN, label: "15T" },
                                        { value: HingeThickness.EIGHTEEN, label: "18T" },
                                        { value: HingeThickness.UNKNOWN, label: "모름" },
                                    ].map(({ value, label }) => (
                                        <div key={value} className="flex-1 h-10 flex justify-start items-center gap-2">
                                            <Checkbox
                                                variant="circle"
                                                checked={selectedThickness === value}
                                                onChange={() => handleThicknessChange(value)}
                                            />
                                            <div className="flex-1 justify-start text-gray-500 text-base font-medium font-['Pretendard'] leading-5">
                                                {label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {hasValidationFailed && addOn_hinge && !selectedThickness && (
                                    <div className="mt-2 text-red-500 text-sm font-medium font-['Pretendard']">몸통 두께를 선택해주세요</div>
                                )}
                            </div>
                        }
                        checked={addOn_hinge}
                        onChange={handleAddOnHingeChange}
                    />

                </div>

                <div ref={imageRef}>
                    <ImageUploadInput
                        label="이미지 첨부"
                        placeholder="이미지를 첨부해주세요"
                        value={images}
                        onChange={handleImagesChange}
                        required={false}
                    />
                </div>
            </div>
            <div className="h-[100px]"></div>

            <div id="door-next-button">
                <BottomButton
                    type={"1button"}
                    button1Text={"다음"}
                    className="fixed bottom-0 w-full max-w-[460px]"
                    button1Disabled={false}
                    onButton1Click={validateAndProceed}
                />
            </div>

            {/* 이미지 미첨부 시 확인 팝업 */}
            <Modal
                isOpen={isNoImageConfirmOpen}
                onClose={() => {
                    setIsNoImageConfirmOpen(false);
                    setNoImageConfirmChecked(false);
                }}
            >
                <div className="flex flex-col gap-4">
                    <h3 className="text-[18px] font-600 text-gray-900">이미지를 첨부하지 않으셨습니다</h3>
                    <p className="text-[15px] font-400 text-gray-700 leading-relaxed">
                        주문 접수 후 카카오톡 채널 또는 문자(010-6409-4542)로 시공 현장·도면 사진을 보내주세요.
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                        <Checkbox
                            checked={noImageConfirmChecked}
                            onChange={setNoImageConfirmChecked}
                        />
                        <span
                            role="button"
                            tabIndex={0}
                            className="text-[15px] font-500 text-gray-800 cursor-pointer select-none"
                            onClick={() => setNoImageConfirmChecked(prev => !prev)}
                            onKeyDown={e => e.key === "Enter" && setNoImageConfirmChecked(prev => !prev)}
                        >
                            네 확인했습니다
                        </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button
                            type="GrayLarge"
                            text="취소"
                            className="flex-1"
                            onClick={() => {
                                setIsNoImageConfirmOpen(false);
                                setNoImageConfirmChecked(false);
                            }}
                        />
                        <Button
                            type="BrandInverse"
                            text="확인"
                            className="flex-1"
                            disabled={!noImageConfirmChecked}
                            onClick={handleNoImageConfirm}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}

function LongDoorAdditionalPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <LongDoorAdditionalPageContent />
        </Suspense>
    );
}

export default LongDoorAdditionalPage;


