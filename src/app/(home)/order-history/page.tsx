"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import Header from "@/components/Header/Header";
import { EmptyState, ErrorBanner, ListSkeleton } from "@/components/state/StateViews";
import { Button } from "@/components/ui/button";
import { trackView } from "@/services/analytics/amplitude";
import { setAfterLogin } from "@/utils/afterLogin";
import { getPreviousScreenName, setScreenName } from "@/utils/screenName";

import { OrderCard } from "./components/OrderCard";
import { SituationOrderList } from "./components/SituationOrderList";
import { useOrderHistory } from "./hooks/useOrderHistory";

const PAGE = 5; // 한 번에 보여 줄 주문 수 — 더 있으면 「더 보기」

function OrderHistoryPage() {
  const router = useRouter();
  const { orders, error, needLogin, reload } = useOrderHistory();
  // 상황 주문 건수 — null = 아직 안 읽음(읽기 전에 「없습니다」를 띄우지 않는다)
  const [situationCount, setSituationCount] = useState<number | null>(null);
  const [shown, setShown] = useState(PAGE);

  // 페이지 진입 View 이벤트 트래킹 (마운트 시 1회)
  useEffect(() => {
    // 전역 screen_name 설정 (이전 화면명을 보존 후 현재 설정)
    setScreenName("order_history");
    const prev = getPreviousScreenName();
    trackView({
      object_type: "screen",
      object_name: null,
      current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
      previous_screen: prev,
    });
  }, []);

  const toLogin = () => {
    setAfterLogin("/order-history");
    router.push("/start");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <InitAmplitude />
      <Header title="주문내역" size="Medium" />
      <div className="flex-1 px-5 pb-[100px] pt-5">
        <SituationOrderList onCount={setSituationCount} />
        {needLogin ? (
          <EmptyState text="로그인하면 주문 내역을 볼 수 있어요" action={{ label: "로그인", onClick: toLogin }} />
        ) : error ? (
          <ErrorBanner text={error} onRetry={reload} />
        ) : !orders ? (
          <ListSkeleton />
        ) : orders.length === 0 ? (
          situationCount === 0 && <EmptyState text="주문 내역이 없어요" action={{ label: "주문하기", onClick: () => router.push("/request") }} />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-600">총 {orders.length}개의 주문 내역</div>
            {orders.slice(0, shown).map((o) => (
              <OrderCard key={o.order.id} orderWithItems={o} />
            ))}
            {orders.length > shown && (
              <Button variant="secondary" size="md" onClick={() => setShown((n) => n + PAGE)}>
                더 보기
              </Button>
            )}
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
}

export default OrderHistoryPage;
