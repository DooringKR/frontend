import { OrderItem } from "dooring-core-domain/dist/models/BizclientCartandOrder/Order/OrderItem";
import { Response } from "@/DDD/data/response";

export interface OrderItemRepository { 
    createOrderItem(orderItem: OrderItem): Promise<Response<OrderItem>>;
    findOrderItemById(id: string): Promise<Response<OrderItem | null>>;
    updateOrderItem(orderItem: OrderItem): Promise<Response<boolean>>;
    deleteOrderItem(id: string): Promise<Response<boolean>>;
}

