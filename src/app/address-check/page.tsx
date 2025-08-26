import { Suspense } from "react";

import AddressCheckClientPage from "./AddressCheckClient";

function AddressPage() {
  return (
    <Suspense fallback={null}>
      <AddressCheckClientPage />
    </Suspense>
  );
}

export default AddressPage;
