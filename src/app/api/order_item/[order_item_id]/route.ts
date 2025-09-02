import { NextResponse } from 'next/server';

interface OrderItem {
    order_item_id: number;
    order_id: string;
    product_type: string;
    unit_price: number;
    item_count: number;
    item_options: Record<string, any>;
    created_at: string;
    last_updated_at: string;
}

interface OrderItemResponse {
    order_item: OrderItem;
}

async function getOrderItemFromBackend(orderItemId: number) {
    console.log("📋 백엔드에서 주문 품 조회 요청:", orderItemId);

    const url = `https://dooring-backend.onrender.com/order_item/${orderItemId}`;
    console.log("🌐 요청 URL:", url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

    // console.log("📡 백엔드 응답 상태:", response.status, response.statusText); // [DEBUG 주석처리]
    // console.log("📡 백엔드 응답 헤더:", Object.fromEntries(response.headers.entries())); // [DEBUG 주석처리]

        if (!response.ok) {
            const errorText = await response.text();
            // console.error("❌ 백엔드 주문 품 조회 실패:", response.status, response.statusText, errorText); // [DEBUG 주석처리]
            throw new Error(`주문 품 조회 실패: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
    // console.log("✅ 백엔드 주문 품 조회 성공:", data); // [DEBUG 주석처리]

        return data;
    } catch (error) {
        console.error("🔍 백엔드 요청 중 네트워크 에러:", error);
        console.error("🔍 에러 상세 정보:", {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ order_item_id: string }> }
) {
    // console.log("🚀 /api/order_item/[order_item_id] GET 요청 시작"); // [DEBUG 주석처리]
    console.log("🔍 요청 URL:", request.url);
    console.log("🔍 파라미터:", params);

    try {
        const { order_item_id } = await params;
        console.log("🔍 추출된 order_item_id:", order_item_id);

        if (!order_item_id) {
            // console.log("❌ order_item_id 파라미터가 없음"); // [DEBUG 주석처리]
            return NextResponse.json(
                { error: 'order_item_id 파라미터가 필요합니다.' },
                { status: 400 }
            );
        }

        const orderItemIdNumber = parseInt(order_item_id, 10);
        console.log("🔍 파싱된 orderItemIdNumber:", orderItemIdNumber);

        if (isNaN(orderItemIdNumber)) {
            // console.log("❌ 유효하지 않은 order_item_id"); // [DEBUG 주석처리]
            return NextResponse.json(
                { error: '유효하지 않은 order_item_id입니다.' },
                { status: 400 }
            );
        }

    // console.log("📦 주문 품 ID:", orderItemIdNumber); // [DEBUG 주석처리]
        console.log("🔄 getOrderItemFromBackend 함수 호출 시작");
        const orderItemData = await getOrderItemFromBackend(orderItemIdNumber);
    // console.log("🎉 주문 품 조회 완료:", orderItemData); // [DEBUG 주석처리]

        return NextResponse.json(orderItemData);
    } catch (error) {
        console.error("💥 주문 품 조회 중 에러:", error);
        return NextResponse.json(
            { error: `주문 품 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
            { status: 500 }
        );
    }
} 