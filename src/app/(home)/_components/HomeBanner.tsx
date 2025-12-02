"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { BarogaguBanner } from "dooring-core-domain/dist/models/Barogagu/BarogaguBanner";
import { supabase } from "@/lib/supabase";

import BannerPagination from "@/components/Banner/_components/Pagination";
import { useBarogaguBanners } from "../_hooks/useBarogaguBanners";
import useBizClientStore from "@/store/bizClientStore";

// 측정을 막을 전화번호 목록 (개발자/테스트 계정)
const EXCLUDED_PHONE_NUMBERS = [
    "01012345678",
    "01091731643",
    "01059550094",
    "01094401874",
    "01047116615",
];

const HomeBanner: React.FC = () => {
    const { banners, loading, error } = useBarogaguBanners();
    const phoneNumber = useBizClientStore(state => state.getPhoneNumber());

    // 개발자/테스트 계정 체크
    const isExcludedAccount = phoneNumber ? EXCLUDED_PHONE_NUMBERS.includes(phoneNumber) : false;

    // banner_image_url이 있는 배너만 필터링 (is_active는 이미 쿼리에서 필터링됨)
    const activeBanners = banners
        .filter(banner => banner.banner_image_url)
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

    const [current, setCurrent] = useState(1); // 복제된 첫 번째 슬라이드를 고려하여 1부터 시작
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const total = activeBanners.length;
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const viewedBannerIdsRef = useRef<Set<string>>(new Set()); // 같은 페이지 로드에서 카운팅된 배너 ID들
    const bannerVisibilityTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map()); // 각 배너의 가시성 타이머
    const bannerRefsRef = useRef<Map<string, HTMLDivElement | null>>(new Map()); // 각 배너의 ref

    // 무한 루프를 위한 복제된 슬라이드 배열 생성
    // [마지막(복제), ...원본배너들..., 첫번째(복제)]
    const slides = total > 1
        ? [activeBanners[total - 1], ...activeBanners, activeBanners[0]]
        : activeBanners;
    const totalSlides = slides.length;

    const goToPrevious = () => {
        if (total <= 1) return;
        setIsTransitioning(true);
        setCurrent((prev) => {
            const newIndex = prev - 1;
            if (newIndex === 0) {
                // 복제된 마지막 슬라이드로 이동
                return total; // 실제 마지막 슬라이드 인덱스
            }
            return newIndex;
        });
    };

    const goToNext = () => {
        if (total <= 1) return;
        setIsTransitioning(true);
        setCurrent((prev) => {
            const newIndex = prev + 1;
            if (newIndex === totalSlides - 1) {
                // 복제된 첫 번째 슬라이드로 이동
                return totalSlides - 1;
            }
            return newIndex;
        });
    };

    // transition이 끝난 후 실제 슬라이드로 즉시 이동
    useEffect(() => {
        if (total <= 1) return;

        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
        }

        transitionTimeoutRef.current = setTimeout(() => {
            if (current === 0) {
                // 복제된 마지막에서 실제 마지막으로 이동
                setIsTransitioning(false);
                setCurrent(total);
            } else if (current === totalSlides - 1) {
                // 복제된 첫 번째에서 실제 첫 번째로 이동
                setIsTransitioning(false);
                setCurrent(1);
            }
        }, 300); // transition 시간과 동일

        return () => {
            if (transitionTimeoutRef.current) {
                clearTimeout(transitionTimeoutRef.current);
            }
        };
    }, [current, total, totalSlides]);

    // Intersection Observer로 배너 가시성 감지 및 views 증가
    useEffect(() => {
        if (total === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const bannerElement = entry.target as HTMLDivElement;
                    const bannerId = bannerElement.dataset.bannerId;

                    if (!bannerId) return;

                    // 이미 카운팅된 배너는 제외
                    if (viewedBannerIdsRef.current.has(bannerId)) return;

                    if (entry.isIntersecting) {
                        // 배너가 화면에 보이기 시작
                        // 2초 후에 views 증가
                        const timer = setTimeout(async () => {
                            // 제외된 계정이면 카운팅하지 않음
                            if (isExcludedAccount) {
                                bannerVisibilityTimersRef.current.delete(bannerId);
                                return;
                            }

                            // 다시 확인 (여전히 보이고 있는지, 아직 카운팅되지 않았는지)
                            if (!viewedBannerIdsRef.current.has(bannerId)) {
                                try {
                                    const { data: currentBanner, error: fetchError } = await supabase
                                        .from('BarogaguBanner')
                                        .select('views')
                                        .eq('id', bannerId)
                                        .single();

                                    if (!fetchError && currentBanner) {
                                        const newViews = (currentBanner.views || 0) + 1;
                                        await supabase
                                            .from('BarogaguBanner')
                                            .update({ views: newViews })
                                            .eq('id', bannerId);

                                        viewedBannerIdsRef.current.add(bannerId);
                                    }
                                } catch (error) {
                                    console.error("배너 views 업데이트 실패:", error);
                                }
                            }
                            bannerVisibilityTimersRef.current.delete(bannerId);
                        }, 2000); // 2초 이상 보였을 때만 카운팅

                        bannerVisibilityTimersRef.current.set(bannerId, timer);
                    } else {
                        // 배너가 화면에서 사라짐 - 타이머 취소
                        const timer = bannerVisibilityTimersRef.current.get(bannerId);
                        if (timer) {
                            clearTimeout(timer);
                            bannerVisibilityTimersRef.current.delete(bannerId);
                        }
                    }
                });
            },
            {
                threshold: 0.5, // 배너의 50% 이상이 보일 때
            }
        );

        // 모든 배너 요소 관찰
        bannerRefsRef.current.forEach((element) => {
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
            // 모든 타이머 정리
            bannerVisibilityTimersRef.current.forEach((timer) => {
                clearTimeout(timer);
            });
            bannerVisibilityTimersRef.current.clear();
        };
    }, [total, activeBanners, isExcludedAccount]);

    // 3초마다 자동으로 넘어가기
    useEffect(() => {
        if (total <= 1 || isPaused) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = setInterval(() => {
            goToNext();
        }, 5000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [total, isPaused]);

    const handleBannerClick = async (banner: BarogaguBanner) => {
        // 제외된 계정이면 clicks 업데이트하지 않음
        if (!isExcludedAccount && banner.id) {
            try {
                // 현재 clicks 값을 가져와서 증가
                const { data: currentBanner, error: fetchError } = await supabase
                    .from('BarogaguBanner')
                    .select('clicks')
                    .eq('id', banner.id)
                    .single();

                if (!fetchError && currentBanner) {
                    const newClicks = (currentBanner.clicks || 0) + 1;
                    await supabase
                        .from('BarogaguBanner')
                        .update({ clicks: newClicks })
                        .eq('id', banner.id);
                }
            } catch (error) {
                console.error("배너 클릭 카운트 업데이트 실패:", error);
                // 에러가 발생해도 배너 클릭 동작은 계속 진행
            }
        }

        // 배너 링크 열기
        if (banner.hyperlink) {
            window.open(banner.hyperlink, '_blank', 'noopener,noreferrer');
        }
    };

    // 로딩 중
    if (loading) {
        return null;
    }

    // 에러 발생 시
    if (error) {
        console.error("배너 로드 에러:", error);
        return null;
    }

    // 배너가 없으면 렌더링하지 않음
    if (total === 0) {
        return null;
    }

    return (
        <div
            style={{
                width: "100%",
                margin: "0 auto",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* 배너 이미지들 */}
            <div
                style={{
                    display: "flex",
                    transition: isTransitioning ? "transform 0.3s cubic-bezier(.4,0,.2,1)" : "none",
                    transform: `translateX(-${current * 100}%)`,
                    width: "100%",
                }}
            >
                {slides.map((banner, idx) => {
                    // 실제 배너 인덱스 계산 (복제된 슬라이드 제외)
                    const isCloned = total > 1 && (idx === 0 || idx === totalSlides - 1);
                    const actualBannerIndex = isCloned ? (idx === 0 ? total - 1 : 0) : idx - 1;
                    const actualBanner = activeBanners[actualBannerIndex];
                    const bannerId = actualBanner?.id;

                    return (
                        <div
                            key={`${banner.id || idx}-${idx}`}
                            ref={(el) => {
                                // 복제된 슬라이드가 아니고 실제 배너 ID가 있을 때만 ref 저장
                                if (!isCloned && bannerId) {
                                    bannerRefsRef.current.set(bannerId, el);
                                }
                            }}
                            data-banner-id={isCloned ? undefined : bannerId}
                            style={{
                                width: "100%",
                                flexShrink: 0,
                                position: "relative",
                                cursor: banner.hyperlink ? "pointer" : "default",
                            }}
                            onClick={() => handleBannerClick(banner)}
                        >
                            <Image
                                src={banner.banner_image_url!}
                                alt={banner.code || `배너 ${idx + 1}`}
                                width={1200}
                                height={400}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "contain",
                                    transition: banner.hyperlink ? "opacity 0.2s ease" : "none",
                                } as React.CSSProperties}
                                priority={idx === 1}
                                draggable={false}
                                onMouseEnter={(e) => {
                                    if (banner.hyperlink) {
                                        e.currentTarget.style.opacity = "0.9";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (banner.hyperlink) {
                                        e.currentTarget.style.opacity = "1";
                                    }
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* 네비게이션 컨트롤 영역 */}
            {total > 1 && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 0",
                        pointerEvents: "none",
                    }}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* 이전 버튼 */}
                    <button
                        onClick={goToPrevious}
                        style={{
                            background: "none",
                            border: "none",
                            width: 40,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            pointerEvents: "auto",
                            opacity: 0.4,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.7";
                            e.currentTarget.style.transform = "scale(1.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "0.4";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* 다음 버튼 */}
                    <button
                        onClick={goToNext}
                        style={{
                            background: "none",
                            border: "none",
                            width: 40,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            pointerEvents: "auto",
                            opacity: 0.4,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.7";
                            e.currentTarget.style.transform = "scale(1.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "0.4";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            )}

            {/* 페이지네이션 */}
            {total > 1 && (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 8,
                        margin: "auto",
                        zIndex: 2,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <BannerPagination
                        total={total}
                        current={
                            current === 0
                                ? total - 1
                                : current === totalSlides - 1
                                    ? 0
                                    : current - 1
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default HomeBanner;
