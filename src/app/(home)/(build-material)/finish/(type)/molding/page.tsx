"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button/Button";
import SelectToggleButton from "@/components/Button/SelectToggleButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import BoxedSelect from "@/components/Select/BoxedSelect";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import formatColor from "@/utils/formatColor";
import formatLocation from "@/utils/formatLocation";

import DepthInputSection from "./_components/DepthInputSection";
import HeightInputSection from "./_components/HeightInputSection";
// Hooks
import { useFinishValidation } from "./hooks/useFinishValidation";
import { FinishEdgeCount, Location } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import useItemStore from "@/store/itemStore";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";

// Location enum을 사용하여 options 생성
const getLocationOptions = () => {
    return [
        { value: Location.KITCHEN },
        { value: Location.SHOES },
        { value: Location.BUILT_IN },
        { value: Location.BALCONY },
        { value: Location.ETC },
    ];
};

function FinishPageContent() {
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);
    const router = useRouter();
    const [edgeCount, setEdgeCount] = useState<FinishEdgeCount | null>(
        item?.edgeCount ?? null,
    );
    const [depth, setDepth] = useState<number | null>(
        item?.depth ?? null,
    );
    const [depthIncrease, setDepthIncrease] = useState<number | null>(
        item?.depthIncrease ?? null,
    );
    const [height, setHeight] = useState<number | null>(
        item?.height ?? null,
    );
    const [heightIncrease, setHeightIncrease] = useState<number | null>(
        item?.heightIncrease ?? null,
    );
    const [request, setRequest] = useState<string | null>(
        item?.request ?? null,
    );

    const [finish_location, setFinishLocation] = useState<Location | null>(
        item?.finish_location ?? null,
    );
    const [isDepthIncrease, setIsDepthIncrease] = useState(false);
    const [isHeightIncrease, setIsHeightIncrease] = useState(false);
    const [isFinishLocationSheetOpen, setIsFinishLocationSheetOpen] = useState(false);
    const [isEdgeCountSheetOpen, setIsEdgeCountSheetOpen] = useState(false);

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('finish_molding');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    // 유효성 검사 훅 사용
    const { depthError, heightError, isFormValid } = useFinishValidation({
        edgeCount: edgeCount ?? null,
        depth: depth,
        height: height,
        depthIncrease: depthIncrease,
        heightIncrease: heightIncrease,
    });

    // 동기화
    useEffect(() => {
        setIsDepthIncrease(
            depthIncrease !== null &&
            depthIncrease !== undefined &&
            depthIncrease !== 0,
        );
    }, [depthIncrease]);

    useEffect(() => {
        setIsHeightIncrease(
            heightIncrease !== null &&
            heightIncrease !== undefined &&
            heightIncrease !== 0,
        );
    }, [heightIncrease]);

    // 엣지 면 수 변경 시 useItemStore에 저장
    const handleEdgeCountChange = (newEdgeCount: FinishEdgeCount) => {
        setEdgeCount(newEdgeCount);
        updateItem({ edgeCount: newEdgeCount });
    };

    const handleDepthChange = (newDepth: number | null) => {
        setDepth(newDepth);
        updateItem({ depth: newDepth });
    };

    const handleDepthIncreaseChange = (newDepthIncrease: number | null) => {
        setDepthIncrease(newDepthIncrease);
        updateItem({ depthIncrease: newDepthIncrease });
    };

    const handleFinishLocationChange = (newFinishLocation: Location | null) => {
        setFinishLocation(newFinishLocation);
        updateItem({ finish_location: newFinishLocation });
    };

    const handleHeightChange = (newHeight: number | null) => {
        setHeight(newHeight);
        updateItem({ height: newHeight });
    };

    const handleHeightIncreaseChange = (newHeightIncrease: number | null) => {
        setHeightIncrease(newHeightIncrease);
        updateItem({ heightIncrease: newHeightIncrease });
    };

    return (
        <div className="flex flex-col">
            <InitAmplitude />
            <TopNavigator />
            <Header
                size="Large"
                title={`${item?.type} 정보를 입력해주세요`}
            />
            <div className="h-5"></div>
            <div className="flex flex-col gap-5 px-5">
                <BoxedSelect label="색상" value={formatColor(item?.color ?? "") || item?.finish_color_direct_input || ""} onClick={() => router.back()} />
                <BoxedSelect
                    label="엣지 면 수"
                    value={edgeCount?.toString() ?? ""}
                    onClick={() => setIsEdgeCountSheetOpen(true)}
                />
                <DepthInputSection
                    depth={depth}
                    setDepth={handleDepthChange}
                    isDepthIncrease={isDepthIncrease}
                    setIsDepthIncrease={setIsDepthIncrease}
                    depthIncrease={depthIncrease}
                    setDepthIncrease={handleDepthIncreaseChange}
                    depthError={depthError}
                />
                <HeightInputSection
                    height={height}
                    setHeight={handleHeightChange}
                    isHeightIncrease={isHeightIncrease}
                    setIsHeightIncrease={setIsHeightIncrease}
                    heightIncrease={heightIncrease}
                    setHeightIncrease={handleHeightIncreaseChange}
                    heightError={heightError}
                />
                <BoxedSelect
                    label="용도 ∙ 장소"
                    options={[]}
                    value={finish_location ?? ""}
                    onClick={() => setIsFinishLocationSheetOpen(true)}
                    onChange={() => { }}
                />
                <FinishLocationSheet
                    isOpen={isFinishLocationSheetOpen}
                    onClose={() => setIsFinishLocationSheetOpen(false)}
                    value={finish_location}
                    onChange={handleFinishLocationChange}
                />
                <EdgeCountSheet
                    isOpen={isEdgeCountSheetOpen}
                    onClose={() => setIsEdgeCountSheetOpen(false)}
                    value={edgeCount}
                    onChange={handleEdgeCountChange}
                />
                <BoxedInput
                    label="제작 시 요청사항"
                    placeholder="제작 시 요청사항 | 예) 시공도 필요해요, …"
                    value={request}
                    onChange={e => setRequest(e.target.value)}
                />
            </div>
            <div className="h-[100px]" />
            {!isFinishLocationSheetOpen && !isEdgeCountSheetOpen && (
                <div id="finish-next-button">
                    <BottomButton
                        type={"1button"}
                        button1Text={"다음"}
                        className="fixed bottom-0 w-full max-w-[460px]"
                        button1Disabled={isFormValid() || !finish_location}
                        onButton1Click={() => {
                            // setCart({
                            //     type: "finish",
                            //     category: category,
                            //     // color: item?.color ?? "",
                            //     edge_count: edgeCount,
                            //     depth: depth,
                            //     height: height,
                            //     depthIncrease: depthIncrease,
                            //     heightIncrease: heightIncrease,
                            //     request: request,
                            //     finish_location: finish_location,
                            // });
                            trackClick({
                                object_type: "button",
                                object_name: "confirm",
                                current_page: getScreenName(),
                                modal_name: null,
                            });
                            router.push(`/finish/report`);
                        }}
                    />
                </div>
            )}
        </div>
    );
}

function FinishPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <FinishPageContent />
        </Suspense>
    );
}


// 엣지 면 수 선택 시트 컴포넌트
function EdgeCountSheet({
    isOpen,
    onClose,
    value,
    onChange,
}: {
    isOpen: boolean;
    onClose: () => void;
    value: string | null;
    onChange: (v: FinishEdgeCount) => void;
}) {
    return (
        <BottomSheet
            isOpen={isOpen}
            title="엣지 면 수를 선택해주세요"
            contentPadding="px-1"
            children={
                <div>
                    <div>
                        <SelectToggleButton
                            key={FinishEdgeCount.TWO}
                            label={FinishEdgeCount.TWO}
                            checked={value === FinishEdgeCount.TWO}
                            onClick={() => onChange(FinishEdgeCount.TWO)}
                        />
                        <SelectToggleButton
                            key={FinishEdgeCount.FOUR}
                            label={FinishEdgeCount.FOUR}
                            checked={value === FinishEdgeCount.FOUR}
                            onClick={() => onChange(FinishEdgeCount.FOUR)}
                        />
                        <div className="p-5">
                            <Button
                                type="Brand"
                                text="다음"
                                onClick={() => {
                                    onClose();
                                }}
                            />
                        </div>
                    </div>
                </div>
            }
            onClose={onClose}
        />
    );
}

// 용도 및 장소 선택 시트 컴포넌트
function FinishLocationSheet({
    isOpen,
    onClose,
    value,
    onChange,
}: {
    isOpen: boolean;
    onClose: () => void;
    value: Location | null;
    onChange: (v: Location) => void;
}) {
    const options = getLocationOptions(); // enum을 사용한 options

    return (
        <BottomSheet
            isOpen={isOpen}
            title="용도 및 장소를 선택해주세요"
            contentPadding="px-1"
            children={
                <div>
                    <div>
                        {options.map(option => (
                            <SelectToggleButton
                                key={option.value}
                                label={option.value} // enum 값 그대로 사용
                                checked={value === option.value}
                                onClick={() => onChange(option.value)}
                            />
                        ))}
                        <div className="p-5">
                            <Button
                                type="Brand"
                                text="다음"
                                onClick={() => {
                                    onClose();
                                }}
                            />
                        </div>
                    </div>
                </div>
            }
            onClose={onClose}
        />
    );
}


export default FinishPage;
