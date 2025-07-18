import { NextResponse } from 'next/server';

interface SignupRequestBody {
  userType: 'company' | 'factory';
  phoneNumber: string;
}

interface SignupResponse {
  user_id: number;
}

async function requestSignup(signupData: SignupRequestBody): Promise<{ data: SignupResponse } | NextResponse> {
  // 백엔드 형식에 맞게 데이터 변환
  const backendData = {
    user_phone: signupData.phoneNumber,
    user_type: signupData.userType === 'company' ? 'INTERIOR' : 'FACTORY',
  };

  console.log('백엔드로 전송할 데이터:', backendData);

  const response = await fetch(`https://dooring-backend.onrender.com/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backendData),
    credentials: 'include',
  });

  console.log('백엔드 응답 상태:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('백엔드 오류 응답:', errorText);

    // 409 오류는 이미 가입된 회원
    if (response.status === 409) {
      return NextResponse.json(
        { error: '이미 가입된 회원입니다.' },
        { status: 409 }
      );
    }

    throw new Error('회원가입 요청 실패');
  }

  const data: SignupResponse = await response.json();
  console.log('백엔드 응답 데이터:', data);

  return { data };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('받은 요청 데이터:', body);

    const result = await requestSignup(body);

    // NextResponse가 반환된 경우 (에러 상황)
    if (result instanceof NextResponse) {
      return result;
    }

    // 성공한 경우
    return NextResponse.json({ user_id: result.data.user_id });
  } catch (error) {
    console.error('회원가입 API 오류:', error);
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
