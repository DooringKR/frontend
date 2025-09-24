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
        const { data, error } = await supabase.from('Cart').select('*').eq('user_id', id);
        if (error) {
            return { success: false, data: null, message: error.message };
        }
        // console.log('data', data);
        return { success: true, data: data[0] };
    }

    async updateCart(cart: Cart): Promise<Response<boolean>> {
        // Cart 클래스의 id가 private이므로, public하게 접근할 수 있도록 getter를 사용해야 합니다.
        // Cart 클래스에 getId()와 같은 public 메서드가 있다고 가정합니다.
        // 만약 없다면, Cart 클래스에 public get id() { return this.id; }를 추가해야 합니다.
        // 아래는 getId() 메서드를 사용하는 예시입니다.
        const cartId = (cart as any).getId ? (cart as any).getId() : (cart as any).id;
        const { data, error } = await supabase.from('Cart').update(cart).eq('id', cartId);
        if (error) {
            return { success: false, data: false, message: error.message };
        }
        return { success: true, data: true };
    }

    async deleteCart(id: string): Promise<Response<boolean>> {
        const { data, error } = await supabase.from('Cart').delete().eq('id', id);
        if (error) {
            return { success: false, data: false, message: error.message };
        }
        return { success: true, data: true };
    }

    // cart_count만 증가시키는 메서드 (RPC 함수 없이 직접 SQL 사용)
    async incrementCartCount(cartId: string, incrementBy: number = 1): Promise<Response<boolean>> {
        try {
            // 현재 cart_count 값을 가져와서 증가시키는 방식
            const { data: currentCart, error: fetchError } = await supabase
                .from('Cart')
                .select('cart_count')
                .eq('id', cartId)
                .single();

            if (fetchError) {
                return {
                    success: false,
                    data: undefined as any,
                    message: `Failed to fetch current cart count: ${fetchError.message}`
                };
            }

            const newCount = (currentCart.cart_count || 0) + incrementBy;

            const { data: updatedCart, error: updateError } = await supabase
                .from('Cart')
                .update({ cart_count: newCount })
                .eq('id', cartId);

            if (updateError) {
                return {
                    success: false,
                    data: undefined as any,
                    message: `Failed to update cart count: ${updateError.message}`
                };
            }

            return { success: true, data: updatedCart as any };
        } catch (error) {
            return {
                success: false,
                data: undefined as any,
                message: `Error incrementing cart count: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}