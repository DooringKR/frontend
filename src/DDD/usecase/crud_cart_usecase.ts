import { CartRepository } from "@/DDD/repository/db/CartNOrder/cart_repository";
import { Cart } from "dooring-core-domain/dist/models/BizClientCartAndOrder/Cart";
import { Response } from "@/DDD/data/response";

export class CrudCartUsecase {
    constructor(private readonly repository: CartRepository) { }

    async create(cart: Cart): Promise<Cart> {
        try {
            if (!cart) {
                throw new Error("Cart is required");
            }

            const response = await this.repository.createCart(cart);
            if (!response.success) {
                throw new Error(response.message || "Failed to create cart");
            }

            return response.data!;
        } catch (error) {
            throw new Error(`Failed to create cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findById(id: string): Promise<Cart | null> {
        try {
            if (!id || id.trim() === '') {
                throw new Error("ID is required");
            }

            const response = await this.repository.findCartById(id);
            if (!response.success) {
                throw new Error(response.message || "Failed to find cart by ID");
            }

            return response.data!;
        } catch (error) {
            throw new Error(`Failed to find cart by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async update(cart: Cart): Promise<boolean> {
        try {
            if (!cart) {
                throw new Error("Cart is required");
            }

            const response = await this.repository.updateCart(cart);
            if (!response.success) {
                throw new Error(response.message || "Failed to update cart");
            }

            return response.data!;
        } catch (error) {
            throw new Error(`Failed to update cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            if (!id || id.trim() === '') {
                throw new Error("ID is required");
            }

            const response = await this.repository.deleteCart(id);
            if (!response.success) {
                throw new Error(response.message || "Failed to delete cart");
            }

            return response.data!;
        } catch (error) {
            throw new Error(`Failed to delete cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // 추가 유틸리티 메서드들
    async exists(id: string): Promise<boolean> {
        try {
            const cart = await this.findById(id);
            return cart !== null;
        } catch (error) {
            return false;
        }
    }

    // cart_count만 증가시키는 메서드 추가
    async incrementCartCount(cartId: string, incrementBy: number = 1): Promise<boolean> {
        try {
            if (!cartId || cartId.trim() === '') {
                throw new Error("Cart ID is required");
            }

            const response = await this.repository.incrementCartCount(cartId, incrementBy);
            if (!response.success) {
                throw new Error(response.message || "Failed to increment cart count");
            }

            return response.data!;
        } catch (error) {
            throw new Error(`Failed to increment cart count: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
