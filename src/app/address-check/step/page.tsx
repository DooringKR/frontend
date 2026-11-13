import SearchAddressPage from "@/app/address-check/_components/SearchAddressPage";
import { Loading } from "@/components/state/StateViews";
import { Suspense } from "react";
function AddressCheckPage() {
    return (
        <Suspense fallback={<Loading />}>
            <SearchAddressPage />
        </Suspense>
    );
}

export default AddressCheckPage
