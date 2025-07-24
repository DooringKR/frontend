import { NextRequest, NextResponse } from "next/server";

interface UserInfo {
  user_id: number;
  user_type: string;
  user_phone: string;
}

async function getUserInfoFromBackend(userId: number) {
  console.log("🔍 백엔드에서 유저 정보 조회:", userId);

  const response = await fetch(`https://dooring-backend.onrender.com/app_user/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    console.error("❌ 백엔드 유저 정보 조회 실패:", response.status, response.statusText);
    throw new Error("유저 정보 조회 실패");
  }

  const data = await response.json();
  console.log("✅ 백엔드 유저 정보 조회 성공:", data);
  return data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string }> },
) {
  console.log("🚀 /api/app_user/[user_id] GET 요청 시작");

  try {
    const { user_id } = await params;
    const userId = parseInt(user_id);
    console.log("📝 요청된 user_id:", userId);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "유효하지 않은 user_id입니다." }, { status: 400 });
    }

    const userInfo = await getUserInfoFromBackend(userId);
    console.log("🎉 유저 정보 조회 완료:", userInfo);

    return NextResponse.json(userInfo);
  } catch (error) {
    console.error("💥 유저 정보 조회 중 에러:", error);
    return NextResponse.json({ error: "유저 정보 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: { user_id: string } }) {
  const userId = parseInt(context.params.user_id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "유효하지 않은 user_id입니다." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { user_road_address, user_detail_address } = body;

    if (!user_road_address || !user_detail_address) {
      return NextResponse.json({ error: "주소 정보가 누락되었습니다." }, { status: 400 });
    }

    const res = await fetch(`https://dooring-backend.onrender.com/app_user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_road_address,
        user_detail_address,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "주소 업데이트 실패" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT 에러:", error);
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}
