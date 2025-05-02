import { NextResponse } from 'next/server';

interface SignInRequestBody {
  phoneNumber: string;
}

interface SignInResponse {
  isRegistered: boolean;
  accessToken?: string;
}

async function requestSignin(signInData: SignInRequestBody) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signInData),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('로그인 요청 실패');
  }

  const data: SignInResponse = await response.json();
  const setCookieHeader = response.headers.get('set-cookie');

  return { data, setCookieHeader };
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, setCookieHeader } = await requestSignin(body);

  const nextResponse = NextResponse.json(data);

  if (data.isRegistered) {
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
  }

  return nextResponse;
}
