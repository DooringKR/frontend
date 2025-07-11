// app/api/coordinates/route.ts
export async function POST(req: Request) {
  const { address } = await req.json();

  const res = await fetch(
    `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`,
    {
      method: "GET",
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID!,
        "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET!,
      },
    },
  );
  console.log(process.env.NAVER_CLIENT_ID, process.env.NAVER_CLIENT_SECRET);
  const data = await res.json();
  console.log("📍 Naver 응답:", data); // ✅ 이거 추가
  if (!data.addresses?.[0]) {
    return new Response(JSON.stringify({ error: "주소를 찾을 수 없습니다." }), { status: 400 });
  }

  const { x, y } = data.addresses[0];
  return Response.json({ lat: parseFloat(y), lon: parseFloat(x) });
}
