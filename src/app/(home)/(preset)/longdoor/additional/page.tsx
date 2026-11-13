"use client";

import DoorAdditional from "@/app/(home)/(build-material)/door/_components/DoorAdditional";

export default function LongDoorAdditionalPage() {
    return (
        <DoorAdditional
            screenName="preset_longdoor_additional"
            nextHref="/longdoor/report"
            constructBadge="+30만원"
            confirmNoImage
            trackConfirm={false}
        />
    );
}
