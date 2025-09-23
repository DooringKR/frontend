"use client";

import { ACCESSORY_CATEGORY_LIST } from "@/constants/category";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import BottomButton from "@/components/BottomButton/BottomButton";
import Header from "@/components/Header/Header";
import BoxedInput from "@/components/Input/BoxedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import useItemStore from "@/store/Items/itemStore";

// 유효성 검사 훅
function useAccessoryValidation({
    accessory_madeby,
    accessory_model,
}: {
    accessory_madeby: string;
    accessory_model: string;
}) {
    const madebyError = accessory_madeby === "" ? "제조사를 입력해주세요" : null;
    const modelError = accessory_model === "" ? "모델명을 입력해주세요" : null;

    const isFormValid = () => {
        return madebyError !== null || modelError !== null;
    };

    return {
        madebyError,
        modelError,
        isFormValid,
    };
}

function AccessoryPageContent() {
    const router = useRouter();
    const item = useItemStore(state => state.item);
    const updateItem = useItemStore(state => state.updateItem);

    const [accessory_madeby, setAccessory_madeby] = useState(item?.accessory_madeby ?? "");
    const [accessory_model, setAccessory_model] = useState(item?.accessory_model ?? "");
    const [request, setRequest] = useState(item?.request ?? "");

    // 유효성 검사 훅 사용
    const { madebyError, modelError, isFormValid } = useAccessoryValidation({
        accessory_madeby,
        accessory_model,
    });

    // 제조사 변경 시 useItemStore에 저장
    const handleMadebyChange = (newMadeby: string) => {
        setAccessory_madeby(newMadeby);
        updateItem({ accessory_madeby: newMadeby });
    };

    // 모델명 변경 시 useItemStore에 저장
    const handleModelChange = (newModel: string) => {
        setAccessory_model(newModel);
        updateItem({ accessory_model: newModel });
    };

    // 요청사항 변경 시 useItemStore에 저장
    const handleRequestChange = (newRequest: string) => {
        setRequest(newRequest);
        updateItem({ request: newRequest });
    };

    return (
        <div className="flex flex-col">
            <TopNavigator />
            <Header size="Large" title={`${item?.type} 종류를 선택해주세요`} />
            <div className="h-5"></div>
            <div className="flex flex-col gap-5 px-5">
                <BoxedInput
                    type="text"
                    label="제조사"
                    placeholder="제조사를 입력해주세요"
                    value={accessory_madeby}
                    onChange={e => handleMadebyChange(e.target.value)}
                />
                <BoxedInput
                    type="text"
                    label="모델명"
                    placeholder="모델명을 입력해주세요"
                    value={accessory_model}
                    onChange={e => handleModelChange(e.target.value)}
                />
                <BoxedInput
                    label="제작 시 요청사항"
                    placeholder="제작 시 요청사항을 입력해주세요"
                    value={request}
                    onChange={e => handleRequestChange(e.target.value)}
                />
            </div>
            <div className="h-[100px]" />
            <div id="accessory-next-button">
                <BottomButton
                    type={"1button"}
                    button1Text={"다음"}
                    className="fixed bottom-0 w-full max-w-[460px]"
                    button1Disabled={isFormValid()}
                    onButton1Click={() => {
                        router.push(`/accessory/spec/report`);
                    }}
                />
            </div>
        </div>
    );
}

function AccessoryPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <AccessoryPageContent />
        </Suspense>
    );
}

export default AccessoryPage;
