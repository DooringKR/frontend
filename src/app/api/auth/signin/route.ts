import { NextResponse } from 'next/server';

interface SignInRequestBody {
  phoneNumber: string;
}

interface SignInResponse {
  user_id: number;
  message: string;
}

async function requestSignin(signInData: SignInRequestBody) {
  console.log("🔐 백엔드 로그인 요청 시작:", signInData);

  try {
    // 전화번호에서 하이픈 제거하여 11자리 숫자만 추출
    const cleanPhoneNumber = signInData.phoneNumber.replace(/-/g, "");

    // 백엔드 필드명으로 변경
    const backendData = {
      user_phone: cleanPhoneNumber
    };

    console.log("📱 정리된 전화번호:", cleanPhoneNumber);

    const response = await fetch(`https://dooring-backend.onrender.com/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendData),
      credentials: 'include',
    });

    console.log("📡 백엔드 응답 상태:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 백엔드 로그인 실패:", response.status, response.statusText, errorText);
      throw new Error(`로그인 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data: SignInResponse = await response.json();
    console.log("✅ 백엔드 로그인 성공:", data);

    return data;
  } catch (error) {
    console.error("🔍 백엔드 요청 중 네트워크 에러:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  console.log("🚀 /api/auth/signin POST 요청 시작");

  try {
    const body = await request.json();
    console.log("📝 요청 바디:", body);

    const data = await requestSignin(body);
    console.log("🎉 로그인 처리 완료:", data);

    // 백엔드 응답 구조 확인
    if (!data || typeof data.user_id !== 'number') {
      console.error("⚠️ 백엔드 응답에 user_id가 없음:", data);
      return NextResponse.json(
        { error: '백엔드 응답 형식이 올바르지 않습니다.' },
        { status: 500 }
      );
    }

    const nextResponse = NextResponse.json(data);
    return nextResponse;
  } catch (error) {
    console.error("💥 로그인 처리 중 에러:", error);
    return NextResponse.json(
      { error: `로그인 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
      { status: 500 }
    );
  }
}
