"use client";

import { LONG_DOOR_COLOR_LIST } from "dooring-core-domain/dist/constants/color";
import { useRouter } from "next/navigation";

import ColorScreen from "@/app/(home)/(build-material)/door/color/_components/ColorScreen";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";

export default function LongDoorColorPage() {
    const router = useRouter();
    return (
        <>
            <InitAmplitude />
            <ColorScreen title="롱문 색상을 선택해주세요" colors={LONG_DOOR_COLOR_LIST} onNext={() => router.push("/longdoor")} />
        </>
    );
}
