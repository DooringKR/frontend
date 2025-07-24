import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📩 order_item 요청 도착:", body); // ✅ 여기에 로그 추가

    const response = await fetch(`https://dooring-backend.onrender.com/order_item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("백엔드 order_item 생성 실패:", errorText);
      return NextResponse.json({ message: "order_item 생성 실패" }, { status: 500 });
    }

    const result = await response.json();
    console.log("✅ 백엔드 order_item 응답:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("order_item API 라우터 에러:", error);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
