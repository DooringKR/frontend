import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ReadBizClientUsecase } from "@/DDD/usecase/user/read_bizClient_usecase";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { KakaoAuthSupabaseRepository } from "@/DDD/data/service/kakao_auth_supabase_repository";
import useBizClientStore from "@/store/bizClientStore";
import useCartStore from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";

export function useSessionCheck() {

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error checking session:", error);
                return;
            }
            if (!session) {
                console.log('❌ 세션이 없음');
                return;
            }

            // 세션은 있지만 BizClient가 DB에 존재하는지 확인
            console.log('✅ 세션 존재, BizClient DB 존재 여부 확인 시작');
            try {
                const readBizClientUsecase = new ReadBizClientUsecase(new BizClientSupabaseRepository());
                const bizClientResponse = await readBizClientUsecase.execute(session.user.id);

                if (!bizClientResponse.success || !bizClientResponse.data) {
                    //세션이 있는데 bizClient가 DB에 존재하지 않으면 로그아웃 처리
                    console.log('❌ BizClient가 DB에 존재하지 않음, 로그아웃');
                    const kakaoAuthSupabaseRepository = new KakaoAuthSupabaseRepository();
                    await kakaoAuthSupabaseRepository.logout();
                    useBizClientStore.setState({ bizClient: null });
                    useCartStore.setState({ cart: null });
                    useOrderStore.setState({ order: null });
                    return;
                }

                console.log('✅ BizClient가 DB에 존재함:', bizClientResponse.data.id);
            } catch (error) {
                console.error('BizClient DB 확인 중 에러:', error);
                // 에러 발생 시에도 로그아웃 처리
                const kakaoAuthSupabaseRepository = new KakaoAuthSupabaseRepository();
                await kakaoAuthSupabaseRepository.logout();
                useBizClientStore.setState({ bizClient: null });
                useCartStore.setState({ cart: null });
                useOrderStore.setState({ order: null });
            }
        };
        checkSession();
    }, []);
}

