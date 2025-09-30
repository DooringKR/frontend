import { Suspense } from "react";

import VehicleClientPage from "./VehicleClient";

export default function VehiclePage() {
  return (
    <Suspense fallback={"로딩중..."}>
      <VehicleClientPage />
    </Suspense>
  );
}
