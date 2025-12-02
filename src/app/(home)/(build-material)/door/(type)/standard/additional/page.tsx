"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import BoxedInput from "@/components/Input/BoxedInput";
import ImageUploadInput from "@/components/Input/ImageUploadInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import Checkbox from "@/components/Checkbox";
import SelectableOptionCard from "@/components/SelectableOptionCard";

import { HingeThickness } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

function StandardDoorAdditionalPageContent() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('door_standard_additional');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    const [door_request, setDoorRequest] = useState(item?.door_request ?? "");
    const [addOn_hinge, setAddOn_hinge] = useState(item?.addOn_hinge ?? false);
    const [door_construct, setDoorConstruct] = useState(item?.door_construct ?? false);
    const [images, setImages] = useState<File[]>(item?.raw_images || []);
    
    // 체크박스 선택을 위한 상태 (기존 상태와 동기화)
    const [hingeChecked, setHingeChecked] = useState(addOn_hinge);
    const [constructChecked, setConstructChecked] = useState(door_construct);
    
    // 몸통 두께 선택을 위한 상태 (단일 선택)
    const [selectedThickness, setSelectedThickness] = useState<HingeThickness | null>(null);
    
    // 검증 관련 상태
    const [hasValidationFailed, setHasValidationFailed] = useState(false);
    const thicknessRef = useRef<HTMLDivElement>(null);

    const handleRequestChange = (newRequest: string) => {
        setDoorRequest(newRequest);
        updateItem({ door_request: newRequest });
    };

    const handleImagesChange = (newImages: File[]) => {
        setImages(newImages);
        updateItem({ raw_images: newImages });
        console.log('이미지 업로드됨:', newImages.length, '개');
    };

    const handleAddOnHingeChange = (newAddOnHinge: boolean) => {
        setAddOn_hinge(newAddOnHinge);
        setHingeChecked(newAddOnHinge);
        updateItem({ addOn_hinge: newAddOnHinge });
    };

    const handleDoorConstructChange = (newDoorConstruct: boolean) => {
        setDoorConstruct(newDoorConstruct);
        setConstructChecked(newDoorConstruct);
        updateItem({ door_construct: newDoorConstruct });
    };

    const handleThicknessChange = (thickness: HingeThickness) => {
        const newValue = selectedThickness === thickness ? null : thickness;
        setSelectedThickness(newValue);
        updateItem({ hinge_thickness: newValue });
        // 에러 상태 초기화
        if (hasValidationFailed && newValue !== null) {
            setHasValidationFailed(false);
        }
    };

    const validateAndProceed = () => {
        // 경첩을 선택했는데 두께를 선택하지 않은 경우
        if (hingeChecked && !selectedThickness) {
            setHasValidationFailed(true);
            // 해당 영역으로 스크롤
            setTimeout(() => {
                thicknessRef.current?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 100);
            return;
        }
        
        // 검증 통과시 다음 페이지로 이동
        setHasValidationFailed(false);
        trackClick({
            object_type: "button",
            object_name: "confirm",
            current_page: getScreenName(),
            modal_name: null,
        });
        router.push("/door/report");
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
                    placeholder="제작 시 요청사항을 입력해주세요"
                    value={door_request}
                    onChange={e => handleRequestChange(e.target.value)}
                />

                <div className="w-full text-[14px] font-400 text-gray-600"> 추가선택</div>

                <div className={`w-full rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-start items-start overflow-hidden`}>
                    
                        <SelectableOptionCard   
                            title="경첩도 같이 받을래요"
                            showImage={true}
                            imageUrl="/img/hardware-category/hinge.png"
                            showChip={true}
                            chipText="인기"
                            chipColor="yellow"
                            showExpandableContent={true}
                            expandableContent={
                            <>
                                <div className="self-stretch justify-start text-gray-500 text-sm font-normal font-['Pretendard'] leading-5">몸통 두께</div>
                                <div className="self-stretch inline-flex justify-center items-center">
                                    {[
                                        {value: HingeThickness.FIFTEEN, label: '15T'}, 
                                        {value: HingeThickness.EIGHTEEN, label: '18T'}, 
                                        {value: HingeThickness.UNKNOWN, label: '모름'}
                                    ].map(({value, label}) => (
                                        <div key={value} className="flex-1 h-10 flex justify-start items-center gap-2">
                                            <Checkbox
                                                variant="circle"
                                                checked={selectedThickness === value}
                                                onChange={() => handleThicknessChange(value)}
                                            />
                                            <div className="flex-1 justify-start text-gray-500 text-base font-medium font-['Pretendard'] leading-5">{label}</div>
                                        </div>
                                    ))}
                                </div>
                                {/* 에러 메시지 */}
                                {hasValidationFailed && hingeChecked && !selectedThickness && (
                                    <div className="mt-2 text-red-500 text-sm font-medium font-['Pretendard']">
                                        몸통 두께를 선택해주세요
                                    </div>
                                )}
                            </>
                        }
                        checked={hingeChecked}
                        onChange={handleAddOnHingeChange}
                        className="mb-4"
                        />
                    
                    
                    <div className="self-stretch h-px bg-gray-100" />

                    <SelectableOptionCard
                        title="시공도 필요해요"
                        description="세부 내용은 상담으로 안내해드려요."
                        showImage={true}
                        imageUrl="/img/door_construction.png"
                        showChip={false}
                        showExpandableContent={false}
                        checked={constructChecked}
                        onChange={handleDoorConstructChange}
                    />
                </div>

                <div className="w-full pt-2 inline-flex flex-col justify-start items-center gap-2.5">
                    <div className="w-full px-4 py-3 bg-gray-50 rounded-2xl inline-flex justify-center items-center gap-2">
                        <div className="flex-1 inline-flex flex-col justify-start items-start">
                            <div className="self-stretch justify-start text-gray-700 text-base font-medium font-['Pretendard'] leading-5">구체적인 시공 내용은 상담으로 안내해드려요</div>
                            <div className="self-stretch justify-start text-blue-500 text-sm font-normal font-['Pretendard'] leading-5">믿을 수 있는 전문 시공팀과 함께해보세요.</div>
                        </div>
                    </div>
                </div>

                <ImageUploadInput
                    label="이미지 첨부"
                    placeholder="이미지를 첨부해주세요"
                    value={images}
                    onChange={handleImagesChange}
                />
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

        </div>
    );
}

function StandardDoorAdditionalPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <StandardDoorAdditionalPageContent />
        </Suspense>
    );
}

export default StandardDoorAdditionalPage;
