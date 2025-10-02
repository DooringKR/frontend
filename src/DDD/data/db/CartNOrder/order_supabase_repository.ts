import { OrderRepository } from "@/DDD/repository/db/CartNOrder/order_repository";
import { Order } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/Order";
import { DeliveryOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/DeliveryOrder";
import { PickUpOrder } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/PickUpOrder";
import { Response } from "@/DDD/data/response";
import { supabase } from "@/lib/supabase";

export class OrderSupabaseRepository implements OrderRepository {

    /**
     * Order 타입에 따라 적절한 테이블 이름을 반환합니다.
     */
    private getTableName(order: DeliveryOrder | PickUpOrder): string {
        if ((order as DeliveryOrder).delivery_arrival_time !== undefined) {
            return "DeliveryOrder";
        } else if ((order as PickUpOrder).vehicle_type !== undefined) {
            return "PickUpOrder";
        }
        // 기본값 (필요시 에러 처리)
        throw new Error("알 수 없는 Order 타입입니다.");
    }

    async createOrder(order: DeliveryOrder | PickUpOrder): Promise<Response<Order>> {
        try {
            const tableName = this.getTableName(order);
            const { data, error } = await supabase
                .from(tableName)
                .insert(order)
                .select()
                .single();

            if (error) {
                return {
                    success: false,
                    data: undefined as any,
                    message: `주문 생성에 실패했습니다: ${error.message}`
                };
            }

            return {
                success: true,
                data: data,
                message: undefined
            } as Response<Order>;
        } catch (error) {
            return {
                success: false,
                data: undefined as any,
                message: `주문 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async findOrderById(id: string): Promise<Response<Order | null>> {
        try {
            // DeliveryOrder 테이블에서 먼저 검색
            const { data: deliveryData, error: deliveryError } = await supabase
                .from("DeliveryOrder")
                .select('*')
                .eq('id', id)
                .single();

            if (!deliveryError && deliveryData) {
                return {
                    success: true,
                    data: deliveryData,
                    message: undefined
                };
            }

            // PickUpOrder 테이블에서 검색
            const { data: pickupData, error: pickupError } = await supabase
                .from("PickUpOrder")
                .select('*')
                .eq('id', id)
                .single();

            if (!pickupError && pickupData) {
                return {
                    success: true,
                    data: pickupData,
                    message: undefined
                };
            }

            // 둘 다 없으면 null 반환
            if (deliveryError?.code === 'PGRST116' && pickupError?.code === 'PGRST116') {
                return {
                    success: true,
                    data: null,
                    message: undefined
                };
            }

            // 에러 발생 시
            return {
                success: false,
                data: undefined as any,
                message: `주문을 찾을 수 없습니다: ${deliveryError?.message || pickupError?.message}`
            };
        } catch (error) {
            return {
                success: false,
                data: undefined as any,
                message: `주문 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async updateOrder(order: DeliveryOrder | PickUpOrder): Promise<Response<boolean>> {
        try {
            const tableName = this.getTableName(order);
            const orderId = (order as any).getId ? (order as any).getId() : (order as any).id;
            const { error } = await supabase
                .from(tableName)
                .update(order)
                .eq('id', orderId);

            if (error) {
                return {
                    success: false,
                    data: false,
                    message: `주문 업데이트에 실패했습니다: ${error.message}`
                };
            }

            return {
                success: true,
                data: true,
                message: undefined
            };
        } catch (error) {
            return {
                success: false,
                data: false,
                message: `주문 업데이트 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async deleteOrder(id: string): Promise<Response<boolean>> {
        try {
            // DeliveryOrder 테이블에서 먼저 삭제 시도
            const { error: deliveryError } = await supabase
                .from("DeliveryOrder")
                .delete()
                .eq('id', id);

            if (!deliveryError) {
                return {
                    success: true,
                    data: true,
                    message: undefined
                };
            }

            // PickUpOrder 테이블에서 삭제 시도
            const { error: pickupError } = await supabase
                .from("PickUpOrder")
                .delete()
                .eq('id', id);

            if (!pickupError) {
                return {
                    success: true,
                    data: true,
                    message: undefined
                };
            }

            // 둘 다 실패한 경우
            return {
                success: false,
                data: false,
                message: `주문 삭제에 실패했습니다: ${deliveryError?.message || pickupError?.message}`
            };
        } catch (error) {
            return {
                success: false,
                data: false,
                message: `주문 삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async findOrdersByUserId(userId: string): Promise<Response<Order[]>> {
        try {
            // PickUp 주문들 조회
            const { data: pickupData, error: pickupError } = await supabase
                .from('PickUpOrder')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            // Delivery 주문들 조회
            const { data: deliveryData, error: deliveryError } = await supabase
                .from('DeliveryOrder')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            const orders: Order[] = [];

            // PickUp 주문들 변환
            if (!pickupError && pickupData) {
                const pickupOrders = pickupData.map(row => PickUpOrder.fromDB(row));
                orders.push(...pickupOrders);
            }

            // Delivery 주문들 변환
            if (!deliveryError && deliveryData) {
                const deliveryOrders = deliveryData.map(row => DeliveryOrder.fromDB(row));
                orders.push(...deliveryOrders);
            }

            // 생성일시 기준 내림차순 정렬
            orders.sort((a, b) => {
                const dateA = new Date(a.created_at || 0);
                const dateB = new Date(b.created_at || 0);
                return dateB.getTime() - dateA.getTime();
            });

            return {
                success: true,
                data: orders,
                message: "주문 목록을 성공적으로 조회했습니다."
            };
        } catch (error) {
            console.error('[OrderSupabaseRepository] findOrdersByUserId 실패:', error);
            return {
                success: false,
                data: [],
                message: error instanceof Error ? error.message : "주문 목록 조회 중 오류가 발생했습니다."
            };
        }
    }
}
