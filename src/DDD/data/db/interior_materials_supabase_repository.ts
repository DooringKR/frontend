import { InteriorMaterialsRepository } from "@/DDD/repository/db/InteriorMaterials/interior_materials_repository";
import { supabase } from "@/lib/supabase";

export class InteriorMaterialsSupabaseRepository<T> extends InteriorMaterialsRepository<T> {
    protected tableName: string;

    constructor(tableName: string) {
        super();
        this.tableName = tableName;
    }

    async create(item: T): Promise<T> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .insert(item)
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to create item: ${error.message}`);
            }

            return data;
        } catch (error) {
            throw new Error(`Error creating item in ${this.tableName}: ${error}`);
        }
    }

    async findById(id: string): Promise<T | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // No rows found
                    return null;
                }
                throw new Error(`Failed to find item: ${error.message}`);
            }

            return data;
        } catch (error) {
            throw new Error(`Error finding item in ${this.tableName}: ${error}`);
        }
    }

    async update(item: T & { id: string }): Promise<T> {
        try {
            const { id, ...updateData } = item;

            const { data, error } = await supabase
                .from(this.tableName)
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to update item: ${error.message}`);
            }

            return data;
        } catch (error) {
            throw new Error(`Error updating item in ${this.tableName}: ${error}`);
        }
    }

    async delete(id: string): Promise<T> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to delete item: ${error.message}`);
            }

            return data;
        } catch (error) {
            throw new Error(`Error deleting item in ${this.tableName}: ${error}`);
        }
    }
}