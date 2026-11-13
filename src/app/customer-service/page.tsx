import { redirect } from "next/navigation";

/** 고객센터(전화·카카오 채널) 화면은 닫았다 — 문의는 주문 흐름으로만 받는다(2026-11-13). 옛 주소로 오면 홈으로 */
export default function CustomerServicePage() {
  redirect("/");
}
