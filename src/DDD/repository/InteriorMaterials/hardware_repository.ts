import { Hardware } from 'dooring-core-domain/dist/models/InteriorMaterials/Hardware/Hardware';
import { Response } from '../../data/response';

export interface HardwareRepository {
    create(hardware: Hardware): Promise<Response<Hardware>>;
    findById(id: string): Promise<Response<Hardware | null>>;
    update(hardware: Hardware): Promise<Response<boolean>>;
    delete(id: string): Promise<Response<boolean>>;
}