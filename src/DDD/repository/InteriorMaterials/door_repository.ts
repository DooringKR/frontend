import { Door } from 'dooring-core-domain/dist/models/InteriorMaterials/Door';
import { Response } from '../../data/response';

export interface DoorRepository {
    create(door: Door): Promise<Response<Door>>;
    findById(id: string): Promise<Response<Door | null>>;
    update(door: Door): Promise<Response<boolean>>;
    delete(id: string): Promise<Response<boolean>>;
}