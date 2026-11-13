"use client";

import BottomBar from "@/components/overlay/BottomBar";
import { EmptyState, Loading } from "@/components/state/StateViews";
import { Button } from "@/components/ui/button";
import { ActionError, useAction } from "@/components/ui/use-action";
import ShoppingCartCardNew from "@/components/Card/ShoppingCartCardNew";
import ImageCard from "@/components/Card/ImageCard";
import Header from "@/components/Header/Header";
import ProgressBar from "@/components/Progress";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { CABINET_COLOR_LIST, OPEN_CABINET_BODY_MATERIAL_LIST } from "dooring-core-domain/dist/constants/color";
import { ABSORBER_TYPE_LIST } from "@/constants/absorbertype";
import { BODY_MATERIAL_LIST } from "@/constants/bodymaterial";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { CABINET_CATEGORY_LIST } from "@/constants/category";
import useItemStore from "@/store/itemStore";
import useBizClientStore from "@/store/bizClientStore";
import { calculateUnitCabinetPrice } from "@/services/pricing/cabinetPricing";
import { Cabinet, UpperCabinet, LowerCabinet, TallCabinet, OpenCabinet, FlapCabinet, DrawerCabinet } from "dooring-core-domain/dist/models/InteriorMaterials/Cabinet";
import { CabinetLegType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import formatColor from "@/utils/formatColor";
import { transformCabinetToNewCardProps } from "@/utils/transformers/transformCabinetToNewCardProps";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import useCartStore from "@/store/cartStore";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CABINET_DRAWER_TYPE_LIST } from "@/constants/cabinetdrawertype";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { SupabaseUploadImageUsecase } from "@/DDD/usecase/upload_image_usecase";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import { trackClick, trackView, trackAddToCart } from "@/services/analytics/amplitude";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";
import PaymentNoticeCard from "@/components/PaymentNoticeCard";
import useCartItemStore from "@/store/cartItemStore";
import { ProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { sortProductTypes, sortDetailProductTypes } from "@/utils/formatCartProductTypes";
import {
	getProductTypesFromCartItems,
	getDetailProductTypesFromCartItems,
	getTotalQuantityFromCartItems,
	getTotalValueFromCartItems
} from "@/utils/getCartProductTypes";

function createCabinetInstance(item: any, cabinetImageUrls: string[] = []) {

	console.log("Creating cabinet instance for item:", item);
	console.log("cabinetImageUrls received:", cabinetImageUrls);
	// 색상 id 변환 (DB 저장용) + 직접입력 처리
	// 오픈장은 별도의 색상(바디 소재 기반) 리스트를 사용
	const colorSourceList = item.type === "오픈장" ? OPEN_CABINET_BODY_MATERIAL_LIST : CABINET_COLOR_LIST;
	const colorObj = colorSourceList.find(c => c.id === Number(item.color))
		|| colorSourceList.find(c => c.name === item.color);
	const colorId: number | null = colorObj ? colorObj.id : null; // null when direct input or not found
	const cabinet_color_direct_input: string | undefined = (typeof item.cabinet_color_direct_input === 'string' && item.cabinet_color_direct_input.trim() !== '')
		? item.cabinet_color_direct_input
		: undefined;
	const usingDirectColor = !!cabinet_color_direct_input;
	const cabinetColor: number | null = usingDirectColor ? null : colorId;

	// robust body material logic
	// If bodyMaterial is a number, use it. If direct input, set enum and string.
	let cabinet_body_material: number | undefined = undefined;
	let cabinet_body_material_direct_input: string = "";
	// Find the '직접입력' option in BODY_MATERIAL_LIST
	const directInputOption = BODY_MATERIAL_LIST.find(opt => opt.name.includes("직접입력"));
	const isDirectInput = item.bodyMaterial === null && item.body_material_direct_input && item.body_material_direct_input !== "";
	// leg type mapping (enum or direct input)
	let legType = item.legType as string | undefined;
	let legType_direct_input = item.legType_direct_input as string | undefined;
	// If user provided direct input but enum is empty or invalid, coerce enum to DIRECT_INPUT
	const legEnumValues = Object.values(CabinetLegType) as string[];
	const hasDirectLeg = typeof legType_direct_input === "string" && legType_direct_input.trim() !== "";
	const isValidEnum = legType && legEnumValues.includes(String(legType));
	if (hasDirectLeg && !isValidEnum) {
		legType = CabinetLegType.DIRECT_INPUT;
	}
	if (isDirectInput && directInputOption) {
		cabinet_body_material = directInputOption.id;
		cabinet_body_material_direct_input = item.body_material_direct_input;
	} else if (typeof item.bodyMaterial === "number") {
		cabinet_body_material = item.bodyMaterial;
		cabinet_body_material_direct_input = "";
	} else {
		// No selection provided; keep undefined to satisfy FK on nullable column
		cabinet_body_material = undefined;
		cabinet_body_material_direct_input = "";
	}

	switch (item.type) {
		case "상부장":
			return new UpperCabinet({
				cabinet_color: cabinetColor as any,
				cabinet_color_direct_input,
				cabinet_width: item.width,
				cabinet_height: item.height,
				cabinet_depth: item.depth,
				cabinet_location: item.cabinet_location,
				cabinet_behind_type: item.cabinet_behind_type,
				cabinet_body_material: cabinet_body_material,
				cabinet_body_material_direct_input: cabinet_body_material_direct_input,
				cabinet_construct: item.cabinet_construct,
				legType: legType as any,
				legType_direct_input: legType_direct_input,
				cabinet_request: item.request,
				handle_type: item.handleType,
				cabinet_image_url: cabinetImageUrls,
			});
		case "하부장":
			return new LowerCabinet({
				cabinet_color: cabinetColor as any,
				cabinet_color_direct_input,
				cabinet_width: item.width,
				cabinet_height: item.height,
				cabinet_depth: item.depth,
				cabinet_location: item.cabinet_location,
				cabinet_behind_type: item.cabinet_behind_type,
				cabinet_body_material: cabinet_body_material,
				cabinet_body_material_direct_input: cabinet_body_material_direct_input,
				cabinet_construct: item.cabinet_construct,
				legType: legType as any,
				legType_direct_input: legType_direct_input,
				cabinet_request: item.request,
				handle_type: item.handleType,
				cabinet_image_url: cabinetImageUrls,
			});
		case "키큰장":
			return new TallCabinet({
				cabinet_color: cabinetColor as any,
				cabinet_color_direct_input,
				cabinet_width: item.width,
				cabinet_height: item.height,
				cabinet_depth: item.depth,
				cabinet_location: item.cabinet_location,
				cabinet_behind_type: item.cabinet_behind_type,
				cabinet_body_material: cabinet_body_material,
				cabinet_body_material_direct_input: cabinet_body_material_direct_input,
				cabinet_construct: item.cabinet_construct,
				legType: legType as any,
				legType_direct_input: legType_direct_input,
				cabinet_request: item.request,
				handle_type: item.handleType,
				cabinet_image_url: cabinetImageUrls,
			});
		case "오픈장": {
			// robust: map riceRail/lowerDrawer ("추가"/"추가 안 함") to boolean
			const addRiceCookerRail = item.riceRail === "추가";
			const addBottomDrawer = item.lowerDrawer === "추가";
			return new OpenCabinet({
				cabinet_color: cabinetColor as any,
				cabinet_color_direct_input,
				cabinet_width: item.width,
				cabinet_height: item.height,
				cabinet_depth: item.depth,
				cabinet_location: item.cabinet_location,
				cabinet_behind_type: item.cabinet_behind_type,
				cabinet_body_material: cabinet_body_material,
				cabinet_body_material_direct_input: cabinet_body_material_direct_input,
				cabinet_construct: item.cabinet_construct,
				legType: legType as any,
				legType_direct_input: legType_direct_input,
				cabinet_request: item.request,
				add_rice_cooker_rail: addRiceCookerRail,
				add_bottom_drawer: addBottomDrawer,
				cabinet_image_url: cabinetImageUrls,
			});
		}
		case "플랩장":
			// robust: absorber_type must not be null
			let absorber_type = item.absorber_type;
			let absorber_type_direct_input = item.absorber_type_direct_input;
			if (absorber_type == null && absorber_type_direct_input) {
				const directInputOption = ABSORBER_TYPE_LIST.find(opt => opt.name === "직접입력");
				absorber_type = directInputOption ? directInputOption.id : 0;
			}
			return new FlapCabinet({
				cabinet_color: cabinetColor as any,
				cabinet_color_direct_input,
				cabinet_width: item.width,
				cabinet_height: item.height,
				cabinet_depth: item.depth,
				cabinet_location: item.cabinet_location,
				cabinet_behind_type: item.cabinet_behind_type,
				cabinet_body_material: cabinet_body_material,
				cabinet_body_material_direct_input: cabinet_body_material_direct_input,
				cabinet_construct: item.cabinet_construct,
				legType: legType as any,
				legType_direct_input: legType_direct_input,
				cabinet_request: item.request,
				handle_type: item.handleType,
				absorber_type,
				absorber_type_direct_input,
				cabinet_image_url: cabinetImageUrls,
			});
		case "서랍장": {
			let drawer_type: number;
			let drawer_type_direct_input: string | undefined = undefined;

			console.log("🔍 Drawer type debugging:", {
				drawer_type: item.drawer_type,
				drawer_type_direct_input: item.drawer_type_direct_input
			});

			// drawer_type이 이미 number인 경우 처리
			if (typeof item.drawer_type === "number") {
				drawer_type = item.drawer_type;
				if (drawer_type === 4 && item.drawer_type_direct_input) {
					drawer_type_direct_input = item.drawer_type_direct_input;
					console.log("✅ Using direct input with number id:", { drawer_type, drawer_type_direct_input });
				} else {
					console.log("✅ Using predefined option with number id:", { drawer_type });
				}
			} else {
				// 기존 string 기반 로직 (하위 호환성)
				drawer_type = CABINET_DRAWER_TYPE_LIST[0].id;
				console.log("⚠️ No valid drawer_type, using default:", { drawer_type });
			}
			// robust: rail_type must not be empty string for enum
			let rail_type = item.rail_type;
			if ((!rail_type || rail_type === "") && item.rail_type_direct_input) {
				rail_type = "직접 입력";
			}
			return new DrawerCabinet({
				cabinet_color: cabinetColor as any,
				cabinet_color_direct_input,
				cabinet_width: item.width,
				cabinet_height: item.height,
				cabinet_depth: item.depth,
				cabinet_location: item.cabinet_location,
				cabinet_behind_type: item.cabinet_behind_type,
				cabinet_body_material: cabinet_body_material,
				cabinet_body_material_direct_input: cabinet_body_material_direct_input,
				cabinet_construct: item.cabinet_construct,
				legType: legType as any,
				legType_direct_input: legType_direct_input,
				cabinet_request: item.request,
				handle_type: item.handleType,
				drawer_type,
				drawer_type_direct_input,
				rail_type,
				rail_type_direct_input: item.rail_type_direct_input,
				cabinet_image_url: cabinetImageUrls,
			});
		}
		default:
			throw new Error("Unknown cabinet category");
	}
}

function ReportPageContent() {
	const router = useRouter();
	const { item } = useItemStore();
	const bizClient = useBizClientStore(state => state.bizClient);
	const { cart, incrementCartCount } = useCartStore();
	const cartItems = useCartItemStore((state) => state.cartItems);
	const [quantity, setQuantity] = useState(1);
	// 담기 — 연타 막기·도는 표시·실패는 버튼 바로 위. 성공하면 장바구니로 넘어가는 동안 계속 막아 둔다
	const add = useAction({ holdOnSuccess: true });

	// 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
	useEffect(() => {
		// 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
		setScreenName('cabinet_report');
		const prev = getPreviousScreenName();
		trackView({
			object_type: "screen",
			object_name: null,
			current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
			previous_screen: prev,
		});
	}, []);

	// cabinet_behind_type 동기화 (렌더링 중 setState 방지)
	useEffect(() => {
		if (!item) return;
		const cabinetBehindType = item.behindType || "우라홈";
		if (item.cabinet_behind_type !== cabinetBehindType) {
			useItemStore.getState().updateItem({ cabinet_behind_type: cabinetBehindType });
		}
	}, [item?.behindType, item?.cabinet_behind_type]);

	// 담을 부분장이 없다(새 탭·흐름 밖 진입). 담기 성공 직후엔 item 을 비우고 넘어가는 중이라 Loading
	if (!item || Object.keys(item).length === 0) {
		return (
			<div className="flex flex-col pt-[90px]">
				<TopNavigator />
				{add.busy ? (
					<Loading />
				) : (
					<EmptyState text="담을 부분장이 없어요" action={{ label: "부분장 고르기", onClick: () => router.replace("/cabinet") }} />
				)}
			</div>
		);
	}

	// 색상 id/name 변환
	const colorObj = CABINET_COLOR_LIST.find(c => c.id === Number(item.color))
		|| CABINET_COLOR_LIST.find(c => c.name === item.color);
	const colorId = colorObj ? String(colorObj.id) : "";
	// 직접입력 색상 여부
	const usingDirectColor = typeof item.cabinet_color_direct_input === 'string' && item.cabinet_color_direct_input.trim() !== '';
	// 표시용 색상 이름: 직접입력 우선, 없으면 리스트 이름, 그 외엔 원본 문자열
	const colorName = (typeof item.cabinet_color_direct_input === 'string' && item.cabinet_color_direct_input.trim() !== '')
		? item.cabinet_color_direct_input
		: (colorObj ? colorObj.name : (item.color ?? ""));

	// 몸통 소재 id/name 변환
	const bodyMaterialObj = typeof item.bodyMaterial === "number"
		? BODY_MATERIAL_LIST.find(b => b.id === item.bodyMaterial)
		: undefined;
	const bodyMaterialName = bodyMaterialObj ? bodyMaterialObj.name : (item.body_material_direct_input ? "(직접입력) " + item.body_material_direct_input : "");

	const unitPrice = calculateUnitCabinetPrice(
		item.type,
		usingDirectColor ? "" : String(colorName ?? ""),
		item.width ?? 0,
		typeof item.bodyMaterial === "number" ? item.bodyMaterial : 0,
		item.handleType ?? "",
		item.depth ?? 0,
	);

	// 오픈장: 밥솥 레일/하부장 robust 표시
	const addRiceCookerRail = item.riceRail === "추가";
	const addBottomDrawer = item.lowerDrawer === "추가";

	return (
		<div className="flex flex-col pt-[90px]">
			<InitAmplitude />
			<TopNavigator />
			<ProgressBar progress={100} />
			<Header size="Large" title={`${item?.type ?? ""} 주문 개수를 선택해주세요`} />
			<div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">

				<ShoppingCartCardNew
					{...transformCabinetToNewCardProps(item)}
				/>

				{/* 업로드된 이미지 표시 */}
				<ImageCard images={item?.raw_images || []} />

				<OrderSummaryCard
					quantity={quantity}
					unitPrice={unitPrice}
					onIncrease={() => setQuantity(q => q + 1)}
					onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
				/>
				<PaymentNoticeCard />
			</div>
			<BottomBar id="cabinet-add-to-cart-button" top={<ActionError error={add.error} className="mb-3" />}>
					<Button
						busy={add.busy}
						onClick={() => {
							if (!bizClient) {
								trackClick({
									object_type: "button",
									object_name: "login_from_cabinet_report",
									current_page: getScreenName(),
									modal_name: null,
								});
								router.push("/start");
								return;
							}
							add.run(async () => {
								trackClick({
									object_type: "button",
									object_name: "add_to_cart",
									current_page: getScreenName(),
									modal_name: null,
								});
								try {
									// 이미지 업로드 처리
									let cabinetImageUrls: string[] = [];
									if (item?.raw_images && item.raw_images.length > 0) {
										const uploadUsecase = new SupabaseUploadImageUsecase();
										cabinetImageUrls = await uploadUsecase.uploadImages(item.raw_images, "cabinets");
									}

									// 부분장 객체 생성
									const cabinet = createCabinetInstance(item, cabinetImageUrls);
									if (!cabinet) {
										throw new Error("Cabinet instance could not be created.");
									}

									// Supabase에 저장 – 주의: constructor.name은 프로덕션 번들에서 '_' 등으로 난독화될 수 있으므로 명시적으로 테이블 이름을 매핑한다.
									const tableName = (() => {
										switch (item.type) {
											case "상부장":
												return "UpperCabinet";
											case "하부장":
												return "LowerCabinet";
											case "키큰장":
												return "TallCabinet";
											case "오픈장":
												return "OpenCabinet";
											case "플랩장":
												return "FlapCabinet";
											case "서랍장":
												return "DrawerCabinet";
											default:
												throw new Error("Unknown cabinet type for table mapping");
										}
									})();

									const createdCabinet = await new CrudInteriorMaterialsUsecase(
										new InteriorMaterialsSupabaseRepository<typeof cabinet>(tableName)
									).create(cabinet);


									// 이미지 URL이 있다면 Cabinet 객체에 직접 추가
									if (cabinetImageUrls.length > 0) {
										(createdCabinet as any).cabinet_image_url = cabinetImageUrls;
									}

									// cart, cartItems, setCartItems는 useCartStore에서 가져옴
									if (!cart) throw new Error("장바구니 정보가 없습니다.");


									// CartItem 생성: detail_product_type을 각 타입별로 할당
									let detailProductType;
									switch (item.type) {
										case "상부장":
											detailProductType = DetailProductType.UPPERCABINET;
											break;
										case "하부장":
											detailProductType = DetailProductType.LOWERCABINET;
											break;
										case "키큰장":
											detailProductType = DetailProductType.TALLCABINET;
											break;
										case "플랩장":
											detailProductType = DetailProductType.FLAPCABINET;
											break;
										case "서랍장":
											detailProductType = DetailProductType.DRAWERCABINET;
											break;
										case "오픈장":
											detailProductType = DetailProductType.OPENCABINET;
											break;
										default:
											throw new Error("Unknown cabinet type for cart item");
									}
									if (!createdCabinet || !createdCabinet["id"]) {
										throw new Error("Cabinet creation failed or missing ID.");
									}

									const maxNickName = cartItems.reduce((max, item) => {
										const num = parseInt(item.nick_name || "0");
										return num > max ? num : max;
									}, 0);
									const cartItem = new CartItem({
										cart_id: cart!.id!,
										item_detail: createdCabinet.id,
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
									const detailProductTypesAfter = await getDetailProductTypesFromCartItems(cartItems, detailProductType, item);

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
									).incrementCartCount(cart.id!, quantity);

									incrementCartCount(1);
									useItemStore.setState({ item: undefined });
									toast.success("장바구니에 담았어요");
									router.replace("/cart");
								} catch (error) {
									console.error("장바구니 담기 실패:", error);
									throw new Error("장바구니에 담지 못했어요. 잠시 후 다시 눌러 주세요.");
								}
							});
						}}
					>
						{bizClient ? "장바구니 담기" : "로그인하고 장바구니 담기"}
					</Button>
				</BottomBar>
		</div>
	);
}

export default ReportPageContent;
