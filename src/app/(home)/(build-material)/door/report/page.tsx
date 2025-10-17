"use client";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import useItemStore from "@/store/itemStore";
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
import { Door } from "dooring-core-domain/dist/models/InteriorMaterials/Door";
import { DoorType, HingeDirection } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { DOOR_COLOR_LIST } from "@/constants/colorList";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";


function DoorReportPageContent() {
    const router = useRouter();
    const { item } = useItemStore();
    const { cart, incrementCartCount } = useCartStore();

    const [quantity, setQuantity] = useState(1);

    // color 문자열을 color.id로 변환하는 함수
    const getColorId = (colorName: string) => {
        const colorItem = DOOR_COLOR_LIST.find(item => item.name === colorName);
        return colorItem?.id;
    };

    // 빌드 시점에 item이 비어있을 수 있으므로 안전한 처리
    if (!item || Object.keys(item).length === 0) {
        return <div>로딩 중...</div>;
    }

    const unitPrice = calculateUnitDoorPrice(
        item?.color ?? "",
        item?.door_width ?? 0,
        item?.door_height ?? 0
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
                    color={item?.color ? formatColor(item?.color ?? "") : "(직접입력) " + item?.door_color_direct_input}
                    width={item?.door_width ?? undefined}
                    height={item?.door_height ?? undefined}
                    hingeCount={item?.hinge ? item.hinge.length : undefined}
                    hingeDirection={item?.hinge_direction ?? undefined}
                    boring={item?.hinge || undefined}
                    boringCategory={item?.type as DoorType || undefined}
                    quantity={0}
                    trashable={false}
                    showQuantitySelector={false}
                    location={item?.door_location ?? undefined}
                    addOn_hinge={item?.addOn_hinge ?? undefined}
                    request={item?.door_request ?? undefined}
                    onOptionClick={() => {
                        router.push(`/door/${DOOR_CATEGORY_LIST.find(cat => cat.type === item.type)?.slug}`);
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
                            // Door 생성자에 필요한 모든 인자를 전달해야 합니다.
                            // 예시로, Door 생성자가 7~12개의 인자를 받는다고 가정하고, 필요한 값을 item에서 가져옵니다.
                            // 실제 Door 클래스의 생성자 시그니처에 맞게 수정하세요.
                            const door = new Door({
                                door_type: item.type as DoorType,
                                door_color: getColorId(item.color ?? ""),
                                door_color_direct_input: item.door_color_direct_input ?? undefined,
                                door_width: item.door_width!,
                                door_height: item.door_height!,
                                hinge_direction: item.hinge_direction as HingeDirection,
                                hinge: item.hinge!,
                                door_location: item.door_location ?? undefined,
                                door_request: item.door_request ?? undefined,
                                addOn_hinge: item.addOn_hinge ?? false,
                            });

                            console.log(door);

                            const createdDoor = await new CrudInteriorMaterialsUsecase(
                                new InteriorMaterialsSupabaseRepository<Door>("Door")
                            ).create(door);

                            // 문짝의 경우 별도의 모델 클래스가 없으므로 직접 CartItem에 저장
                            const cartItem = new CartItem({
                                cart_id: cart!.id!,
                                item_detail: createdDoor.id!, // 문짝은 별도의 interior_material_id가 없음
                                detail_product_type: DetailProductType.DOOR,
                                item_count: quantity,
                                unit_price: unitPrice,
                                // 문짝 정보를 item_options에 저장
                            });

                            const createdCartItem = await new CrudCartItemUsecase(
                                new CartItemSupabaseRepository()
                            ).create(cartItem);

                            console.log(createdCartItem);

                            // // cart_count 증가
                            const cartCountResponse = await new CrudCartUsecase(
                                new CartSupabaseRepository()
                            ).incrementCartCount(cart!.id!, 1);

                            console.log("cartCountResponse", cartCountResponse);

                            // // 전역 상태 업데이트
                            incrementCartCount(1);
                            // console.log(cart);

                            // // item 상태 초기화
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
