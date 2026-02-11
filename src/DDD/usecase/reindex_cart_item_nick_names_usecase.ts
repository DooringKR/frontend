import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { CartItemRepository } from "@/DDD/repository/db/CartNOrder/cartitem_repository";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import { Response } from "@/DDD/data/response";

export class ReindexCartItemNickNamesUsecase {
  constructor(private readonly repository: CartItemRepository) {}

  async execute(cartId: string): Promise<Response<CartItem[]>> {
    try {
      if (!cartId) {
        throw new Error("cartId is required");
      }

      const items = await this.repository.readByCartId(cartId);
      const sorted = [...items].sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at as any).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at as any).getTime() : 0;
        if (aTime !== bTime) return aTime - bTime;
        return String(a.id ?? "").localeCompare(String(b.id ?? ""));
      });

      const nextNickById = new Map<string, string>();
      sorted.forEach((cartItem, idx) => {
        if (cartItem.id) nextNickById.set(cartItem.id, String(idx + 1));
      });

      const crud = new CrudCartItemUsecase(this.repository);
      const updates = items
        .filter(cartItem => cartItem.id && nextNickById.get(cartItem.id) !== cartItem.nick_name)
        .map(cartItem => {
          const nextNick = nextNickById.get(cartItem.id!)!;
          const updated = new CartItem({ ...cartItem, nick_name: nextNick });
          return crud.update(updated);
        });

      if (updates.length > 0) {
        await Promise.all(updates);
      }

      const updatedItems = items.map(cartItem => {
        if (!cartItem.id) return cartItem;
        const nextNick = nextNickById.get(cartItem.id);
        if (!nextNick || nextNick === cartItem.nick_name) return cartItem;
        return new CartItem({ ...cartItem, nick_name: nextNick });
      });

      return { success: true, data: updatedItems };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: `Failed to reindex cart item nick_name: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }
}
