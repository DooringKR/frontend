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

import useItemStore from "@/store/itemStore";
import useBizClientStore from "@/store/bizClientStore";
import { calculateLongDoorUnitPriceWithOptions, LONG_DOOR_CONSTRUCT_PRICE } from "@/services/pricing/longDoorPricing";
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
import { LongDoor } from "dooring-core-domain/dist/models/CompositeProducts/LongDoor";
import { DoorType, HingeDirection, Location, CabinetHandleType, HingeThickness } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
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


function LongDoorReportPageContent() {
    const router = useRouter();
    const { item } = useItemStore();
    const bizClient = useBizClientStore(state => state.bizClient);
    const { cart, incrementCartCount } = useCartStore();
    const cartItems = useCartItemStore((state) => state.cartItems);

    const [isLoading, setIsLoading] = useState(false);
    const [isDoorsExpanded, setIsDoorsExpanded] = useState(false);

    // color 문자열을 color.id로 변환하는 함수
    const getColorId = (colorName: string) => {
        const colorItem = DOOR_COLOR_LIST.find(item => item.name === colorName);
        return colorItem?.id;
    };

    // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
    useEffect(() => {
        // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
        setScreenName('preset_longdoor_report');
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

    // longdoor는 여러 문을 관리하므로 doors 배열 확인 (보링은 문별 override 또는 공통값)
    type DoorRow = {
        door_width: number | null;
        hinge_direction: HingeDirection | null;
        boringNum?: 2 | 3 | 4 | null;
        hinge?: (number | null)[];
    };
    const doors = (item?.doors as DoorRow[] | undefined) || [];
    const quantity = doors.length || item?.quantity || 1;

    // 문별 실제 보링: override 있으면 door 값, 없으면 item 공통값
    const getEffectiveBoring = (door: DoorRow) => {
        const hasOverride = door?.boringNum !== undefined || (door?.hinge && door.hinge.length > 0);
        if (hasOverride) {
            return { boringNum: door?.boringNum ?? null, hinge: door?.hinge ?? [] };
        }
        const commonNum = (item?.boringNum as 2 | 3 | 4 | null) ?? null;
        const commonHinge = (Array.isArray(item?.hinge) ? item.hinge : []) as (number | null)[];
        return { boringNum: commonNum, hinge: commonHinge };
    };

    // 첫 번째 문의 정보를 기준으로 카드 표시 (공통 속성 사용)
    const firstDoor = doors[0];
    const displayItem = {
        ...item,
        door_width: firstDoor?.door_width ?? item?.door_width ?? 0,
        hinge_direction: firstDoor?.hinge_direction ?? (item?.hinge_direction as HingeDirection),
    };

    // 각 문의 가로 길이를 기반으로 개별 가격 계산 후 합산
    const totalPrice = doors.reduce((sum, door) => {
        if (door.door_width && door.door_width > 0) {
            const doorPrice = calculateLongDoorUnitPriceWithOptions({
                color: item?.color ?? "",
                width: door.door_width,
                addOnHinge: !!item?.addOn_hinge,
            });
            return sum + doorPrice;
        }
        return sum;
    }, 0);

    // 시공 선택 시 30만원 추가
    const totalPriceWithConstruct = totalPrice + (item?.door_construct ? LONG_DOOR_CONSTRUCT_PRICE : 0);

    // 표시용 단가 (총 가격 / 문 개수)
    const averageUnitPrice = quantity > 0 ? Math.round(totalPrice / quantity) : 0;

    return (
        <div className="flex flex-col pt-[90px]">
            <InitAmplitude />
            <TopNavigator />
            <ProgressBar progress={100} />
            <Header size="Large" title={`롱문 주문 개수를 확인해주세요`} />
            <div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">

                <ShoppingCartCardNew
                    {...transformDoorToNewCardProps(displayItem)}
                />

                {/* 업로드된 이미지 표시 */}
                <ImageCard images={item?.raw_images || []} />

                {/* 문짝 개수 및 개별 문 정보 (아코디언) */}
                {doors.length > 0 && (
                    <div className="w-full rounded-2xl border border-gray-200 bg-white overflow-hidden">
                        {/* 헤더 (클릭 가능) */}
                        <div
                            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setIsDoorsExpanded(!isDoorsExpanded)}
                        >
                            <div className="text-[16px]/[22px] font-600 text-gray-800">문짝 개수</div>
                            <div className="flex items-center gap-2">
                                <div className="text-[16px]/[22px] font-600 text-gray-800">{quantity}개</div>
                                <svg
                                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDoorsExpanded ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* 개별 문 정보 (펼쳐지는 부분) */}
                        {isDoorsExpanded && (
                            <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                                <div className="mb-3 text-[14px] font-600 text-gray-800">개별 문 정보</div>
                                <div className="space-y-2">
                                    {doors.map((door, idx) => {
                                        // 각 문의 단가 계산
                                        const doorUnitPrice = door.door_width && door.door_width > 0
                                            ? calculateLongDoorUnitPriceWithOptions({
                                                color: item?.color ?? "",
                                                width: door.door_width,
                                                addOnHinge: !!item?.addOn_hinge,
                                            })
                                            : 0;

                                        const effectiveBoring = getEffectiveBoring(door);
                                        const hinge = effectiveBoring.hinge;
                                        const boringLabel = hinge.length === 1 && hinge[0] === null
                                            ? "모름"
                                            : effectiveBoring.boringNum
                                                ? `${effectiveBoring.boringNum}개`
                                                : "미입력";
                                        const boringSizeLabel = hinge.length > 0
                                            ? `[${hinge.map(x => x ?? "null").join(", ")}]`
                                            : "미입력";

                                        return (
                                            <div key={idx} className="rounded-lg bg-gray-50 p-3 text-[12px] font-400 text-gray-700">
                                                <div className="mb-1 font-600 text-gray-800">{idx + 1}번 문</div>
                                                <div>가로 길이: {door.door_width ? `${door.door_width}mm` : "미입력"}</div>
                                                <div>높이: {item?.door_height ? `${item.door_height}mm` : "미입력"}</div>
                                                <div>경첩 방향: {
                                                    door.hinge_direction === HingeDirection.LEFT ? "좌경첩" :
                                                        door.hinge_direction === HingeDirection.RIGHT ? "우경첩" :
                                                            door.hinge_direction === HingeDirection.UNKNOWN ? "모름" :
                                                                "미입력"
                                                }</div>
                                                <div>보링 개수: {boringLabel}</div>
                                                <div>보링 치수: {boringSizeLabel}</div>
                                                <div className="mt-1 font-600 text-gray-800">
                                                    단가: {doorUnitPrice > 0 ? `${doorUnitPrice.toLocaleString()}원` : "별도 견적"}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {item?.door_construct && (
                    <div className="flex items-center justify-between rounded-[16px] bg-gray-50 px-5 py-4">
                        <span className="text-[16px]/[22px] font-500 text-gray-500">시공비</span>
                        <span className="text-[16px]/[28px] font-600 text-gray-800">+{LONG_DOOR_CONSTRUCT_PRICE.toLocaleString()}원</span>
                    </div>
                )}

                <OrderSummaryCard
                    quantity={quantity}
                    unitPrice={averageUnitPrice}
                    totalPrice={totalPriceWithConstruct}
                    onIncrease={() => {
                        // longdoor는 수량 변경 불가 (이미 설정된 문 개수 사용)
                    }}
                    onDecrease={() => {
                        // longdoor는 수량 변경 불가 (이미 설정된 문 개수 사용)
                    }}
                    showQuantitySelector={false}
                    hideFromText={true}
                />

                {/* 결제 안내 문구 */}
                {/* <PaymentNoticeCard /> */}
            </div>

            <div id="longdoor-add-to-cart-button">
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
                                object_name: "login_from_longdoor_report",
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
                            // 이미지 업로드 처리 (LongDoor에만 저장)
                            let longDoorImageUrls: string[] = [];
                            if (item?.raw_images && item.raw_images.length > 0) {
                                console.log('이미지 업로드 시작:', item.raw_images.length, '개');
                                const uploadUsecase = new SupabaseUploadImageUsecase();
                                longDoorImageUrls = await uploadUsecase.uploadImages(item.raw_images, "longdoors");
                                console.log('이미지 업로드 완료:', longDoorImageUrls);
                            }

                            // LongDoor 객체 생성 및 저장
                            const longDoor = new LongDoor({
                                door_height: item.door_height!,
                                door_location: item.door_location as Location,
                                door_color: getColorId(item.color ?? ""),
                                door_color_direct_input: item.door_color_direct_input ?? undefined,
                                handle_type: item.handleType as CabinetHandleType,
                                // 겉손잡이 선택 시 직접 입력값(장바구니/주문서 공통정보 표시용)
                                handle_type_direct_input: item.handle_type_direct_input ?? undefined,
                                addOn_hinge: item.addOn_hinge ?? false,
                                hinge_thickness: item.hinge_thickness as HingeThickness ?? undefined,
                                door_construct: item.door_construct ?? false,
                                long_door_request: item.door_request ?? undefined,
                                long_door_image_url: longDoorImageUrls.length > 0 ? longDoorImageUrls : undefined,
                            });

                            // LongDoor를 DB에 저장 (toDB() 호출)
                            const longDoorRepository = new InteriorMaterialsSupabaseRepository<LongDoor>("LongDoor");
                            const longDoorData = longDoor.toDB();
                            const { id, created_at, ...longDoorInsertData } = longDoorData;
                            const createdLongDoorResponse = await longDoorRepository.create(longDoorInsertData as any);
                            const createdLongDoor = LongDoor.fromDB(createdLongDoorResponse as any);

                            console.log('LongDoor 생성 완료:', createdLongDoor);

                            // 각 문을 개별 Door 객체로 생성 (long_door_id 연결, 이미지 URL 없음)
                            const createdDoors: Door[] = [];

                            for (let i = 0; i < doors.length; i++) {
                                const doorData = doors[i];
                                const effectiveBoringForDoor = getEffectiveBoring(doorData);

                                // Door 생성자에 필요한 모든 인자를 전달 (문별 effective 보링 사용)
                                // 개별 문에는 이미지 URL을 넣지 않음
                                const door = new Door({
                                    door_type: DoorType.STANDARD,
                                    door_color: getColorId(item.color ?? ""),
                                    door_color_direct_input: item.door_color_direct_input ?? undefined,
                                    door_width: doorData.door_width!,
                                    door_height: item.door_height!,
                                    hinge_direction: doorData.hinge_direction as HingeDirection,
                                    hinge: effectiveBoringForDoor.hinge as number[],
                                    door_location: item.door_location ?? undefined,
                                    door_request: item.door_request ?? undefined,
                                    addOn_hinge: item.addOn_hinge ?? false,
                                    hinge_thickness: item.hinge_thickness ?? undefined,
                                    door_image_url: undefined, // 롱문은 개별 문에 이미지 URL 없음
                                    door_construct: item.door_construct ?? false,
                                    is_pair_door: false, // longdoor는 항상 단문
                                    long_door_id: createdLongDoor.id, // LongDoor와 연결
                                    long_door_order: i + 1, // 문 순서
                                });

                                const createdDoor = await new CrudInteriorMaterialsUsecase(
                                    new InteriorMaterialsSupabaseRepository<Door>("Door")
                                ).create(door);

                                createdDoors.push(createdDoor);
                            }

                            // CartItem은 LongDoor와 연결 (롱문 전체를 하나의 아이템으로)
                            const cartItem = new CartItem({
                                cart_id: cart!.id!,
                                item_detail: createdLongDoor.id!, // LongDoor ID
                                detail_product_type: DetailProductType.LONGDOOR,
                                item_count: 1, // 롱문은 하나의 아이템
                                unit_price: totalPriceWithConstruct, // 총 가격 (시공비 포함)
                            });

                            const createdCartItem = await new CrudCartItemUsecase(
                                new CartItemSupabaseRepository()
                            ).create(cartItem);

                            console.log('CartItem 생성 완료:', createdCartItem);

                            // // Add to Cart 이벤트 전송 (LongDoor 기준)
                            // const cartQuantityTotalBefore = getTotalQuantityFromCartItems(cartItems);
                            // const cartQuantityTypeBefore = cartItems.length;
                            // const cartValueBefore = getTotalValueFromCartItems(cartItems);

                            // // 추가 후 상태 계산 (새 아이템 포함)
                            // const productTypesAfter = getProductTypesFromCartItems(cartItems, detailProductType);
                            // const detailProductTypesAfter = await getDetailProductTypesFromCartItems(cartItems, detailProductType, createdLongDoor);

                            // await trackAddToCart({
                            //     product_type: sortProductTypes(productTypesAfter),
                            //     detail_product_type: sortDetailProductTypes(detailProductTypesAfter),
                            //     quantity: 1, // 롱문은 하나의 아이템
                            //     price_unit: totalPrice, // 총 가격
                            //     cart_quantity_total_before: cartQuantityTotalBefore,
                            //     cart_quantity_type_before: cartQuantityTypeBefore,
                            //     cart_value_before: cartValueBefore,
                            // });

                            // cart_count 증가 불가 (롱문은 하나의 아이템으로 취급)
                            // incrementCartCount 호출하지 않음

                            // item 상태 초기화
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

function LongDoorReportPage() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <LongDoorReportPageContent />
        </Suspense>
    );
}

export default LongDoorReportPage;
