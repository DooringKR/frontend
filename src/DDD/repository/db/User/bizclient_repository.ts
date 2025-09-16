import { BizClient } from 'dooring-core-domain/dist/models/User/Bizclient';
import { Response } from '@/DDD/data/response';

export abstract class BizClientRepository {
    abstract createUser(user: BizClient): Promise<Response<BizClient>>;
    abstract findUserById(id: string): Promise<Response<BizClient | null>>;
    abstract updateUser(user: BizClient): Promise<Response<boolean>>;
    abstract deleteUser(id: string): Promise<Response<boolean>>;
}