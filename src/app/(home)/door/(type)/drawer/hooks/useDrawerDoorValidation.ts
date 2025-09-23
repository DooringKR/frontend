import { useEffect, useState } from "react";

interface UseDrawerDoorValidationProps {
    DoorWidth: number | null;
    DoorHeight: number | null;
}

export function useDrawerDoorValidation({
    DoorWidth,
    DoorHeight,
}: UseDrawerDoorValidationProps) {
    const [widthError, setWidthError] = useState<string>("");
    const [heightError, setHeightError] = useState<string>("");

    // 가로/세로 길이 유효성 검사 (서랍만)
    useEffect(() => {
        // 가로 길이 검사
        if (DoorWidth !== null) {
            if (DoorWidth < 1) {
                setWidthError("가로 길이는 최소 1mm 이상이어야 합니다.");
            } else if (DoorHeight !== null && DoorHeight >= 1221 && DoorWidth > 1220) {
                setWidthError("세로 길이가 1221mm 이상일 때는 가로 길이가 최대 1220mm 이하여야 합니다.");
            } else if (DoorWidth > 2440) {
                setWidthError("가로 길이는 최대 2440mm 이하여야 합니다.");
            } else {
                setWidthError("");
            }
        } else {
            setWidthError("");
        }

        // 세로 길이 검사
        if (DoorHeight !== null) {
            if (DoorHeight < 1) {
                setHeightError("세로 길이는 최소 1mm 이상이어야 합니다.");
            } else if (DoorWidth !== null && DoorWidth >= 1221 && DoorHeight > 1220) {
                setHeightError("가로 길이가 1221mm 이상일 때는 세로 길이가 최대 1220mm 이하여야 합니다.");
            } else if (DoorHeight > 2440) {
                setHeightError("세로 길이는 최대 2440mm 이하여야 합니다.");
            } else {
                setHeightError("");
            }
        } else {
            setHeightError("");
        }
    }, [DoorWidth, DoorHeight]);

    // 서랍 유효성 검사
    const isFormValid = () => {
        return (
            DoorWidth === null ||
            DoorHeight === null ||
            !!widthError ||
            !!heightError
        );
    };

    return {
        widthError,
        heightError,
        isFormValid,
    };
} 