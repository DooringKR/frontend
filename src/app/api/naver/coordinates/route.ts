// app/api/coordinates/route.ts

export async function POST(req: Request) {
  const { address } = await req.json();

  const res = await fetch(
    `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`,
    {
      method: "GET",
      headers: {
        "x-ncp-apigw-api-key-id": process.env.NAVER_CLIENT_ID!,
        "x-ncp-apigw-api-key": process.env.NAVER_CLIENT_SECRET!,
      },
    },
  );
  const data = await res.json();
  // console.log("네이버 API 응답 전체:", data);

  if (!data.addresses?.[0]) {
    return new Response(JSON.stringify({ error: "주소를 찾을 수 없습니다." }), { status: 400 });
  }

  const { x, y } = data.addresses[0];
  return Response.json({ lat: parseFloat(y), lon: parseFloat(x) });
}
