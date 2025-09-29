import { CrudCartItemUsecase } from "./crud_cart_item_usecase";
import { CartItemRepository } from "@/DDD/repository/db/CartNOrder/cartitem_repository";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";

export class UpdateCartItemCountUsecase {
  constructor(private readonly repository: CartItemRepository) {}

  /**
   * item_count가 1 이상이면 update, 0이면 delete
   * @param cartItemId cartitem의 id
   * @param newCount 변경할 수량
   * @returns 변경된 CartItem 또는 삭제시 null
   */
  async updateCount(cartItemId: string, newCount: number): Promise<CartItem | null> {
    const crud = new CrudCartItemUsecase(this.repository);
    if (newCount < 0) throw new Error("item_count는 0 이상이어야 합니다.");
    if (newCount === 0) {
      await crud.delete(cartItemId);
      return null;
    } else {
      // 기존 cartitem을 불러와서 count만 변경
      const cartItem = await crud.findById(cartItemId);
      if (!cartItem) throw new Error("CartItem not found");
      const updated = new CartItem({ ...cartItem, item_count: newCount });
      await crud.update(updated);
      return updated;
    }
  }
}
