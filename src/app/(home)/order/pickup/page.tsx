import { Suspense } from "react";
import PickUpClientPage from "./PickUpClient";


export default function PickUpPage() {
    return (
        <Suspense fallback={"로딩중..."}>
            <PickUpClientPage />
        </Suspense>
    );
}
