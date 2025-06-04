import SearchAddressPage from "@/app/address-check/_components/SearchAddressPage";
import { Suspense } from "react";
function AddressCheckPage() {
    return (
        <Suspense fallback={<div />}>
            <SearchAddressPage />
        </Suspense>
    );
}

export default AddressCheckPage