/** GET /api/pay/<token> — 결제창이 닫힌 뒤 화면이 결제 상태를 다시 묻는다(어드민이 포트원에 확인, lib/pay). */
import { fetchPay } from "@/lib/pay";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { status, body } = await fetchPay((await params).token);
  return Response.json(body, { status });
}
