import { Cart } from 'dooring-core-domain/dist/models/BizclientCartandOrder/Cart';
import { Response } from "@/DDD/data/response";

export abstract class CartRepository {
    abstract createCart(cart: Cart): Promise<Response<Cart>>;
    abstract findCartById(id: string): Promise<Response<Cart | null>>;
    abstract updateCart(cart: Cart): Promise<Response<boolean>>;
    abstract deleteCart(id: string): Promise<Response<boolean>>;
}

