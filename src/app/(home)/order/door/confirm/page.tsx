'use client'
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { useRouter, useSearchParams } from "next/navigation";
import { COLOR_LIST } from "@/constants/colorList";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import { useState } from "react";
import BottomButton from "@/components/BottomButton/BottomButton";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import formatColor from "@/utils/formatColor";
import formatSize from "@/utils/formatSize";

function getCategoryLabel(category: string | null) {
    if (category === "normal") return "일반문";
    if (category === "flap") return "플랩문";
    if (category === "drawer") return "서랍";
    return "문짝";
}



function isPredefinedColor(color: string | null) {
    if (!color) return false;
    return COLOR_LIST.some(item => item.name === color);
}

function formatBoring(boringSize: string | null) {
    if (!boringSize) return "";
    let arr: (number | null)[] = [];
    try {
        arr = JSON.parse(boringSize);
    } catch {
        return "";
    }
    if (!Array.isArray(arr)) return "";
    const labelMap = [
        ["상", "하"],
        ["상", "중", "하"],
        ["상", "중상", "중하", "하"],
    ];
    const label = labelMap[arr.length - 2];
    if (!label) return arr.join(", ");
    return arr
        .map((v, i) => (v !== null && v !== undefined ? `${label[i]}${v}` : null))
        .filter(Boolean)
        .join(", ");
}

function formatBoringDirection(dir: string | null) {
    if (dir === "left") return "좌경";
    if (dir === "right") return "우경";
    return dir ?? "";
}

function ConfirmPage() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const category = searchParams.get("category");
    const color = searchParams.get("color");
    const width = searchParams.get("width");
    const height = searchParams.get("height");
    const boringDirection = searchParams.get("boringDirection");
    const boringSize = searchParams.get("boringSize");
    const request = searchParams.get("request");
    const isPredefined = isPredefinedColor(color);
    const [quantity, setQuantity] = useState(1);
    return (
        <div>
            <TopNavigator />
            <Header size="Large" title={`${getCategoryLabel(category)} 주문 개수를 선택해주세요`} />
            <div className="flex flex-col gap-[20px] px-5 pt-5 pb-[100px]">
                <ShoppingCartCard
                    type="door"
                    title={getCategoryLabel(category)}
                    color={formatColor(color)}
                    width={formatSize(width)}
                    height={formatSize(height)}
                    hingeDirection={formatBoringDirection(boringDirection)}
                    hingeCount={boringSize ? JSON.parse(boringSize).length : 0}
                    boring={formatBoring(boringSize)}
                    // 아래의 다른 컴포넌트로 전달할 예정이라 여기선 일단 0으로 전달
                    quantity={0}
                    trashable={false}
                    showQuantitySelector={false}
                    request={request ?? undefined}
                    onOptionClick={() => {
                        router.push(`/order/door/?category=${category}&color=${color}`);
                    }}
                />
                <OrderSummaryCard quantity={quantity} unitPrice={9000} onIncrease={() => setQuantity(q => q + 1)} onDecrease={() => setQuantity(q => Math.max(1, q - 1))} />
            </div>
            <BottomButton
                type={"1button"}
                button1Text={"장바구니 담기"}
                className="fixed bottom-0 w-full max-w-[500px] px-5 pb-5 bg-white"
                onButton1Click={() => { }}
            />
        </div>
    );
}

export default ConfirmPage;
