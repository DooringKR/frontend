import { Suspense } from "react";
import CartClient from "./CartClient";

export default function ShoppingCartPage() {
  return (
    <Suspense fallback={<div className="p-5 text-center">로딩 중...</div>}>
      <CartClient />
    </Suspense>
  );
}
