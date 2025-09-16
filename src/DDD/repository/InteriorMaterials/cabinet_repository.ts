import { Cabinet } from 'dooring-core-domain/dist/models/InteriorMaterials/Cabinet/Cabinet';
import { Response } from "@/DDD/data/response";

export interface CabinetRepository {
  create(cabinet: Cabinet): Promise<Response<Cabinet>>;
  findById(id: string): Promise<Response<Cabinet | null>>;
  update(cabinet: Cabinet): Promise<Response<boolean>>;
  delete(id: string): Promise<Response<boolean>>;
}