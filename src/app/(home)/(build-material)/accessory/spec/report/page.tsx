"use client";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import PaymentNoticeCard from "@/components/PaymentNoticeCard";

import { ACCESSORY_CATEGORY_LIST } from "@/constants/category";
import useItemStore from "@/store/itemStore";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import useCartStore from "@/store/cartStore";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { Accessory } from "dooring-core-domain/dist/models/InteriorMaterials/Accessory";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView, trackAddToCart } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";
import useCartItemStore from "@/store/cartItemStore";
import { sortProductTypes, sortDetailProductTypes } from "@/utils/formatCartProductTypes";
import { 
  getProductTypesFromCartItems, 
  getDetailProductTypesFromCartItems,
  getTotalQuantityFromCartItems,
  getTotalValueFromCartItems 
} from "@/utils/getCartProductTypes";

function ReportPageContent() {
    const router = useRouter();
    const { item } = useItemStore();
    const { cart, incrementCartCount } = useCartStore();
    const cartItems = useCartItemStore((state) => state.cartItems);

    const [quantity, setQuantity] = useState(1);

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('accessory_report');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

    // 빌드 시점에 item이 비어있을 수 있으므로 안전한 처리
    if (!item || Object.keys(item).length === 0) {
        return <div>로딩 중...</div>;
    }

    // 부속의 경우 고정 가격 또는 0으로 설정 (실제 가격 계산 로직이 있다면 여기에 추가)
    const unitPrice = 0; // 부속의 경우 별도 가격 계산이 필요할 수 있음

    // 카테고리 정보 가져오기
    const currentCategory = ACCESSORY_CATEGORY_LIST.find(cat => cat.slug === item.slug);
    const categoryTitle = currentCategory?.type || item.type || "부속";

    return (
        <div className="flex flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={100} />
            <Header size="Large" title={`${categoryTitle} 주문 개수를 선택해주세요`} />
            <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
                <ShoppingCartCard
                    type="accessory"
                    title={categoryTitle}
                    manufacturer={item?.accessory_madeby ?? ""}
                    modelName={item?.accessory_model ?? ""}
                    quantity={0}
                    trashable={false}
                    showQuantitySelector={false}
                    request={item.request ?? undefined}
                    onOptionClick={() => {
                        router.push(`/accessory/spec`);
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

                {/* 결제 안내 문구 */}
                <PaymentNoticeCard />
            </div>
            <div id="accessory-add-to-cart-button">
                <BottomButton
                    type={"1button"}
                    button1Text={"장바구니 담기"}
                    className="fixed bottom-0 w-full max-w-[460px]"
                    onButton1Click={async () => {
                        trackClick({
                            object_type: "button",
                            object_name: "add_to_cart",
                            current_page: getScreenName(),
                            modal_name: null,
                        });
                        console.log(item!);
                        try {

                            const accessory = new Accessory({
                                accessory_type: item.type,
                                accessory_madeby: item.accessory_madeby,
                                accessory_model: item.accessory_model,
                                accessory_request: item.request ?? undefined,
                            });

                            const createdAccessory = await new CrudInteriorMaterialsUsecase(
                                new InteriorMaterialsSupabaseRepository<Accessory>("Accessory")
                            ).create(accessory);

                            const detailProductType = DetailProductType.ACCESSORY;
                            
                            const cartItem = new CartItem({
                                cart_id: cart!.id!,
                                item_detail: createdAccessory.id!,
                                detail_product_type: detailProductType,
                                item_count: quantity,
                                unit_price: unitPrice,
                            });

                            const createdCartItem = await new CrudCartItemUsecase(
                                new CartItemSupabaseRepository()
                            ).create(cartItem);

                            console.log(createdCartItem);

                            // Add to Cart 이벤트 전송 (CartItem 생성 성공 후)
                            const cartQuantityTotalBefore = getTotalQuantityFromCartItems(cartItems);
                            const cartQuantityTypeBefore = cartItems.length;
                            const cartValueBefore = getTotalValueFromCartItems(cartItems);
                            
                            // 추가 후 상태 계산 (새 아이템 포함)
                            const productTypesAfter = getProductTypesFromCartItems(cartItems, detailProductType);
                            const detailProductTypesAfter = await getDetailProductTypesFromCartItems(cartItems, detailProductType, accessory);
                            
                            await trackAddToCart({
                                product_type: sortProductTypes(productTypesAfter),
                                detail_product_type: sortDetailProductTypes(detailProductTypesAfter),
                                quantity: quantity,
                                price_unit: unitPrice,
                                cart_quantity_total_before: cartQuantityTotalBefore,
                                cart_quantity_type_before: cartQuantityTypeBefore,
                                cart_value_before: cartValueBefore,
                            });

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

function ReportPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <ReportPageContent />
        </Suspense>
    );
}

export default ReportPage;
