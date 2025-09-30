import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { Response } from "@/DDD/data/response";

export abstract class CartItemRepository {
    abstract createCartItem(cartItem: CartItem): Promise<Response<CartItem>>;
    abstract findCartItemById(id: string): Promise<Response<CartItem | null>>;
    abstract updateCartItem(cartItem: CartItem): Promise<Response<boolean>>;
    abstract deleteCartItem(id: string): Promise<Response<boolean>>;

    abstract readByCartId(cartId: string): Promise<CartItem[]>;
}