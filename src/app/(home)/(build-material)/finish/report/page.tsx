"use client";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCardNew from "@/components/Card/ShoppingCartCardNew";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { FINISH_COLOR_LIST } from "dooring-core-domain/dist/constants/color";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { FINISH_CATEGORY_LIST } from "@/constants/category";
import useItemStore from "@/store/itemStore";
import useBizClientStore from "@/store/bizClientStore";
import { calculateUnitFinishPrice } from "@/services/pricing/finishPricing";
import { Finish } from "dooring-core-domain/dist/models/InteriorMaterials/Finish";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import formatColor from "@/utils/formatColor";
import { transformFinishToNewCardProps } from "@/utils/transformers/transformFinishToNewCardProps";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import useCartStore from "@/store/cartStore";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { SupabaseUploadImageUsecase } from "@/DDD/usecase/upload_image_usecase";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView, trackAddToCart } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";
import { FinishType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import ImageCard from "@/components/Card/ImageCard";
import PaymentNoticeCard from "@/components/PaymentNoticeCard";
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
    const bizClient = useBizClientStore(state => state.bizClient);
    const { cart, incrementCartCount } = useCartStore();
    const cartItems = useCartItemStore((state) => state.cartItems);

    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('finish_report');
        const prev = getPreviousScreenName();
        trackView({
            object_type: "screen",
            object_name: null,
            current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
            previous_screen: prev,
        });
    }, []);

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
        item.type
    );

    return (
        <div className="flex flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={100} />
            <Header size="Large" title={`마감재 주문 개수를 선택해주세요`} />
            <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">

                <ShoppingCartCardNew
                    {...transformFinishToNewCardProps(item)}
                />

                {/* 업로드된 이미지 표시 */}
                <ImageCard images={item?.raw_images || []} />
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
                <PaymentNoticeCard />
            </div>
            <div id="finish-add-to-cart-button">
                <BottomButton
                    type={"1button"}
                    button1Text={
                        !bizClient
                            ? "로그인하고 장바구니 담기"
                            : isLoading
                                ? "처리 중..."
                                : "장바구니 담기"
                    }
                    className="fixed bottom-0 w-full max-w-[460px]"
                    button1Disabled={!!bizClient && isLoading}
                    onButton1Click={async () => {
                        if (!bizClient) {
                            trackClick({
                                object_type: "button",
                                object_name: "login_from_finish_report",
                                current_page: getScreenName(),
                                modal_name: null,
                            });
                            router.push("/start");
                            return;
                        }
                        // 이미 로딩 중이면 중복 클릭 방지
                        if (isLoading) return;

                        setIsLoading(true);
                        trackClick({
                            object_type: "button",
                            object_name: "add_to_cart",
                            current_page: getScreenName(),
                            modal_name: null,
                        });
                        console.log(item!);
                        try {
                            // 이미지 업로드 처리 (문의 경우와 동일)
                            let finishImageUrls: string[] = [];
                            if (item.raw_images && item.raw_images.length > 0) {
                                console.log('마감재 이미지 업로드 시작:', item.raw_images.length, '개');
                                const uploadUsecase = new SupabaseUploadImageUsecase();
                                finishImageUrls = await uploadUsecase.uploadImages(item.raw_images, "finish");
                                console.log('마감재 이미지 업로드 완료:', finishImageUrls);
                            }

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
                                finish_image_url: finishImageUrls, // 업로드된 이미지 URL들
                            });

                            // Finish 객체를 Supabase에 저장
                            const createdFinish = await new CrudInteriorMaterialsUsecase(
                                new InteriorMaterialsSupabaseRepository<Finish>("Finish")
                            ).create(finish);

                            const detailProductType = DetailProductType.FINISH;

                            // cartitem 생성
                            console.log(createdFinish);

                            console.log(
                                item.id
                            );

                            const maxNickName = cartItems.reduce((max, item) => {
                                const num = parseInt(item.nick_name || "0");
                                return num > max ? num : max;
                            }, 0);
                            const cartItem = new CartItem({
                                cart_id: cart!.id!, // 
                                item_detail: createdFinish.id!, // interior_material_id (Finish 객체의 id 프로퍼티가 private이므로, 인덱싱으로 접근)
                                detail_product_type: detailProductType, // quantity
                                item_count: quantity, // quantity
                                unit_price: unitPrice, // unit_price (필요하다면 값 할당)
                                nick_name: (maxNickName + 1).toString(),
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
                            const detailProductTypesAfter = await getDetailProductTypesFromCartItems(cartItems, detailProductType, finish);

                            await trackAddToCart({
                                product_type: sortProductTypes(productTypesAfter),
                                detail_product_type: sortDetailProductTypes(detailProductTypesAfter),
                                quantity: quantity,
                                price_unit: unitPrice,
                                cart_quantity_total_before: cartQuantityTotalBefore,
                                cart_quantity_type_before: cartQuantityTypeBefore,
                                cart_value_before: cartValueBefore,
                            });

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
                            setIsLoading(false);
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
