"use client";

import ShoppingCartCardNew from "@/components/Card/ShoppingCartCardNew";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import BottomBar from "@/components/overlay/BottomBar";
import { EmptyState, Loading } from "@/components/state/StateViews";
import { Button } from "@/components/ui/button";
import { ActionError, useAction } from "@/components/ui/use-action";
import { goAfterSubmit } from "@/lib/nav/go";
import { setAfterLogin } from "@/utils/afterLogin";
import { toast } from "sonner";

import { FINISH_COLOR_LIST } from "dooring-core-domain/dist/constants/color";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import useItemStore from "@/store/itemStore";
import useBizClientStore from "@/store/bizClientStore";
import { calculateUnitFinishPrice } from "@/services/pricing/finishPricing";
import { Finish } from "dooring-core-domain/dist/models/InteriorMaterials/Finish";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function ReportPage() {
    const router = useRouter();
    const { item } = useItemStore();
    const bizClient = useBizClientStore(state => state.bizClient);
    const { cart, incrementCartCount } = useCartStore();
    const cartItems = useCartItemStore((state) => state.cartItems);

    const [quantity, setQuantity] = useState(1);
    // 담으면 장바구니로 넘어가는 동안 계속 막아 둔다(두 번 담기 방지)
    const add = useAction({ holdOnSuccess: true });
    // 서버 미리 그리기 때는 저장된 item 이 아직 없다 — 그린 뒤에 「없음」을 가린다
    const [mounted, setMounted] = useState(false);

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        setMounted(true);
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

    if (!item || Object.keys(item).length === 0) {
        // 담기에 성공해 item 을 비운 뒤 넘어가는 동안에도 Loading
        if (!mounted || add.busy) return <Loading />;
        return <EmptyState text="담을 마감재가 없어요" action={{ label: "마감재 고르기", onClick: () => router.replace("/finish") }} />;
    }

    const unitPrice = calculateUnitFinishPrice(
        item?.color ?? "",
        item?.depth ?? 0,
        item?.depthIncrease ?? 0,
        item?.height ?? 0,
        item?.heightIncrease ?? 0,
        item.type
    );

    const addToCart = () =>
        add.run(async () => {
            if (!bizClient) {
                trackClick({
                    object_type: "button",
                    object_name: "login_from_finish_report",
                    current_page: getScreenName(),
                    modal_name: null,
                });
                // 로그인 뒤 이 화면으로 돌아온다(item 은 저장돼 있다)
                setAfterLogin("/finish/report");
                router.push("/start");
                return;
            }
            trackClick({
                object_type: "button",
                object_name: "add_to_cart",
                current_page: getScreenName(),
                modal_name: null,
            });
            if (!cart?.id) throw new Error("장바구니 정보를 불러오지 못했어요. 새로고침 뒤 다시 눌러 주세요");
            try {
                // 이미지 업로드 처리 (문의 경우와 동일)
                let finishImageUrls: string[] = [];
                if (item.raw_images && item.raw_images.length > 0) {
                    const uploadUsecase = new SupabaseUploadImageUsecase();
                    finishImageUrls = await uploadUsecase.uploadImages(item.raw_images, "finish");
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

                const maxNickName = cartItems.reduce((max, item) => {
                    const num = parseInt(item.nick_name || "0");
                    return num > max ? num : max;
                }, 0);
                const cartItem = new CartItem({
                    cart_id: cart.id,
                    item_detail: createdFinish.id!, // interior_material_id (Finish 객체의 id 프로퍼티가 private이므로, 인덱싱으로 접근)
                    detail_product_type: detailProductType,
                    item_count: quantity,
                    unit_price: unitPrice,
                    nick_name: (maxNickName + 1).toString(),
                });
                await new CrudCartItemUsecase(new CartItemSupabaseRepository()).create(cartItem);

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
                await new CrudCartUsecase(new CartSupabaseRepository()).incrementCartCount(cart.id, 1);
                incrementCartCount(1);
            } catch (error) {
                console.error("장바구니 담기 실패:", error);
                throw new Error("장바구니에 담지 못했어요. 다시 눌러 주세요");
            }
            toast.success("장바구니에 담았어요");
            useItemStore.setState({ item: undefined });
            goAfterSubmit(router, "/cart");
        });

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
            <BottomBar top={<ActionError error={add.error} className="mb-3" />}>
                <Button busy={add.busy} onClick={addToCart}>
                    {bizClient ? "장바구니 담기" : "로그인하고 장바구니 담기"}
                </Button>
            </BottomBar>
        </div>
    );
}
