import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access-token")?.value;
    const body = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const res = await fetch(`${baseUrl}/api/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { success: false, message: errorData.message || "주문 실패" },
        { status: res.status },
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("주문 서버 에러:", error);
    return NextResponse.json(
      { success: false, message: "서버에서 주문 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
