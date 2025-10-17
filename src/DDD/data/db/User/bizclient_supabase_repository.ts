import { BizClientRepository } from "@/DDD/repository/db/User/bizclient_repository";
import { SupabaseClient } from "@supabase/supabase-js";
import { BizClient } from "dooring-core-domain/dist/models/User/BizClient";
import { Response } from "@/DDD/data/response";
import { supabase } from "@/lib/supabase";

export class BizClientSupabaseRepository extends BizClientRepository {

    async createUser(user: BizClient): Promise<Response<BizClient>> {
        console.log('📝 createUser user:', user);
        console.log('📝 createUser user.toDB():', user.toDB());

        // 먼저 테이블 존재 여부 확인
        const { data: tableCheck, error: tableError } = await supabase.from('BizClient').select('*').limit(1);
        console.log('📝 테이블 존재 확인:', { tableCheck, tableError });

        const { data, error } = await supabase.from('BizClient').insert(user.toDB()).select();
        console.log('📝 createUser data:', data);
        console.log('📝 createUser error:', error);
        console.log('📝 createUser error details:', JSON.stringify(error, null, 2));
        if (error || !data || data.length === 0) {
            return { success: false, data: undefined as any, message: error?.cause ? error.message : "사용자 생성에 실패했습니다." };
        }
        return { success: true, data: data[0] || null };
    }

    async findUserById(id: string): Promise<Response<BizClient | null>> {
        const { data, error } = await supabase.from('BizClient').select('*').eq('id', id);
        console.log('📝 dat111111a:', data);
        if (data && data.length > 0) {
            return { success: true, data: data[0] };
        } else {
            return { success: false, data: null, message: "사용자를 찾을 수 없습니다." };
        }
    }

    async updateUser(user: Partial<BizClient>): Promise<Response<boolean>> {
        const { data, error } = await supabase.from('BizClient').update(user).eq('id', user.id);
        if (error) {
            return { success: false, data: false, message: error.message };
        }
        return { success: true, data: true };
    }

    async deleteUser(id: string): Promise<Response<boolean>> {
        const { data, error } = await supabase.from('BizClient').delete().eq('id', id);
        if (error) {
            return { success: false, data: false, message: error.message };
        }
        return { success: true, data: true };
    }

}