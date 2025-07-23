import { NextResponse } from 'next/server';

async function deleteCartItemFromBackend(cartItemId: number) {
    console.log("🗑️ 백엔드에서 장바구니 아이템 삭제:", cartItemId);

    const response = await fetch(`https://dooring-backend.onrender.com/cart_item/${cartItemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    console.log("📡 백엔드 응답 상태:", response.status, response.statusText);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("해당 장바구니 아이템이 존재하지 않습니다.");
        }
        throw new Error('장바구니 아이템 삭제 실패');
    }

    console.log("✅ 백엔드 장바구니 아이템 삭제 성공");
    return true;
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ cart_item_id: string }> }
) {
    console.log("🚀 /api/cart_item/[cart_item_id] DELETE 요청 시작");

    try {
        const resolvedParams = await params;
        const cartItemId = parseInt(resolvedParams.cart_item_id);
        console.log("📝 요청된 cart_item_id:", cartItemId);

        if (isNaN(cartItemId)) {
            return NextResponse.json(
                { error: '유효하지 않은 cart_item_id입니다.' },
                { status: 400 }
            );
        }

        await deleteCartItemFromBackend(cartItemId);
        console.log("🎉 장바구니 아이템 삭제 완료");

        return NextResponse.json({ message: "장바구니 아이템이 삭제되었습니다." });
    } catch (error) {
        console.error("💥 장바구니 아이템 삭제 중 에러:", error);

        if (error instanceof Error && error.message.includes("존재하지 않습니다")) {
            return NextResponse.json(
                { error: error.message },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: '장바구니 아이템 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 