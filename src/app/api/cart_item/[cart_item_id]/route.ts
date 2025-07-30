import { NextRequest, NextResponse } from "next/server";

async function deleteCartItemFromBackend(cartItemId: number) {
  console.log("🗑️ 백엔드에서 장바구니 아이템 삭제:", cartItemId);

  const response = await fetch(`https://dooring-backend.onrender.com/cart_item/${cartItemId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  console.log("📡 백엔드 응답 상태:", response.status, response.statusText);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("해당 장바구니 아이템이 존재하지 않습니다.");
    }
    throw new Error("장바구니 아이템 삭제 실패");
  }

  console.log("✅ 백엔드 장바구니 아이템 삭제 성공");
  return true;
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ cart_item_id: string }> },
) {
  console.log("🚀 /api/cart_item/[cart_item_id] DELETE 요청 시작");

  try {
    const resolvedParams = await params;
    const cartItemId = parseInt(resolvedParams.cart_item_id);
    console.log("📝 요청된 cart_item_id:", cartItemId);

    if (isNaN(cartItemId)) {
      return NextResponse.json({ error: "유효하지 않은 cart_item_id입니다." }, { status: 400 });
    }

    await deleteCartItemFromBackend(cartItemId);
    console.log("🎉 장바구니 아이템 삭제 완료");

    return NextResponse.json({ message: "장바구니 아이템이 삭제되었습니다." });
  } catch (error) {
    console.error("💥 장바구니 아이템 삭제 중 에러:", error);

    if (error instanceof Error && error.message.includes("존재하지 않습니다")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "장바구니 아이템 삭제 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// ✅ 장바구니 아이템 수정 요청
async function updateCartItemInBackend(cartItemId: number, body: any) {
  console.log("🔄 백엔드에 장바구니 아이템 수정 요청:", cartItemId, body);

  const response = await fetch(`https://dooring-backend.onrender.com/cart_item/${cartItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(body),
    body: JSON.stringify({
      item_count: Number(body.item_count),
      item_options: body.item_options,
    }),
  });

  console.log("📡 백엔드 응답 상태:", response.status, response.statusText);

  if (!response.ok) {
    const text = await response.text();
    console.error("❌ 백엔드 에러 응답 내용:", text);
    throw new Error(`백엔드 요청 실패: ${response.status}`);
  }

  const data = await response.json();
  console.log("✅ 장바구니 수정 성공:", data);
  return data;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ cart_item_id: string }> },
) {
  console.log("🚀 /api/cart_item/[cart_item_id] PUT 요청 시작");

  try {
    const resolvedParams = await params;
    const cartItemId = parseInt(resolvedParams.cart_item_id);
    // const cartItemId = parseInt(params.cart_item_id);
    //  const cartItemId = parseInt(params.cart_item_id);
    if (isNaN(cartItemId)) {
      return NextResponse.json({ error: "유효하지 않은 cart_item_id입니다." }, { status: 400 });
    }

    const body = await request.json();

    console.log("🔥 받은 body:", body);
    console.log("🔥 typeof item_count:", typeof body.item_count, body.item_count); // 여기!
    if (!body.item_options || typeof body.item_count !== "number") {
      return NextResponse.json(
        { error: "item_options와 item_count가 필요합니다." },
        { status: 400 },
      );
    }

    const result = await updateCartItemInBackend(cartItemId, body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("💥 장바구니 아이템 수정 중 에러:", error);
    return NextResponse.json(
      { error: "장바구니 아이템 수정 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
