import { NextResponse } from 'next/server';

interface CartItem {
    cart_item_id: number;
    product_type: "DOOR" | "FINISH" | "CABINET" | "HARDWARE" | "ACCESSORY";
    unit_price: number;
    item_count: number;
    item_options: Record<string, any>;
}

interface CartResponse {
    cart_id: number;
    user_id: number;
    cart_count: number;
    items: CartItem[];
}

async function getCartItemsFromBackend(userId: number) {
    console.log("🛒 백엔드에서 장바구니 아이템 조회:", userId);

    const response = await fetch(`https://dooring-backend.onrender.com/cart/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('장바구니 아이템 조회 실패');
    }

    const data = await response.json();
    console.log("✅ 백엔드 장바구니 아이템 조회 성공:", data);
    return data;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ user_id: string }> }
) {
    console.log("🚀 /api/cart/[user_id]/items GET 요청 시작");

    try {
        const resolvedParams = await params;
        const userId = parseInt(resolvedParams.user_id);
        console.log("📝 요청된 user_id:", userId);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: '유효하지 않은 user_id입니다.' },
                { status: 400 }
            );
        }

        const cartItems = await getCartItemsFromBackend(userId);
        console.log("🎉 장바구니 아이템 조회 완료:", cartItems);

        return NextResponse.json(cartItems);
    } catch (error) {
        console.error("💥 장바구니 아이템 조회 중 에러:", error);
        return NextResponse.json(
            { error: '장바구니 아이템 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 