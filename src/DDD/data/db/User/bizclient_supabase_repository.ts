import { BizClientRepository } from "@/DDD/repository/db/User/bizclient_repository";
import { SupabaseClient } from "@supabase/supabase-js";
import { BizClient } from "dooring-core-domain/dist/models/User/BizClient";
import { Response } from "@/DDD/data/response";
import { supabase } from "@/lib/supabase";

export class BizClientSupabaseRepository extends BizClientRepository {

    async createUser(user: BizClient): Promise<Response<BizClient>> {

        const { data, error } = await supabase.from('BizClient').insert(user).select();
        if (error || !data || data.length === 0) {
            return { success: false, data: undefined as any, message: error ? error.message : "사용자 생성에 실패했습니다." };
        }
        return { success: true, data: data[0] || null };
    }

    async findUserById(id: string): Promise<Response<BizClient | null>> {
        const { data, error } = await supabase.from('BizClient').select('*').eq('id', id);
        if (error) {
            return { success: false, data: null, message: error.message };
        }
        return { success: true, data: data[0] };
    }

    async updateUser(user: BizClient): Promise<Response<boolean>> {
        const { data, error } = await supabase.from('bizclient').update(user).eq('id', user.id);
        if (error) {
            return { success: false, data: false, message: error.message };
        }
        return { success: true, data: true };
    }

    async deleteUser(id: string): Promise<Response<boolean>> {
        const { data, error } = await supabase.from('bizclient').delete().eq('id', id);
        if (error) {
            return { success: false, data: false, message: error.message };
        }
        return { success: true, data: true };
    }

}