import { BizClient } from 'dooring-core-domain/dist/models/User/Bizclient';
import { Response } from '@/DDD/data/response';

export interface BizClientRepository {
    createUser(user: BizClient): Promise<Response<BizClient>>;
    findUserById(id: string): Promise<Response<BizClient | null>>;
    updateUser(user: BizClient): Promise<Response<boolean>>;
    deleteUser(id: string): Promise<Response<boolean>>;
}