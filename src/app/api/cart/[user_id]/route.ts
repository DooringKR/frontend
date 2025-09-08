import { NextResponse } from 'next/server';

interface CartInfo {
    cart_id: number;
    user_id: number;
    // 필요한 다른 장바구니 정보 필드들 추가
}

async function getCartInfoFromBackend(userId: number) {
    console.log("🔍 백엔드에서 장바구니 정보 조회:", userId);

    const response = await fetch(`https://dooring-backend.onrender.com/cart/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('장바구니 정보 조회 실패');
    }

    const data = await response.json();
    // console.log("✅ 백엔드 장바구니 정보 조회 성공:", data); // [DEBUG 주석처리]
    return data;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ user_id: string }> }
) {
    // console.log("🚀 /api/cart/[user_id] GET 요청 시작"); // [DEBUG 주석처리]

    try {
        const resolvedParams = await params;
        const userId = parseInt(resolvedParams.user_id);
    // console.log("📝 요청된 user_id:", userId); // [DEBUG 주석처리]

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: '유효하지 않은 user_id입니다.' },
                { status: 400 }
            );
        }

        const cartInfo = await getCartInfoFromBackend(userId);
    // console.log("🎉 장바구니 정보 조회 완료:", cartInfo); // [DEBUG 주석처리]

        return NextResponse.json(cartInfo);
    } catch (error) {
        console.error("💥 장바구니 정보 조회 중 에러:", error);
        return NextResponse.json(
            { error: '장바구니 정보 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 