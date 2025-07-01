import { Suspense } from "react";

import AddressPageClient from "./AddressCheckPageClient";

function AddressPage() {
  return (
    <Suspense fallback={null}>
      <AddressPageClient />
    </Suspense>
  );
}

export default AddressPage;
