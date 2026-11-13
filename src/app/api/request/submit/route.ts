/**
 * POST /api/request/submit { orderId } — 상황 주문을 바로키친 어드민으로 넘긴다.
 * 유저의 로그인 토큰(Authorization)을 그대로 실어 /api/barogagu/intake 를 부르고, 응답을 그대로 돌려준다.
 * 어드민이 토큰으로 유저를 확인하고 주문이 그 유저 것인지 본다 — 여기는 전달만 한다.
 */
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN || "https://dooring-admin.vercel.app";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const body = await req.text();
  try {
    const res = await fetch(`${ADMIN_ORIGIN}/api/barogagu/intake`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body,
    });
    return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } });
  } catch {
    return Response.json({ error: "접수 서버에 연결하지 못했습니다." }, { status: 502 });
  }
}
