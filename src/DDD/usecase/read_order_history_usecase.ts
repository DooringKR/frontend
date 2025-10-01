import { OrderRepository } from "@/DDD/repository/db/CartNOrder/order_repository";
import { OrderItemRepository } from "@/DDD/repository/db/CartNOrder/orderitem_repository";
import { Order } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/Order";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
import { OrderItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/OrderItem";
import { Response } from "@/DDD/data/response";

export interface OrderWithItems {
    order: Order;
    orderItems: OrderItem[];
}

export class ReadOrderHistoryUsecase {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderItemRepository: OrderItemRepository
    ) {}

    /**
     * 사용자의 주문 내역을 조회합니다 (PICKUP 주문만)
     * @param userId 사용자 ID
     * @returns 주문 내역 목록
     */
    async execute(userId: string): Promise<Response<OrderWithItems[]>> {
        try {
            // 1. 사용자의 모든 주문 조회
            const ordersResponse = await this.orderRepository.findOrdersByUserId(userId);
            
            if (!ordersResponse.success) {
                return {
                    success: false,
                    data: [],
                    message: ordersResponse.message || "주문 내역 조회에 실패했습니다."
                };
            }

            const allOrders = ordersResponse.data || [];
            
            // 2. PICKUP 주문만 필터링 (PickUpOrder 인스턴스인지 확인)
            const pickupOrders = allOrders.filter((order: Order) => order instanceof PickUpOrder);

            // 3. 각 주문의 OrderItem들 조회
            const ordersWithItems: OrderWithItems[] = await Promise.all(
                pickupOrders.map(async (order: Order) => {
                    const orderItemsResponse = await this.orderItemRepository.findOrderItemsByOrderId(order.id!);
                    
                    return {
                        order,
                        orderItems: orderItemsResponse.success ? orderItemsResponse.data || [] : []
                    };
                })
            );

            // 4. 생성일시 기준 내림차순 정렬
            ordersWithItems.sort((a, b) => {
                const dateA = new Date(a.order.created_at || 0);
                const dateB = new Date(b.order.created_at || 0);
                return dateB.getTime() - dateA.getTime();
            });

            return {
                success: true,
                data: ordersWithItems,
                message: "주문 내역을 성공적으로 조회했습니다."
            };

        } catch (error) {
            console.error('[ReadOrderHistoryUsecase] 주문 내역 조회 실패:', error);
            return {
                success: false,
                data: [],
                message: error instanceof Error ? error.message : "주문 내역 조회 중 알 수 없는 오류가 발생했습니다."
            };
        }
    }

    /**
     * 특정 주문의 상세 정보를 조회합니다
     * @param orderId 주문 ID
     * @returns 주문 상세 정보
     */
    async getOrderDetail(orderId: string): Promise<Response<OrderWithItems>> {
        try {
            // 1. 주문 조회
            const orderResponse = await this.orderRepository.findOrderById(orderId);
            
            if (!orderResponse.success || !orderResponse.data) {
                return {
                    success: false,
                    data: undefined as any,
                    message: "주문을 찾을 수 없습니다."
                };
            }

            // 2. 주문 아이템들 조회
            const orderItemsResponse = await this.orderItemRepository.findOrderItemsByOrderId(orderId);

            return {
                success: true,
                data: {
                    order: orderResponse.data,
                    orderItems: orderItemsResponse.success ? orderItemsResponse.data || [] : []
                },
                message: "주문 상세 정보를 성공적으로 조회했습니다."
            };

        } catch (error) {
            console.error('[ReadOrderHistoryUsecase] 주문 상세 조회 실패:', error);
            return {
                success: false,
                data: undefined as any,
                message: error instanceof Error ? error.message : "주문 상세 조회 중 알 수 없는 오류가 발생했습니다."
            };
        }
    }
}