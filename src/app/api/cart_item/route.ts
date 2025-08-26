import { NextResponse } from 'next/server';

interface CartItemRequest {
    cart_id: number;
    product_type: "DOOR" | "FINISH" | "CABINET" | "HARDWARE" | "ACCESSORY";
    unit_price: number;
    item_count: number;
    item_options: Record<string, any>;
}

async function addCartItemToBackend(cartItemData: CartItemRequest) {
    console.log("🛒 백엔드 장바구니 아이템 추가 요청:", cartItemData);

    try {
        const response = await fetch(`https://dooring-backend.onrender.com/cart_item`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartItemData),
            credentials: 'include',
        });

        console.log("📡 백엔드 응답 상태:", response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ 백엔드 장바구니 아이템 추가 실패:", response.status, response.statusText, errorText);
            throw new Error(`장바구니 아이템 추가 실패: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ 백엔드 장바구니 아이템 추가 성공:", data);

        return data;
    } catch (error) {
        console.error("🔍 백엔드 요청 중 네트워크 에러:", error);
        throw error;
    }
}

export async function POST(request: Request) {
    console.log("🚀 /api/cart_item POST 요청 시작");

    try {
        const body = await request.json();
        console.log("📝 요청 바디:", body);

        const cartItemData = await addCartItemToBackend(body);
        console.log("🎉 장바구니 아이템 추가 완료:", cartItemData);

        return NextResponse.json(cartItemData);
    } catch (error) {
        console.error("💥 장바구니 아이템 추가 중 에러:", error);
        return NextResponse.json(
            { error: `장바구니 아이템 추가 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
            { status: 500 }
        );
    }
} 