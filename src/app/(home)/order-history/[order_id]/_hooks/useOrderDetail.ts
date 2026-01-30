import { useState, useEffect } from "react";
import { ReadOrderHistoryUsecase, OrderWithItems } from "@/DDD/usecase/read_order_history_usecase";
import { OrderSupabaseRepository } from "@/DDD/data/db/CartNOrder/order_supabase_repository";
import { OrderItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/orderitem_supabase_repository";
import { InteriorMaterialsSupabaseRepository } from "@/DDD/data/db/interior_materials_supabase_repository";
import { CrudInteriorMaterialsUsecase } from "@/DDD/usecase/crud_interior_materials_usecase";
import { Door } from "dooring-core-domain/dist/models/InteriorMaterials/Door";
import { Finish } from "dooring-core-domain/dist/models/InteriorMaterials/Finish";
import { Cabinet } from "dooring-core-domain/dist/models/InteriorMaterials/Cabinet";
import { Accessory } from "dooring-core-domain/dist/models/InteriorMaterials/Accessory";
import { Hinge } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Hinge";
import { Rail } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Rail";
import { Piece } from "dooring-core-domain/dist/models/InteriorMaterials/Hardware/Piece";
import { LongDoor } from "dooring-core-domain/dist/models/CompositeProducts/LongDoor";
import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { OrderItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/OrderItem";
import { supabase } from "@/lib/supabase";

// 자재 정보를 포함한 OrderItem 타입
type OrderItemWithMaterial = OrderItem & {
    materialDetails: any;
    relatedDoors?: Door[]; // 롱문의 경우 관련 Door 배열
};

// 자재 정보를 포함한 Order 타입
type OrderWithItemsAndMaterials = {
    order: any;
    orderItems: OrderItemWithMaterial[];
};

export const useOrderDetail = (orderId: string | null) => {
    const [orderWithItems, setOrderWithItems] = useState<OrderWithItemsAndMaterials | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            // orderId가 null이면 아무것도 하지 않음
            if (!orderId) {
                setLoading(false);
                return;
            }

            try {
                // 1. 기본 주문 정보 조회
                const usecase = new ReadOrderHistoryUsecase(
                    new OrderSupabaseRepository(),
                    new OrderItemSupabaseRepository(),
                );

                const response = await usecase.getOrderDetail(orderId);

                if (!response.success) {
                    throw new Error(response.message || "주문 정보를 불러오는데 실패했습니다.");
                }

                const orderData = response.data;

                // 2. 각 OrderItem의 자재 정보 조회 (CartClient.tsx 방식 참고)
                const orderItemsWithMaterials: OrderItemWithMaterial[] = await Promise.all(
                    orderData!.orderItems.map(async (orderItem: OrderItem) => {
                        let materialDetails: any = {};

                        try {
                            // item_detail이 자재 ID(String)이므로 직접 사용
                            const materialId = orderItem.item_detail;

                            // detail_product_type에 따라 해당 자재 조회
                            switch (orderItem.detail_product_type) {
                                case DetailProductType.DOOR:
                                    if (materialId) {
                                        const doorDetail = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<Door>("Door")
                                        ).findById(materialId);
                                        if (doorDetail) materialDetails = doorDetail;
                                    }
                                    break;

                                case DetailProductType.FINISH:
                                    if (materialId) {
                                        const finishDetail = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<Finish>("Finish")
                                        ).findById(materialId);
                                        if (finishDetail) materialDetails = finishDetail;
                                    }
                                    break;

                                case DetailProductType.UPPERCABINET:
                                    if (materialId) {
                                        const cabinetDetail = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<Cabinet>("UpperCabinet")
                                        ).findById(materialId);
                                        if (cabinetDetail) materialDetails = cabinetDetail;
                                    }
                                    break;

                                case DetailProductType.LOWERCABINET:
                                    if (materialId) {
                                        const cabinetDetail = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<Cabinet>("LowerCabinet")
                                        ).findById(materialId);
                                        if (cabinetDetail) materialDetails = cabinetDetail;
                                    }
                                    break;
                                case DetailProductType.TALLCABINET:
                                    if (materialId) {
                                        const cabinetDetail = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<Cabinet>("TallCabinet")
                                        ).findById(materialId);
                                        if (cabinetDetail) materialDetails = cabinetDetail;
                                    }
                                    break;
                                case DetailProductType.FLAPCABINET:
                                    if (materialId) {
                                        const cabinetDetail = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<Cabinet>("FlapCabinet")
                                        ).findById(materialId);
                                        if (cabinetDetail) materialDetails = cabinetDetail;
                                    }
                                    break;

                                case DetailProductType.DRAWERCABINET:
                                    if (materialId) {
                                        const cabinetDetail = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<Cabinet>("DrawerCabinet")
                                        ).findById(materialId);
                                        if (cabinetDetail) materialDetails = cabinetDetail;
                                    }
                                    break;

                                case DetailProductType.OPENCABINET:
                                    if (materialId) {
                                        const cabinetDetail = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<Cabinet>("OpenCabinet")
                                        ).findById(materialId);
                                        if (cabinetDetail) materialDetails = cabinetDetail;
                                    }
                                    break;

                                case DetailProductType.ACCESSORY:
                                    if (materialId) {
                                        const accessoryDetail = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<Accessory>("Accessory")
                                        ).findById(materialId);
                                        if (accessoryDetail) materialDetails = accessoryDetail;
                                    }
                                    break;

                                case DetailProductType.HINGE:
                                    if (materialId) {
                                        const hingeDetail = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<Hinge>("Hinge")
                                        ).findById(materialId);
                                        if (hingeDetail) materialDetails = hingeDetail;
                                    }
                                    break;

                                case DetailProductType.RAIL:
                                    if (materialId) {
                                        const railDetail = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<Rail>("Rail")
                                        ).findById(materialId);
                                        if (railDetail) materialDetails = railDetail;
                                    }
                                    break;

                                case DetailProductType.PIECE:
                                    if (materialId) {
                                        const pieceDetail = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<Piece>("Piece")
                                        ).findById(materialId);
                                        if (pieceDetail) materialDetails = pieceDetail;
                                    }
                                    break;

                                case DetailProductType.LONGDOOR:
                                    if (materialId) {
                                        const longDoorData = await new CrudInteriorMaterialsUsecase(
                                            new InteriorMaterialsSupabaseRepository<LongDoor>("LongDoor")
                                        ).findById(materialId);
                                        // DB에서 가져온 raw 데이터를 LongDoor 객체로 변환
                                        const longDoor = longDoorData ? LongDoor.fromDB(longDoorData as any) : null;
                                        if (longDoor) {
                                            materialDetails = longDoor;

                                            // 롱문에 연결된 Door들 조회
                                            let relatedDoors: Door[] = [];
                                            if (longDoor.id) {
                                                try {
                                                    const { data: doorsData, error: doorsError } = await supabase
                                                        .from("Door")
                                                        .select("*")
                                                        .eq("long_door_id", longDoor.id)
                                                        .order("long_door_order", { ascending: true });

                                                    if (!doorsError && doorsData) {
                                                        relatedDoors = doorsData.map((doorData: any) => Door.fromDB(doorData));
                                                    }
                                                } catch (e) {
                                                    console.error("Failed to fetch related doors for LongDoor:", e);
                                                }
                                            }

                                            return {
                                                ...orderItem,
                                                materialDetails,
                                                relatedDoors
                                            } as OrderItemWithMaterial;
                                        }
                                    }
                                    break;

                                default:
                                    console.warn(`알 수 없는 제품 타입: ${orderItem.detail_product_type}`);
                                    break;
                            }
                        } catch (e) {
                            console.error("자재 정보 조회 실패:", e);
                            materialDetails = {};
                        }

                        return {
                            ...orderItem,
                            materialDetails
                        } as OrderItemWithMaterial;
                    })
                );

                // 3. 자재 정보가 포함된 최종 데이터 설정
                const finalData: OrderWithItemsAndMaterials = {
                    order: orderData!.order,
                    orderItems: orderItemsWithMaterials
                };

                // console.log("✅ 자재 정보 포함 주문 상세 데이터:", finalData);
                setOrderWithItems(finalData);
                setError(null);

            } catch (err) {
                console.error("💥 주문 상세 조회 에러:", err);
                setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
                setOrderWithItems(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId]); // orderId가 변경될 때마다 실행

    return { orderWithItems, loading, error };
};
