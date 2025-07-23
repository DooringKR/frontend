import { NextResponse } from 'next/server';

interface SignupRequestBody {
  phoneNumber: string;
  userType: "company" | "factory";
}

interface SignupResponse {
  user_id: number;
  message: string;
}

async function requestSignup(signupData: SignupRequestBody) {
  console.log("🔐 백엔드 회원가입 요청 시작:", signupData);

  try {
    // 전화번호에서 하이픈 제거하여 11자리 숫자만 추출
    const cleanPhoneNumber = signupData.phoneNumber.replace(/-/g, "");

    // 백엔드 필드명으로 변경
    const backendData = {
      user_phone: cleanPhoneNumber,
      user_type: signupData.userType
    };

    console.log("📱 정리된 전화번호:", cleanPhoneNumber);
    console.log("🏢 사용자 타입:", signupData.userType);

    const response = await fetch(`https://dooring-backend.onrender.com/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendData),
      credentials: 'include',
    });

    console.log("📡 백엔드 응답 상태:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 백엔드 회원가입 실패:", response.status, response.statusText, errorText);
      throw new Error(`회원가입 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data: SignupResponse = await response.json();
    console.log("✅ 백엔드 회원가입 성공:", data);

    return data;
  } catch (error) {
    console.error("🔍 백엔드 요청 중 네트워크 에러:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  console.log("🚀 /api/auth/signup POST 요청 시작");

  try {
    const body = await request.json();
    console.log("📝 요청 바디:", body);

    const signupData = await requestSignup(body);
    console.log("🎉 회원가입 처리 완료:", signupData);

    return NextResponse.json(signupData);
  } catch (error) {
    console.error("💥 회원가입 처리 중 에러:", error);
    return NextResponse.json(
      { error: `회원가입 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
      { status: 500 }
    );
  }
}
