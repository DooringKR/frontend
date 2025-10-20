"use client";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

import Header from "@/components/Header/Header";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { DoorType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import useItemStore from "@/store/itemStore";
import { ProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";

function DoorCategoryPage() {
    const router = useRouter();
    const doorcategory = DOOR_CATEGORY_LIST;
    const setItem = useItemStore(state => state.setItem);

    return (
        <div className="flex flex-col">
            <TopNavigator />
            <Header size="Large" title={`문 종류를 선택해주세요`} />
            <div className="grid w-full grid-cols-2 gap-x-3 gap-y-[40px] px-5 pb-5 pt-10">
                {doorcategory.map((category, idx) => (
                    <div
                        key={category.slug}
                        className="flex flex-1 cursor-pointer flex-col items-center gap-2"
                        onClick={() => {
                            setItem({
                                category: ProductType.DOOR,
                                type: category.type as DoorType,
                            });
                            router.push(`/door/color`);
                        }}
                    >
                        <div className="relative aspect-square w-full">
                            <Image
                                src={category.image}
                                alt={category.type === DoorType.DRAWER ? '서랍 마에다' : (category.type || '')}
                                fill
                                style={{
                                    objectFit: "contain",
                                }}
                                className="w-full h-full object-cover rounded-[28px] border-[2px] border-[rgba(3,7,18,0.05)]"
                            />
                        </div>
                        <div className="text-center text-[17px]/[24px] font-500 text-gray-500">
                            {category.type === DoorType.DRAWER ? '서랍 마에다' : (category.type || '')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function OrderPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <DoorCategoryPage />
        </Suspense>
    );
}

export default OrderPage;
