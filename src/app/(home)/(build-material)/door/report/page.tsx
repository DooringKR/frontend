"use client";

import ShoppingCartCardNew from "@/components/Card/ShoppingCartCardNew";
import ImageCard from "@/components/Card/ImageCard";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import PaymentNoticeCard from "@/components/PaymentNoticeCard";
import BottomBar from "@/components/overlay/BottomBar";
import Notice from "@/components/state/Notice";
import { EmptyState, Loading } from "@/components/state/StateViews";
import { Button } from "@/components/ui/button";
import { ActionError, useAction } from "@/components/ui/use-action";
import { transformDoorToNewCardProps } from "@/utils/transformers/transformDoorToNewCardProps";

import useItemStore from "@/store/itemStore";
import useBizClientStore from "@/store/bizClientStore";
import { calculateUnitDoorPrice } from "@/services/pricing/doorPricing";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import useCartStore from "@/store/cartStore";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { Door } from "dooring-core-domain/dist/models/InteriorMaterials/Door";
import { DoorType, HingeDirection } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { DOOR_COLOR_LIST } from "dooring-core-domain/dist/constants/color";
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

import { useItemHydrated } from "../_components/DoorForm";

export default function DoorReportPage() {
    const router = useRouter();
    const { item } = useItemStore();
    const bizClient = useBizClientStore(state => state.bizClient);
    const { cart, incrementCartCount } = useCartStore();
    const cartItems = useCartItemStore((state) => state.cartItems);

    const [quantity, setQuantity] = useState(1);
    const hydrated = useItemHydrated();
    // 담기 — 연타 막기·도는 표시·실패는 버튼 바로 위. 성공하면 /cart 로 넘어가는 동안 계속 막아 둔다
    const add = useAction({ holdOnSuccess: true });

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

    // 저장된 item 을 읽기 전·담고 넘어가는 중엔 Loading, 읽었는데 없으면(새 탭 등) 처음부터
    if (!item || Object.keys(item).length === 0) {
        return !hydrated || add.busy ? (
            <Loading />
        ) : (
            <EmptyState text="담을 문 정보가 없어요" action={{ label: "문 고르러 가기", onClick: () => router.replace("/door") }} />
        );
    }

    const unitPrice = calculateUnitDoorPrice(
        item?.color ?? "",
        item?.door_width ?? 0,
        item?.door_height ?? 0,
        item?.is_pair_door ?? false
    );

    const addToCart = async () => {
        // 이미지 업로드 처리
        let doorImageUrls: string[] = [];
        if (item?.raw_images && item.raw_images.length > 0) {
            const uploadUsecase = new SupabaseUploadImageUsecase();
            doorImageUrls = await uploadUsecase.uploadImages(item.raw_images, "doors");
        }

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
            hinge_thickness: item.hinge_thickness ?? undefined,
            door_image_url: doorImageUrls, // 업로드된 이미지 URL들
            door_construct: item.door_construct ?? false,
            is_pair_door: item.is_pair_door ?? false,
        });

        const createdDoor = await new CrudInteriorMaterialsUsecase(
            new InteriorMaterialsSupabaseRepository<Door>("Door")
        ).create(door);

        const detailProductType = DetailProductType.DOOR;

        // 문짝의 경우 별도의 모델 클래스가 없으므로 직접 CartItem에 저장
        const maxNickName = cartItems.reduce((max, item) => {
            const num = parseInt(item.nick_name || "0");
            return num > max ? num : max;
        }, 0);
        const cartItem = new CartItem({
            cart_id: cart!.id!,
            item_detail: createdDoor.id!, // 문짝은 별도의 interior_material_id가 없음
            detail_product_type: detailProductType,
            item_count: quantity,
            unit_price: unitPrice,
            nick_name: (maxNickName + 1).toString(),
        });

        await new CrudCartItemUsecase(
            new CartItemSupabaseRepository()
        ).create(cartItem);

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

        // cart_count 증가
        await new CrudCartUsecase(
            new CartSupabaseRepository()
        ).incrementCartCount(cart!.id!, 1);

        // 전역 상태 업데이트
        incrementCartCount(1);

        // item 상태 초기화
        useItemStore.setState({ item: undefined });
        router.replace("/cart");
    };

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

                {item.is_pair_door && (
                    <Notice tone="red" title={`양문 세트를 ${quantity}개 주문하시면, 문짝은 ${2 * quantity}개 제작돼요.`} />
                )}

                {/* 결제 안내 문구 */}
                <PaymentNoticeCard />
            </div>

            <BottomBar top={<ActionError error={add.error} className="mb-3" />}>
                <Button
                    busy={add.busy}
                    onClick={() => {
                        if (!bizClient) {
                            trackClick({
                                object_type: "button",
                                object_name: "login_from_door_report",
                                current_page: getScreenName(),
                                modal_name: null,
                            });
                            router.push("/start");
                            return;
                        }
                        trackClick({
                            object_type: "button",
                            object_name: "add_to_cart",
                            current_page: getScreenName(),
                            modal_name: null,
                        });
                        add.run(async () => {
                            try {
                                await addToCart();
                            } catch (error) {
                                console.error("장바구니 담기 실패:", error);
                                throw new Error("장바구니에 담지 못했어요. 잠시 뒤 다시 눌러 주세요.");
                            }
                        });
                    }}
                >
                    {!bizClient ? "로그인하고 장바구니 담기" : "장바구니 담기"}
                </Button>
            </BottomBar>
        </div>
    );
}
