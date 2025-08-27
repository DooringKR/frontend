import { NextResponse } from 'next/server';

async function getOrderFromBackend(orderId: string) {
    console.log("📋 백엔드에서 주문 조회 요청:", orderId);

    const url = `https://dooring-backend.onrender.com/order/${orderId}`;
    console.log("🌐 요청 URL:", url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        console.log("📡 백엔드 응답 상태:", response.status, response.statusText);
        console.log("📡 백엔드 응답 헤더:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ 백엔드 주문 조회 실패:", response.status, response.statusText, errorText);
            console.error("🔍 요청 URL:", url);
            console.error("🔍 요청 헤더:", { 'Content-Type': 'application/json' });
            throw new Error(`주문 조회 실패: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ 백엔드 주문 조회 성공:", data);

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
    { params }: { params: Promise<{ order_id: string }> }
) {
    console.log("🔍 요청 URL:", request.url);
    console.log("🔍 파라미터:", params);

    try {
        const { order_id } = await params;
        console.log("🔍 추출된 order_id:", order_id);

        if (!order_id) {
            console.log("❌ order_id 파라미터가 없음");
            return NextResponse.json(
                { error: 'order_id 파라미터가 필요합니다.' },
                { status: 400 }
            );
        }

        console.log("📦 주문 ID:", order_id);
        console.log("🔄 getOrderFromBackend 함수 호출 시작");
        const orderData = await getOrderFromBackend(order_id);
        console.log("🎉 주문 조회 완료:", orderData);

        return NextResponse.json(orderData);
    } catch (error) {
        console.error("💥 주문 조회 중 에러:", error);
        return NextResponse.json(
            { error: `주문 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
            { status: 500 }
        );
    }
} 