import { Accessory } from 'dooring-core-domain/dist/models/InteriorMaterials/Accessory';
import { Response } from "@/DDD/data/response";

export interface AccessoryRepository {
    create(accessory: Accessory): Promise<Response<Accessory>>;
    findById(id: string): Promise<Response<Accessory | null>>;
    update(accessory: Accessory): Promise<Response<boolean>>;
    delete(id: string): Promise<Response<boolean>>;
}