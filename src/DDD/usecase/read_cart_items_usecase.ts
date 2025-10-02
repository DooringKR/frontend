
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { Response } from "@/DDD/data/response";

export class ReadCartItemsUsecase {
  private cartItemRepository: CartItemSupabaseRepository;

  constructor() {
    this.cartItemRepository = new CartItemSupabaseRepository();
  }


  async readCartItemsByCartId(cartId: string): Promise<Response<CartItem[]>> {
    try {
      if (!cartId) {
        throw new Error("cartId is required");
      }
      const data = await this.cartItemRepository.readByCartId(cartId);
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: `Failed to read cart items: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}
