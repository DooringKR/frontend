"use client";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import useItemStore from "@/store/Items/itemStore";
import { calculateUnitDoorPrice } from "@/services/pricing/doorPricing";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";

import formatColor from "@/utils/formatColor";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import useCartStore from "@/store/cartStore";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";


function DoorReportPageContent() {
    const router = useRouter();
    const { item } = useItemStore();
    const { cart, incrementCartCount } = useCartStore();

    const [quantity, setQuantity] = useState(1);

    // 빌드 시점에 item이 비어있을 수 있으므로 안전한 처리
    if (!item || Object.keys(item).length === 0) {
        return <div>로딩 중...</div>;
    }

    const unitPrice = calculateUnitDoorPrice(
        item?.color ?? "",
        item?.width ?? 0,
        item?.height ?? 0
    );

    // 카테고리 정보 가져오기

    return (
        <div className="flex flex-col">
            <TopNavigator />
            <Header size="Large" title={`${item.type} 주문 개수를 선택해주세요`} />
            <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
                <ShoppingCartCard
                    type="door"
                    title={item.type}
                    color={formatColor(item?.color ?? "")}
                    width={item?.width ?? undefined}
                    height={item?.height ?? undefined}
                    hingeDirection={item?.hinge_direction ?? undefined}
                    hingeCount={item?.hinge ? item.hinge.length : undefined}
                    boring={item?.hinge || []}
                    boringCategory={item?.category || undefined}
                    quantity={0}
                    trashable={false}
                    showQuantitySelector={false}
                    request={item?.request ?? undefined}
                    location={item?.door_location ?? undefined}
                    addOn_hinge={item?.addOn_hinge ?? undefined}
                    onOptionClick={() => {
                        router.push(`/door/standard`);
                    }}
                />
                <OrderSummaryCard
                    quantity={quantity}
                    unitPrice={unitPrice}
                    onIncrease={() => {
                        setQuantity(q => q + 1);
                    }}
                    onDecrease={() => {
                        setQuantity(q => Math.max(1, q - 1));
                    }}
                />
            </div>
            <div id="door-add-to-cart-button">
                <BottomButton
                    type={"1button"}
                    button1Text={"장바구니 담기"}
                    className="fixed bottom-0 w-full max-w-[460px]"
                    onButton1Click={async () => {
                        console.log(item!);
                        try {
                            // 문짝의 경우 별도의 모델 클래스가 없으므로 직접 CartItem에 저장
                            const cartItem = new CartItem({
                                cart_id: cart!.id!,
                                item_detail: "", // 문짝은 별도의 interior_material_id가 없음
                                detail_product_type: DetailProductType.DOOR,
                                item_count: quantity,
                                unit_price: unitPrice,
                                // 문짝 정보를 item_options에 저장
                            });

                            const createdCartItem = await new CrudCartItemUsecase(
                                new CartItemSupabaseRepository()
                            ).create(cartItem);

                            console.log(createdCartItem);

                            // cart_count 증가
                            const cartCountResponse = await new CrudCartUsecase(
                                new CartSupabaseRepository()
                            ).incrementCartCount(cart!.id!, 1);

                            console.log("cartCountResponse", cartCountResponse);

                            // 전역 상태 업데이트
                            incrementCartCount(1);
                            console.log(cart);

                            // item 상태 초기화
                            useItemStore.setState({ item: undefined });
                            router.replace("/cart");
                        } catch (error: any) {
                            console.error("장바구니 담기 실패:", error);
                        }
                    }}
                />
            </div>
        </div>
    );
}

function DoorReportPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <DoorReportPageContent />
        </Suspense>
    );
}

export default DoorReportPage;
