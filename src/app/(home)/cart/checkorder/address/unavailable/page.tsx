import { Suspense } from "react";

import UnavailableClientPage from "./UnavailableClient";

export default function UnavailablePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <UnavailableClientPage />
    </Suspense>
  );
}
