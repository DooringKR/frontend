"use client";

import BottomButton from "@/components/BottomButton/BottomButton";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header from "@/components/Header/Header";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import TopNavigator from "@/components/TopNavigator/TopNavigator";

import { CABINET_COLOR_LIST } from "@/constants/colorList";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { CABINET_CATEGORY_LIST } from "@/constants/category";
import useItemStore from "@/store/Items/itemStore";
import { calculateUnitCabinetPrice } from "@/services/pricing/cabinetPricing";
import { Cabinet, UpperCabinet, LowerCabinet, OpenCabinet, FlapCabinet, DrawerCabinet } from "dooring-core-domain/dist/models/InteriorMaterials/Cabinet";
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



function createCabinetInstance(item: any) {
  switch (item.category) {
    case "upper":
      return new UpperCabinet({
        cabinet_color: item.color,
        cabinet_width: item.width,
        cabinet_height: item.height,
        cabinet_depth: item.depth,
        cabinet_location: item.cabinet_location,
        cabinet_behind_type: item.cabinet_behind_type,
        cabinet_body_material: item.bodyMaterial,
        cabinet_body_material_direct_input: item.body_material_direct_input,
        cabinet_request: item.request,
        handle_type: item.handleType,
      });
    case "lower":
      return new LowerCabinet({
        cabinet_color: item.color,
        cabinet_width: item.width,
        cabinet_height: item.height,
        cabinet_depth: item.depth,
        cabinet_location: item.cabinet_location,
        cabinet_behind_type: item.cabinet_behind_type,
        cabinet_body_material: item.bodyMaterial,
        cabinet_body_material_direct_input: item.body_material_direct_input,
        cabinet_request: item.request,
        handle_type: item.handleType,
      });
    case "open":
      return new OpenCabinet({
        cabinet_color: item.color,
        cabinet_width: item.width,
        cabinet_height: item.height,
        cabinet_depth: item.depth,
        cabinet_location: item.cabinet_location,
        cabinet_behind_type: item.cabinet_behind_type,
        cabinet_body_material: item.bodyMaterial,
        cabinet_body_material_direct_input: item.body_material_direct_input,
        cabinet_request: item.request,
        add_rice_cooker_rail: item.add_rice_cooker_rail,
        add_bottom_drawer: item.add_bottom_drawer,
      });
    case "flap":
      return new FlapCabinet({
        cabinet_color: item.color,
        cabinet_width: item.width,
        cabinet_height: item.height,
        cabinet_depth: item.depth,
        cabinet_location: item.cabinet_location,
        cabinet_behind_type: item.cabinet_behind_type,
        cabinet_body_material: item.bodyMaterial,
        cabinet_body_material_direct_input: item.body_material_direct_input,
        cabinet_request: item.request,
        handle_type: item.handleType,
        absorber_type: item.absorber_type,
        absorber_type_direct_input: item.absorber_type_direct_input,
      });
    case "drawer":
      return new DrawerCabinet({
        cabinet_color: item.color,
        cabinet_width: item.width,
        cabinet_height: item.height,
        cabinet_depth: item.depth,
        cabinet_location: item.cabinet_location,
        cabinet_behind_type: item.cabinet_behind_type,
        cabinet_body_material: item.bodyMaterial,
        cabinet_body_material_direct_input: item.body_material_direct_input,
        cabinet_request: item.request,
        handle_type: item.handleType,
        drawer_type: item.drawer_type,
        rail_type: item.rail_type,
        rail_type_direct_input: item.rail_type_direct_input,
      });
    default:
      throw new Error("Unknown cabinet category");
  }
}

