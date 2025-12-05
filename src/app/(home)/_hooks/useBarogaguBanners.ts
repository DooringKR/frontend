import { useEffect, useState } from "react";
import { BarogaguBanner } from "dooring-core-domain/dist/models/Barogagu/BarogaguBanner";
import { supabase } from "@/lib/supabase";

export function useBarogaguBanners() {
    const [banners, setBanners] = useState<BarogaguBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data, error: fetchError } = await supabase
                    .from('BarogaguBanner')
                    .select('*')
                    .eq('is_active', true)
                    .order('order_index', { ascending: true });

                if (fetchError) {
                    throw new Error(fetchError.message);
                }

                // DB 데이터를 BarogaguBanner 객체로 변환
                const bannerObjects = (data || []).map(row => BarogaguBanner.fromDB(row));
                setBanners(bannerObjects);
            } catch (err) {
                console.error("배너 데이터 로드 실패:", err);
                setError(err instanceof Error ? err.message : "배너를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    return { banners, loading, error };
}

