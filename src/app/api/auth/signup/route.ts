import { NextResponse } from 'next/server';

interface SignupRequestBody {
  userType: 'company' | 'factory';
  phoneNumber: string;
}

interface SignupResponse {
  accessToken: string;
}

async function requestSignup(signupData: SignupRequestBody) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signupData),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('회원가입 요청 실패');
  }

  const data: SignupResponse = await response.json();
  const setCookieHeader = response.headers.get('set-cookie');

  return { data, setCookieHeader };
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, setCookieHeader } = await requestSignup(body);

  const nextResponse = NextResponse.json({ success: true });

  if (setCookieHeader) {
    nextResponse.headers.set('set-cookie', setCookieHeader);
  }

  if (data.accessToken) {
    nextResponse.cookies.set('access-token', data.accessToken, {
      secure: true,
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 30,
    });
  }

  return nextResponse;
}
