import { InteriorMaterialsRepository } from "../repository/db/InteriorMaterials/interior_materials_repository";

export class CrudInteriorMaterialsUsecase<T> {
    constructor(public readonly repository: InteriorMaterialsRepository<T>) { }

    async create(item: T): Promise<T> {
        try {
            if (!item) {
                throw new Error("Item is required");
            }

            return await this.repository.create(item);
        } catch (error) {
            throw new Error(`Failed to create item: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findById(id: string): Promise<T | null> {
        try {
            if (!id || id.trim() === '') {
                throw new Error("ID is required");
            }

            return await this.repository.findById(id);
        } catch (error) {
            throw new Error(`Failed to find item by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async update(item: T & { id: string }): Promise<T> {
        try {
            if (!item) {
                throw new Error("Item is required");
            }

            if (!item.id || item.id.trim() === '') {
                throw new Error("Item ID is required for update");
            }

            return await this.repository.update(item);
        } catch (error) {
            throw new Error(`Failed to update item: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async delete(id: string): Promise<T> {
        try {
            if (!id || id.trim() === '') {
                throw new Error("ID is required");
            }

            return await this.repository.delete(id);
        } catch (error) {
            throw new Error(`Failed to delete item: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // 추가 유틸리티 메서드들
    async exists(id: string): Promise<boolean> {
        try {
            const item = await this.findById(id);
            return item !== null;
        } catch (error) {
            return false;
        }
    }

    async createOrUpdate(item: T & { id?: string }): Promise<T> {
        try {
            if (item.id) {
                // ID가 있으면 업데이트 시도
                const existingItem = await this.findById(item.id);
                if (existingItem) {
                    return await this.update(item as T & { id: string });
                }
            }

            // ID가 없거나 기존 아이템이 없으면 생성
            const { id, ...createData } = item;
            return await this.create(createData as T);
        } catch (error) {
            throw new Error(`Failed to create or update item: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
