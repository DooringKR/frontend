import { Finish } from 'dooring-core-domain/dist/models/InteriorMaterials/Finish';
import { Response } from "@/DDD/data/response";

export interface FinishRepository {
    create(finish: Finish): Promise<Response<Finish>>;
    findById(id: string): Promise<Response<Finish | null>>;
    update(finish: Finish): Promise<Response<boolean>>;
    delete(id: string): Promise<Response<boolean>>;
}
