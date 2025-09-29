import { OrderRepository } from "@/DDD/repository/db/CartNOrder/order_repository";
import { OrderItemRepository } from "@/DDD/repository/db/CartNOrder/orderitem_repository";
import { CartItemRepository } from "@/DDD/repository/db/CartNOrder/cartitem_repository";
import { Order } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/Order";
import { OrderItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/OrderItem";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { Response } from "@/DDD/data/response";

// 주문 생성 요청 DTO
export interface CreateOrderRequest {
    user_id: number;
    cart_id: number;
    order_type: "DELIVERY" | "PICK_UP";
    recipient_phone: string;
    order_price: number;
    order_options?: Record<string, any>;
}

// 주문 생성 응답 DTO
export interface CreateOrderResponse {
    order_id: string;
    success: boolean;
    message?: string;
}

export class CreateOrderUsecase {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly cartItemRepository: CartItemRepository
    ) {}

    /**
     * 주문을 생성하고 관련 OrderItem들을 생성합니다.
     * @param request 주문 생성 요청 데이터
     * @returns 주문 생성 결과
     */
    async execute(request: CreateOrderRequest): Promise<CreateOrderResponse> {
        try {
            // 1. 입력 검증
            this.validateRequest(request);

            // 2. 장바구니 아이템 조회
            const cartItems = await this.cartItemRepository.readByCartId(request.cart_id);
            if (!cartItems || cartItems.length === 0) {
                throw new Error("장바구니가 비어있습니다.");
            }

            // 3. 주문 생성
            const order = await this.createOrder(request);
            
            // 4. 주문 아이템들 생성
            await this.createOrderItems(order.order_id, cartItems);

            return {
                order_id: order.order_id,
                success: true,
                message: "주문이 성공적으로 생성되었습니다."
            };

        } catch (error) {
            console.error('[CreateOrderUsecase] 주문 생성 실패:', error);
            return {
                order_id: "",
                success: false,
                message: error instanceof Error ? error.message : "주문 생성 중 알 수 없는 오류가 발생했습니다."
            };
        }
    }

    /**
     * 요청 데이터 유효성 검증
     */
    private validateRequest(request: CreateOrderRequest): void {
        if (!request.user_id || request.user_id <= 0) {
            throw new Error("유효한 사용자 ID가 필요합니다.");
        }

        if (!request.cart_id || request.cart_id <= 0) {
            throw new Error("유효한 장바구니 ID가 필요합니다.");
        }

        if (!request.order_type || !["DELIVERY", "PICK_UP"].includes(request.order_type)) {
            throw new Error("유효한 주문 타입이 필요합니다. (DELIVERY 또는 PICK_UP)");
        }

        if (!request.recipient_phone || request.recipient_phone.trim() === "") {
            throw new Error("수령인 전화번호가 필요합니다.");
        }

        if (!request.order_price || request.order_price <= 0) {
            throw new Error("유효한 주문 금액이 필요합니다.");
        }

        // 전화번호 형식 검증 (숫자만 11자리)
        const phoneRegex = /^[0-9]{11}$/;
        if (!phoneRegex.test(request.recipient_phone.replace(/[^0-9]/g, ""))) {
            throw new Error("올바른 전화번호 형식이 아닙니다. (11자리 숫자)");
        }
    }

    /**
     * 주문 생성
     */
    private async createOrder(request: CreateOrderRequest): Promise<Order> {
        const orderData: Partial<Order> = {
            user_id: request.user_id,
            cart_id: request.cart_id,
            order_type: request.order_type,
            recipient_phone: request.recipient_phone.replace(/[^0-9]/g, ""),
            order_price: request.order_price,
            order_options: request.order_options || {},
            created_at: new Date()
        };

        const response = await this.orderRepository.createOrder(orderData as Order);
        
        if (!response.success) {
            throw new Error(response.message || "주문 생성에 실패했습니다.");
        }

        return response.data!;
    }

    /**
     * 주문 아이템들 생성
     */
    private async createOrderItems(orderId: string, cartItems: CartItem[]): Promise<void> {
        const orderItemPromises = cartItems.map(async (cartItem) => {
            const orderItemData: Partial<OrderItem> = {
                order_id: orderId,
                product_type: cartItem.product_type,
                unit_price: cartItem.unit_price || 0,
                item_count: cartItem.item_count,
                item_options: cartItem.item_options
            };

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