function ReportPageContent() {
		const router = useRouter();
		const { item } = useItemStore();
		const { cart, incrementCartCount } = useCartStore();
		const [quantity, setQuantity] = useState(1);

		if (!item || Object.keys(item).length === 0) {
			return <div>로딩 중...</div>;
		}

		// 주요 필드 콘솔 출력
		console.log(
			'item.type:', item.type,
			'item.color:', item.color ?? "",
			'item.width:', item.width ?? 0,
			'item.bodyMaterial:', item.bodyMaterial ?? "",
			'item.handleType:', item.handleType ?? "",
			'item.depth:', item.depth ?? 0
		);

		const unitPrice = calculateUnitCabinetPrice(
			item.type,
			item.color ?? "",
			item.width ?? 0,
			item.bodyMaterial ?? "",
			item.handleType ?? "",
			item.depth ?? 0,
		);

	return (
		<div className="flex flex-col">
			<TopNavigator />
			<Header size="Large" title={`부분장 주문 개수를 선택해주세요`} />
			<div className="flex flex-col gap-[20px] px-5 pb-[100px] pt-5">
				<ShoppingCartCard
					type="cabinet"
					title={item?.category ?? ""}
					color={formatColor(item?.color ?? "") || item?.cabinet_color_direct_input || ""}
					depth={item?.depth ? Number(item.depth) : undefined}
					height={item?.height ? Number(item.height) : undefined}
					width={item?.width ? Number(item.width) : undefined}
					bodyMaterial={item?.bodyMaterial ?? undefined}
					handleType={item?.handleType ?? undefined}
					finishType={item?.finishType ?? undefined}
					location={item.cabinet_location ?? undefined}
					quantity={0}
					trashable={false}
					showQuantitySelector={false}
					request={item.request ?? undefined}
					onOptionClick={() => {
						router.push(`/cabinet/${item.category}`);
					}}
				/>
				<OrderSummaryCard
					quantity={quantity}
					unitPrice={unitPrice}
					onIncrease={() => setQuantity(q => q + 1)}
					onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
				/>
			</div>
			<div id="cabinet-add-to-cart-button">
				<BottomButton
					type={"1button"}
					button1Text={"장바구니 담기"}
					className="fixed bottom-0 w-full max-w-[460px]"
					onButton1Click={async () => {
						try {
							// 부분장 객체 생성
							const cabinet = createCabinetInstance(item);
							if (!cabinet) {
								throw new Error("Cabinet instance could not be created.");
							}

							// Supabase에 저장
							const createdCabinet = await new CrudInteriorMaterialsUsecase(
								new InteriorMaterialsSupabaseRepository<typeof cabinet>(cabinet.constructor.name)
							).create(cabinet);

							// cart, cartItems, setCartItems는 useCartStore에서 가져옴
							if (!cart) throw new Error("장바구니 정보가 없습니다.");


																// CartItem 생성: detail_product_type을 각 타입별로 할당
																let detailProductType;
																switch (item.type) {
																	case "upper":
																		detailProductType = DetailProductType.UPPERCABINET;
																		break;
																	case "lower":
																		detailProductType = DetailProductType.LOWERCABINET;
																		break;
																	case "flap":
																		detailProductType = DetailProductType.FLAPCABINET;
																		break;
																	case "drawer":
																		detailProductType = DetailProductType.DRAWERCABINET;
																		break;
																	case "open":
																		detailProductType = DetailProductType.OPENCABINET;
																		break;
																	default:
																		throw new Error("Unknown cabinet type for cart item");
																}
																if (!createdCabinet || !createdCabinet["id"]) {
																	throw new Error("Cabinet creation failed or missing ID.");
																}
																const cartItem = new CartItem({
																	cart_id: cart!.id!,
																	item_detail: createdCabinet["id"],
																	detail_product_type: detailProductType,
																	item_count: quantity,
																	unit_price: unitPrice,
																});
																await new CrudCartItemUsecase(
																	new CartItemSupabaseRepository()
																).create(cartItem);

							// cart_count 증가
							await new CrudCartUsecase(
								new CartSupabaseRepository()
							).incrementCartCount(cart.id!, quantity);

							incrementCartCount(1);
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
