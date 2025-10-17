"use client";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { FINISH_COLOR_LIST } from "@/constants/colorList";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { FINISH_CATEGORY_LIST } from "@/constants/category";
import useItemStore from "@/store/itemStore";
import { calculateUnitFinishPrice } from "@/services/pricing/finishPricing";
import { Finish } from "dooring-core-domain/dist/models/InteriorMaterials/Finish";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";

import formatColor from "@/utils/formatColor";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import useCartStore from "@/store/cartStore";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";

function ReportPageContent() {
    const router = useRouter();
    const { item } = useItemStore();
    const { cart, incrementCartCount } = useCartStore();

    const [quantity, setQuantity] = useState(1);

    // color 문자열을 color.id로 변환하는 함수
    const getColorId = (colorName: string) => {
        const colorItem = FINISH_COLOR_LIST.find(item => item.name === colorName);
        return colorItem?.id;
    };

    // 빌드 시점에 cart가 비어있을 수 있으므로 안전한 처리
    if (!item || Object.keys(item).length === 0) {
        return <div>로딩 중...</div>;
    }

    const unitPrice = calculateUnitFinishPrice(
        item?.color ?? "",
        item?.depth ?? 0,
        item?.depthIncrease ?? 0,
        item?.height ?? 0,
        item?.heightIncrease ?? 0,
    );

    return (
        <div className="flex flex-col">
            <TopNavigator />
            <Header size="Large" title={`마감재 주문 개수를 선택해주세요`} />
            <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
                <ShoppingCartCard
                    type="finish"
                    title={item?.type ?? ""}
                    color={item?.color ? formatColor(item?.color ?? "") : "(직접입력) " + item?.finish_color_direct_input}
                    edgeCount={item?.edgeCount ?? undefined}
                    depth={item?.depth ? Number(item.depth) : undefined}
                    height={item?.height ? Number(item.height) : undefined}
                    depthIncrease={item?.depthIncrease ? Number(item.depthIncrease) : undefined}
                    heightIncrease={item?.heightIncrease ? Number(item.heightIncrease) : undefined}
                    location={item.finish_location ?? undefined}
                    quantity={0}
                    trashable={false}
                    showQuantitySelector={false}
                    request={item.request ?? undefined}
                    onOptionClick={() => {
                        router.push(`/finish/${FINISH_CATEGORY_LIST.find(item => item.type === item?.type)?.slug}`);
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
            <div id="finish-add-to-cart-button">
                <BottomButton
                    type={"1button"}
                    button1Text={"장바구니 담기"}
                    className="fixed bottom-0 w-full max-w-[460px]"
                    onButton1Click={async () => {
                        console.log(item!);
                        try {

                            // dooring-core-domain의 Finish 클래스를 사용하여 finish 객체 생성
                            const finish = new Finish({
                                finish_type: item.type, // 올바른 FinishType 사용
                                finish_color: getColorId(item.color ?? ""), // color.id로 변경 (없으면 undefined)
                                finish_edge_count: item.edgeCount!,
                                finish_base_depth: item.depth!,
                                finish_base_height: item.height!,
                                finish_additional_depth: item.depthIncrease ?? undefined,
                                finish_additional_height: item.heightIncrease ?? undefined,
                                finish_location: item.finish_location ?? undefined,
                                finish_color_direct_input: item.finish_color_direct_input ?? undefined, // colorId가 없으면 원본 색상 문자열 사용
                                finish_request: item.request ?? undefined,
                            });

                            // Finish 객체를 Supabase에 저장
                            const createdFinish = await new CrudInteriorMaterialsUsecase(
                                new InteriorMaterialsSupabaseRepository<Finish>("Finish")
                            ).create(finish);

                            // cartitem 생성
                            console.log(createdFinish);

                            console.log(
                                item.id
                            );

                            const cartItem = new CartItem({
                                cart_id: cart!.id!, // 
                                item_detail: createdFinish.id!, // interior_material_id (Finish 객체의 id 프로퍼티가 private이므로, 인덱싱으로 접근)
                                detail_product_type: DetailProductType.FINISH, // quantity
                                item_count: quantity, // quantity
                                unit_price: unitPrice, // unit_price (필요하다면 값 할당)
                            });
                            const createdCartItem = await new CrudCartItemUsecase(
                                new CartItemSupabaseRepository()
                            ).create(cartItem);

                            console.log(createdCartItem);

                            // cart_count 증가 (전체 카트 객체 전달 없이)
                            const cartCountResponse = await new CrudCartUsecase(
                                new CartSupabaseRepository()
                            ).incrementCartCount(cart!.id!, 1);

                            console.log("cartCountResponse", cartCountResponse);

                            // TODO: 전역변수에 추가
                            incrementCartCount(1);
                            console.log(cart);

                            // 장바구니 페이지로 이동

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

function ReportPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <ReportPageContent />
        </Suspense>
    );
}

export default ReportPage;
