import { OrderRepository } from "@/DDD/repository/db/CartNOrder/order_repository";
import { OrderItemRepository } from "@/DDD/repository/db/CartNOrder/orderitem_repository";
import { CartItemRepository } from "@/DDD/repository/db/CartNOrder/cartitem_repository";
import { Order } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/Order";
import { OrderItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/OrderItem";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { Response } from "@/DDD/data/response";
import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";

export class CreateOrderUsecase {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly cartItemRepository: CartItemRepository
    ) { }

    /**
     * 주문을 생성하고 관련 OrderItem들을 생성합니다.
     * @param request 주문 생성 요청 데이터
     * @param cartId 장바구니 ID
     * @returns 주문 생성 결과
     */
    async execute(request: DeliveryOrder | PickUpOrder, cartId: number): Promise<Response<Order>> {
        try {
            // 1. 입력 검증
            this.validateRequest(request, cartId);

            // 2. 장바구니 아이템 조회
            const cartItems = await this.cartItemRepository.readByCartId(cartId);
            if (!cartItems || cartItems.length === 0) {
                throw new Error("장바구니가 비어있습니다.");
            }

            // 3. 주문 생성
            const order = await this.createOrder(request);

            // 4. 주문 아이템들 생성
            await this.createOrderItems(order.id!, cartItems);

            return {
                success: true,
                data: order,
                message: "주문이 성공적으로 생성되었습니다."
            };

        } catch (error) {
            console.error('[CreateOrderUsecase] 주문 생성 실패:', error);
            return {
                success: false,
                data: undefined as any,
                message: error instanceof Error ? error.message : "주문 생성 중 알 수 없는 오류가 발생했습니다."
            };
        }
    }

    /**
     * 요청 데이터 유효성 검증
     */
    private validateRequest(request: DeliveryOrder | PickUpOrder, cartId: number): void {
        console.log(request);
        //필요하면 추가
    }

    /**
     * 주문 생성
     */
    private async createOrder(request: DeliveryOrder | PickUpOrder): Promise<Order> {

        const response = await this.orderRepository.createOrder(request as Order);

        if (!response.success) {
            throw new Error(response.message || "주문 생성에 실패했습니다.");
        }

        return response.data! as Order;
    }

    /**
     * 주문 아이템들 생성
     */
    private async createOrderItems(orderId: string, cartItems: CartItem[]): Promise<void> {
        const orderItemPromises = cartItems.map(async (cartItem) => {
            const orderItemData: OrderItem = new OrderItem({
                order_id: orderId,
                unit_price: cartItem.unit_price,
                item_count: cartItem.item_count,
                image_url: 'image_url',
                detail_product_type: cartItem.detail_product_type,
                item_detail: cartItem.item_detail,
            });
            const response = await this.orderItemRepository.createOrderItem(orderItemData as OrderItem);

            if (!response.success) {
                throw new Error(`주문 아이템 생성 실패: ${response.message}`);
            }

            return response.data!;
        });

        await Promise.all(orderItemPromises);
    }

    /**
     * 주문 완료 처리 (추가 비즈니스 로직)
     * 이미지 생성, Notion 페이지 생성 등의 후처리 작업
     */
    async completeOrder(orderId: string): Promise<Response<boolean>> {
        try {
            // TODO: 이미지 생성 서비스 호출
            // TODO: Notion 페이지 생성 서비스 호출
            // TODO: 기타 후처리 작업들

            return {
                success: true,
                data: true,
                message: "주문 완료 처리가 성공적으로 완료되었습니다."
            };
        } catch (error) {
            return {
                success: false,
                data: false,
                message: error instanceof Error ? error.message : "주문 완료 처리 중 오류가 발생했습니다."
            };
        }
    }
}
