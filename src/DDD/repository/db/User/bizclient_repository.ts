import { BizClient } from 'dooring-core-domain/dist/models/User/BizClient';
import { Response } from '@/DDD/data/response';

export abstract class BizClientRepository {
    abstract createUser(user: BizClient): Promise<Response<BizClient>>;
    abstract findUserById(id: string): Promise<Response<BizClient | null>>;
    abstract updateUser(user: Partial<BizClient>): Promise<Response<boolean>>; // Partial로 변경
    abstract deleteUser(id: string): Promise<Response<boolean>>;
}