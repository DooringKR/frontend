import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("access-token")?.value;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/user`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json();

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const accessToken = request.cookies.get("access-token")?.value;
  const body = await request.json();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/user`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return NextResponse.json(data);
}
