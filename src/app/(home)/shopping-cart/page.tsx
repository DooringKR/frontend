import { redirect } from "next/navigation";

/** 옛 장바구니 주소 — 앱 안 링크는 없고 sitemap 에만 남아 있어 지금 장바구니(/cart)로 보낸다 */
export default function ShoppingCartPage() {
  redirect("/cart");
}
