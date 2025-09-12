import { Cart } from 'dooring-core-domain/dist/models/BizclientCartandOrder/Cart';
import { Response } from "@/DDD/data/response";

export interface CartRepository {
    createCart(cart: Cart): Promise<Response<Cart>>;
    findCartById(id: string): Promise<Response<Cart | null>>;
    updateCart(cart: Cart): Promise<Response<boolean>>;
    deleteCart(id: string): Promise<Response<boolean>>;
}

