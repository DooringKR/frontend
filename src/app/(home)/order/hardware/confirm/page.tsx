'use client'

import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { useRouter, useSearchParams } from "next/navigation";
import { HARDWARE_CATEGORY_LIST } from "@/constants/category";
import { useState } from "react";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import BottomButton from "@/components/BottomButton/BottomButton";

function ConfirmPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const type = searchParams.get("type");
    const category = searchParams.get("category");
    const manufacturer = searchParams.get("manufacturer");
    const size = searchParams.get("size");
    const request = searchParams.get("request");


    const [quantity, setQuantity] = useState(1);

    return (
        <div>
            <TopNavigator />
            <Header size="Large" title={`${HARDWARE_CATEGORY_LIST.find(item => item.slug === category)?.header} 주문 개수를 선택해주세요`} />
            <div className="flex flex-col pt-5 px-5 gap-[20px] pb-[100px]">
                <ShoppingCartCard
                    type="hardware"
                    title={`${HARDWARE_CATEGORY_LIST.find(item => item.slug === category)?.header}`}
                    showQuantitySelector={false}
                    request={request ?? undefined}
                    manufacturer={manufacturer ?? undefined}
                    size={size ? `${size}mm` : undefined}
                    onOptionClick={() => {
                        router.push(`/order/hardware/?category=${category}`);
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
