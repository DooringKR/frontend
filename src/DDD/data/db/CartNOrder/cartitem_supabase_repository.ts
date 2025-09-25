import { CartItemRepository } from "@/DDD/repository/db/CartNOrder/cartitem_repository";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { Response } from "@/DDD/data/response";
import { supabase } from "@/lib/supabase";

export class CartItemSupabaseRepository extends CartItemRepository {
    private readonly tableName = "CartItem";

    async createCartItem(cartItem: CartItem): Promise<Response<CartItem>> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .insert(cartItem)
                .select()
                .single();

            if (error) {
                return {
                    success: false,
                    data: undefined as any,
                    message: `Failed to create cart item: ${error.message}`
                };
            }

            return {
                success: true,
                data: data,
                message: undefined
            } as Response<CartItem>;
        } catch (error) {
            return {
                success: false,
                data: undefined as any,
                message: `Error creating cart item: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async findCartItemById(id: string): Promise<Response<CartItem | null>> {
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
                    message: `Failed to find cart item: ${error.message}`
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
                message: `Error finding cart item: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async updateCartItem(cartItem: CartItem): Promise<Response<boolean>> {
        try {
            const cartItemId = (cartItem as any).getId ? (cartItem as any).getId() : (cartItem as any).id;
            const { error } = await supabase
                .from(this.tableName)
                .update(cartItem)
                .eq('id', cartItemId);

            if (error) {
                return {
                    success: false,
                    data: false,
                    message: `Failed to update cart item: ${error.message}`
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
                message: `Error updating cart item: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async deleteCartItem(id: string): Promise<Response<boolean>> {
        try {
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);

            if (error) {
                return {
                    success: false,
                    data: false,
                    message: `Failed to delete cart item: ${error.message}`
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
                message: `Error deleting cart item: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async readByCartId(cartId: number | string): Promise<CartItem[]> {
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq('cart_id', cartId);
        if (error) {
            throw new Error(`Failed to fetch cart items by cartId: ${error.message}`);
        }
        return (data ?? []) as CartItem[];
    }
}
