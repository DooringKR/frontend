import { Order } from 'dooring-core-domain/dist/models/BizclientCartandOrder/Order/Order';
import { Response } from "@/DDD/data/response";

export interface OrderRepository {
    createOrder(order: Order): Promise<Response<Order>>;
    findOrderById(id: string): Promise<Response<Order | null>>;
    updateOrder(order: Order): Promise<Response<boolean>>;
    deleteOrder(id: string): Promise<Response<boolean>>;
}