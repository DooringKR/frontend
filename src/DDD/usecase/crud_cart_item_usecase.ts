import { CartItemRepository } from "@/DDD/repository/db/CartNOrder/cartitem_repository";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { Response } from "@/DDD/data/response";

export class CrudCartItemUsecase {
    constructor(private readonly repository: CartItemRepository) { }

    async create(cartItem: CartItem): Promise<CartItem> {
        try {
            if (!cartItem) {
                throw new Error("CartItem is required");
            }

            const response = await this.repository.createCartItem(cartItem);
            if (!response.success) {
                throw new Error(response.message || "Failed to create cart item");
            }

            return response.data!;
        } catch (error) {
            throw new Error(`Failed to create cart item: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findById(id: string): Promise<CartItem | null> {
        try {
            if (!id || id.trim() === '') {
                throw new Error("ID is required");
            }

            const response = await this.repository.findCartItemById(id);
            if (!response.success) {
                throw new Error(response.message || "Failed to find cart item by ID");
            }

            return response.data!;
        } catch (error) {
            throw new Error(`Failed to find cart item by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async update(cartItem: CartItem): Promise<boolean> {
        try {
            if (!cartItem) {
                throw new Error("CartItem is required");
            }

            const response = await this.repository.updateCartItem(cartItem);
            if (!response.success) {
                throw new Error(response.message || "Failed to update cart item");
            }

            return response.data!;
        } catch (error) {
            throw new Error(`Failed to update cart item: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            if (!id || id.trim() === '') {
                throw new Error("ID is required");
            }

            const response = await this.repository.deleteCartItem(id);
            if (!response.success) {
                throw new Error(response.message || "Failed to delete cart item");
            }

            return response.data!;
        } catch (error) {
            throw new Error(`Failed to delete cart item: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // 추가 유틸리티 메서드들
    async exists(id: string): Promise<boolean> {
        try {
            const cartItem = await this.findById(id);
            return cartItem !== null;
        } catch (error) {
            return false;
        }
    }

}
