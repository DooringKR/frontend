"use client";

import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import Header from "@/components/Header/Header";
import { useOrderHistory } from "./hooks/useOrderHistory";
import { usePagination } from "./hooks/usePagination";
import { OrderCard } from "./components/OrderCard";
import { Pagination } from "./components/Pagination";

const ITEMS_PER_PAGE = 5; // 한 페이지당 표시할 주문 수

function OrderHistoryPage() {
    const { orders, loading, error } = useOrderHistory();
    const { currentPage, totalPages, startIndex, endIndex, handlePageChange } = usePagination(
        orders.length,
        ITEMS_PER_PAGE
    );

    // 현재 페이지 주문들
    const currentOrders = orders.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header title="주문내역" size="Medium" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-500">주문 내역을 불러오는 중...</div>
                </div>
                <BottomNavigation />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header title="주문내역" size="Medium" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-red-500 text-center">
                        <div className="mb-2">오류가 발생했습니다</div>
                        <div className="text-sm">{error}</div>
                    </div>
                </div>
                <BottomNavigation />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header title="주문내역" size="Medium" />
            <div className="flex-1 overflow-y-auto pb-[100px] px-5 pt-5 gap-5">
                {orders.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <div className="mb-2">주문 내역이 없습니다</div>
                            <div className="text-sm">첫 번째 주문을 해보세요!</div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 주문 개수 표시 */}
                        <div className="text-sm text-gray-600 mb-4">
                            총 {orders.length}개의 주문 내역
                        </div>

                        {/* 현재 페이지 주문들 */}
                        <div className="space-y-4">
                            {currentOrders.map((order) => (
                                <OrderCard key={order.order_id} order={order} />
                            ))}
                        </div>

                        {/* 페이지네이션 */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
            <BottomNavigation />
        </div>
    );
}

export default OrderHistoryPage;