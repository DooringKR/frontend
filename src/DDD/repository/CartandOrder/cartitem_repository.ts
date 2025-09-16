import { CartItem } from "dooring-core-domain/dist/models/BizclientCartandOrder/CartItem";
import { Response } from "@/DDD/data/response";

export interface CartItemRepository {
    createCartItem(cartItem: CartItem): Promise<Response<CartItem>>;
    findCartItemById(id: string): Promise<Response<CartItem | null>>;
    updateCartItem(cartItem: CartItem): Promise<Response<boolean>>;
    deleteCartItem(id: string): Promise<Response<boolean>>;
}