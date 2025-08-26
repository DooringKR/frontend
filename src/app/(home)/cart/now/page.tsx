import { Suspense } from "react";

import PurchaseClientPage from "./PurchaseClient";

export default function PurchasePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PurchaseClientPage />
    </Suspense>
  );
}
