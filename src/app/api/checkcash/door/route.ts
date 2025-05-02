import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/checkcash/door`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return NextResponse.json(data);
}
