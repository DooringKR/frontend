export async function POST(req: Request) {
  const { start, goal } = await req.json();

  const res = await fetch(
    `https://maps.apigw.ntruss.com/map-direction/v1/driving?start=${start.lon},${start.lat}&goal=${goal.lon},${goal.lat}`,
    {
      method: "GET",
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID!,
        "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET!,
      },
    }
  );

  const data = await res.json();

  try {
    const durationInMs = data.route.traoptimal[0].summary.duration;
    const durationInMinutes = Math.round(durationInMs / 1000 / 60);
    return Response.json({ minutes: durationInMinutes });
  } catch (e) {
    return new Response(JSON.stringify({ error: "경로 데이터를 파싱할 수 없습니다." }), {
      status: 500,
    });
  }
}
