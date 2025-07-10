'use client'

import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { useRouter, useSearchParams } from "next/navigation";
import { CABINET_CATEGORY_LIST } from "@/constants/category";
import { useState, useMemo } from "react";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import formatColor from "@/utils/formatColor";
import formatSize from "@/utils/formatSize";
import BottomButton from "@/components/BottomButton/BottomButton";

function ConfirmPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const bodyMaterial = searchParams.get("bodyMaterial");
    const color = searchParams.get("color");
    const width = searchParams.get("width");
    const height = searchParams.get("height");
    const depth = searchParams.get("depth");
    const request = searchParams.get("request");
    const handleType = searchParams.get("handleType");
    const finishType = searchParams.get("finishType");
    const showBar = searchParams.get("showBar");
    const drawerType = searchParams.get("drawerType");
    const railType = searchParams.get("railType");
    const riceRail = searchParams.get("riceRail");
    const lowerDrawer = searchParams.get("lowerDrawer");

    // 모든 파라미터를 하나의 객체로 저장
    const orderParams = useMemo(() => ({
        type,
        category,
        bodyMaterial,
        color,
        width,
        height,
        depth,
        request,
        handleType,
        finishType,
        showBar,
        drawerType,
        railType,
        riceRail,
        lowerDrawer,
    }), [type, category, bodyMaterial, color, width, height, depth, request, handleType, finishType, showBar, drawerType, railType, riceRail, lowerDrawer]);

    const [quantity, setQuantity] = useState(1);
    return (
        <div>
            <TopNavigator />
            <Header size="Large" title={`${getCategoryLabel(category)} 주문 개수를 선택해주세요`} />
            <div className="flex flex-col pt-5 px-5 gap-[20px] pb-[100px]">
                <ShoppingCartCard
                    type="cabinet"
                    title={`${getCategoryLabel(category)}`}
                    color={formatColor(color) ?? ""}
                    bodyMaterial={bodyMaterial ?? ""}
                    width={formatSize(width) ?? ""}
                    height={formatSize(height) ?? ""}
                    depth={formatSize(depth) ?? ""}
                    handleType={handleType ?? ""}
                    finishType={finishType ?? ""}
                    showBar={showBar ?? ""}
                    drawerType={drawerType ?? ""}
                    railType={railType ?? ""}
                    riceRail={riceRail ?? ""}
                    lowerDrawer={lowerDrawer ?? ""}
                    showQuantitySelector={false}
                    request={request ?? undefined}
                    onOptionClick={() => {
                        router.push(`/order/cabinet/?category=${category}&color=${color}`);
                    }}
                    quantity={0}
                    trashable={false} />
                <OrderSummaryCard
                    quantity={quantity}
                    unitPrice={9000}
                    onIncrease={() => setQuantity(q => q + 1)}
                    onDecrease={() => setQuantity(q => Math.max(1, q - 1))} />
            </div>
            <BottomButton
                type={"1button"}
                button1Text={"장바구니 담기"}
                className="fixed bottom-0 w-full max-w-[500px] px-5 pb-5 bg-white"
                onButton1Click={() => { }}
            />
        </div >
    );
}

export default ConfirmPage;

function getCategoryLabel(category: string | null) {
    if (!category) return "부분장";
    const found = CABINET_CATEGORY_LIST.find(item => item.slug === category);
    return found ? found.header : "부분장";
}