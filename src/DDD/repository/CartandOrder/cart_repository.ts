import { Cart } from 'dooring-core-domain/dist/models/BizClientCartAndOrder/Cart';
import { Response } from '../../data/response'; 

export interface CartRepository {
    createCart(cart: Cart): Promise<Response<Cart>>;
    findCartById(id: string): Promise<Response<Cart | null>>;
    updateCart(cart: Cart): Promise<Response<boolean>>;
    deleteCart(id: string): Promise<Response<boolean>>;
}

