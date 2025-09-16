import { CartRepository } from "@/DDD/repository/db/CartNOrder/cart_repository";
import { Cart } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Cart";
import { Response } from "@/DDD/data/response";
import { supabase } from "@/lib/supabase";

export class CartSupabaseRepository extends CartRepository {

    async createCart(cart: Cart): Promise<Response<Cart>> {
        const { data, error } = await supabase.from('Cart').insert(cart).select();
        if (error || !data || data.length === 0) {
            return { success: false, data: undefined as any, message: error ? error.message : "장바구니 생성에 실패했습니다." };
        }
        return { success: true, data: data[0] };
    }

    async findCartById(id: string): Promise<Response<Cart | null>> {
        const { data, error } = await supabase.from('cart').select('*').eq('id', id);
        if (error) {
            return { success: false, data: null, message: error.message };
        }
        return { success: true, data: data[0] };
    }

    async updateCart(cart: Cart): Promise<Response<boolean>> {
        // Cart 클래스의 id가 private이므로, public하게 접근할 수 있도록 getter를 사용해야 합니다.
        // Cart 클래스에 getId()와 같은 public 메서드가 있다고 가정합니다.
        // 만약 없다면, Cart 클래스에 public get id() { return this.id; }를 추가해야 합니다.
        // 아래는 getId() 메서드를 사용하는 예시입니다.
        const cartId = (cart as any).getId ? (cart as any).getId() : (cart as any).id;
        const { data, error } = await supabase.from('cart').update(cart).eq('id', cartId);
        if (error) {
            return { success: false, data: false, message: error.message };
        }
        return { success: true, data: true };
    }

    async deleteCart(id: string): Promise<Response<boolean>> {
        const { data, error } = await supabase.from('cart').delete().eq('id', id);
        if (error) {
            return { success: false, data: false, message: error.message };
        }
        return { success: true, data: true };
    }
}