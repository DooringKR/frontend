"use client";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCardNew from "@/components/Card/ShoppingCartCardNew";
import ImageCard from "@/components/Card/ImageCard";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import PaymentNoticeCard from "@/components/PaymentNoticeCard";
import { transformDoorToNewCardProps } from "@/utils/transformers/transformDoorToNewCardProps";

import { DOOR_CATEGORY_LIST } from "@/constants/category";
import useItemStore from "@/store/itemStore";
import { calculateUnitDoorPrice } from "@/services/pricing/doorPricing";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import formatColor from "@/utils/formatColor";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import useCartStore from "@/store/cartStore";
import { DetailProductType, ProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { Door } from "dooring-core-domain/dist/models/InteriorMaterials/Door";
import { DoorType, HingeDirection } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { DOOR_COLOR_LIST } from "@/constants/colorList";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import { SupabaseUploadImageUsecase } from "@/DDD/usecase/upload_image_usecase";

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


function DoorReportPageContent() {
    const router = useRouter();
    const { item } = useItemStore();
    const { cart, incrementCartCount } = useCartStore();
    const cartItems = useCartItemStore((state) => state.cartItems);

    const [quantity, setQuantity] = useState(1);

    // color 문자열을 color.id로 변환하는 함수
    const getColorId = (colorName: string) => {
        const colorItem = DOOR_COLOR_LIST.find(item => item.name === colorName);
        return colorItem?.id;
    };

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('door_report');
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

    const unitPrice = calculateUnitDoorPrice(
        item?.color ?? "",
        item?.door_width ?? 0,
        item?.door_height ?? 0
    );

    // 카테고리 정보 가져오기

    return (
        <div className="flex flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={100} />
            <Header size="Large" title={`${item.type} 주문 개수를 선택해주세요`} />
            <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">

                <ShoppingCartCardNew
                        {...transformDoorToNewCardProps(item)}
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

                {/* 결제 안내 문구 */}
                <PaymentNoticeCard />
            </div>

            <div id="door-add-to-cart-button">
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
                            // 이미지 업로드 처리
                            let doorImageUrls: string[] = [];
                            if (item?.raw_images && item.raw_images.length > 0) {
                                console.log('이미지 업로드 시작:', item.raw_images.length, '개');
                                const uploadUsecase = new SupabaseUploadImageUsecase();
                                doorImageUrls = await uploadUsecase.uploadImages(item.raw_images, "doors");
                                console.log('이미지 업로드 완료:', doorImageUrls);
                            }

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
                                door_image_url: doorImageUrls, // 업로드된 이미지 URL들
                                door_construct: item.door_construct ?? false,
                            });

                            console.log(door);

                            const createdDoor = await new CrudInteriorMaterialsUsecase(
                                new InteriorMaterialsSupabaseRepository<Door>("Door")
                            ).create(door);

                            const detailProductType = DetailProductType.DOOR;
                            
                            // 문짝의 경우 별도의 모델 클래스가 없으므로 직접 CartItem에 저장
                            const cartItem = new CartItem({
                                cart_id: cart!.id!,
                                item_detail: createdDoor.id!, // 문짝은 별도의 interior_material_id가 없음
                                detail_product_type: detailProductType,
                                item_count: quantity,
                                unit_price: unitPrice,
                                // 문짝 정보를 item_options에 저장
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
                            const detailProductTypesAfter = await getDetailProductTypesFromCartItems(cartItems, detailProductType, door);
                            
                            await trackAddToCart({
                                product_type: sortProductTypes(productTypesAfter),
                                detail_product_type: sortDetailProductTypes(detailProductTypesAfter),
                                quantity: quantity,
                                price_unit: unitPrice,
                                cart_quantity_total_before: cartQuantityTotalBefore,
                                cart_quantity_type_before: cartQuantityTypeBefore,
                                cart_value_before: cartValueBefore,
                            });

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
