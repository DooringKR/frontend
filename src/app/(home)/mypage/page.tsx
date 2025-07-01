import { Suspense } from "react";

import MyPageClient from "./MyPageClient";

function MyPage() {
  return (
    <Suspense fallback={null}>
      <MyPageClient />
    </Suspense>
  );
}

export default MyPage;
