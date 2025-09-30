import { OrderItemRepository } from "@/DDD/repository/db/CartNOrder/orderitem_repository";
import { OrderItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Order/OrderItem";
import { Response } from "@/DDD/data/response";
import { supabase } from "@/lib/supabase";

export class OrderItemSupabaseRepository implements OrderItemRepository {
    private readonly tableName = "OrderItem";

    async createOrderItem(orderItem: OrderItem): Promise<Response<OrderItem>> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .insert(orderItem)
                .select()
                .single();

            if (error) {
                return {
                    success: false,
                    data: undefined as any,
                    message: `주문 항목 생성에 실패했습니다: ${error.message}`
                };
            }

            return {
                success: true,
                data: data,
                message: undefined
            } as Response<OrderItem>;
        } catch (error) {
            return {
                success: false,
                data: undefined as any,
                message: `주문 항목 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async findOrderItemById(id: string): Promise<Response<OrderItem | null>> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // No rows found
                    return {
                        success: true,
                        data: null,
                        message: undefined
                    };
                }
                return {
                    success: false,
                    data: undefined as any,
                    message: `주문 항목을 찾을 수 없습니다: ${error.message}`
                };
            }

            return {
                success: true,
                data: data,
                message: undefined
            };
        } catch (error) {
            return {
                success: false,
                data: undefined as any,
                message: `주문 항목 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async updateOrderItem(orderItem: OrderItem): Promise<Response<boolean>> {
        try {
            const orderItemId = (orderItem as any).getId ? (orderItem as any).getId() : (orderItem as any).id;
            const { error } = await supabase
                .from(this.tableName)
                .update(orderItem)
                .eq('id', orderItemId);

            if (error) {
                return {
                    success: false,
                    data: false,
                    message: `주문 항목 업데이트에 실패했습니다: ${error.message}`
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
                message: `주문 항목 업데이트 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async deleteOrderItem(id: string): Promise<Response<boolean>> {
        try {
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);

            if (error) {
                return {
                    success: false,
                    data: false,
                    message: `주문 항목 삭제에 실패했습니다: ${error.message}`
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
                message: `주문 항목 삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
