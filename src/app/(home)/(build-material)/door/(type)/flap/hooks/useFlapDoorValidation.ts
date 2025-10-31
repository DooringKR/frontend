import { useEffect, useState } from "react";

interface UseFlapDoorValidationProps {
    DoorWidth: number | null;
    DoorHeight: number | null;
    boringSize: (number | null)[];
    boringNum: 2 | 3 | 4;
}

export function useFlapDoorValidation({
    DoorWidth,
    DoorHeight,
    boringSize,
    boringNum,
}: UseFlapDoorValidationProps) {
    const [widthError, setWidthError] = useState<string>("");
    const [heightError, setHeightError] = useState<string>("");
    const [boringError, setBoringError] = useState<string>("");

    // 가로/세로 길이 유효성 검사 (플랩문만)
    useEffect(() => {
        // 가로 길이 검사
        if (DoorWidth !== null) {
            if (DoorWidth < 1) {
                setWidthError("가로 길이는 최소 1mm 이상이어야 합니다.");
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
            } else if (DoorHeight > 1220) {
                setHeightError("세로 길이는 최대 1220mm 이하여야 합니다.");
            } else {
                setHeightError("");
            }
        } else {
            setHeightError("");
        }
    }, [DoorWidth, DoorHeight]);

    // 보링 위치 유효성 검사 (플랩문만 - 가로 방향)
    useEffect(() => {
        if (boringSize.length > 0 && DoorWidth !== null) {
            let errorMessage = "";

            // null을 임시 값으로 치환
            let firstHinge: number, secondHinge: number, thirdHinge: number, fourthHinge: number;

            // 플랩문 보링 검증 (가로 방향)
            switch (boringNum) {
                case 2:
                    firstHinge = boringSize[0] ?? 1;
                    secondHinge = boringSize[1] ?? 1;
                    
                    if (firstHinge + secondHinge >= DoorWidth) {
                        errorMessage = "좌측 경첩과 우측 경첩의 합이 문 너비보다 작아야 합니다.";
                    }
                    break;

                case 3:
                    firstHinge = boringSize[0] ?? 1;
                    secondHinge = boringSize[1] ?? (firstHinge + 1);
                    thirdHinge = boringSize[2] ?? 1;

                    if (firstHinge >= secondHinge) {
                        errorMessage = "좌측 경첩은 중간 경첩보다 작아야 합니다.";
                    } else if (secondHinge + thirdHinge >= DoorWidth) {
                        errorMessage = "중간 경첩과 우측 경첩의 합이 문 너비보다 작아야 합니다.";
                    }
                    break;

                case 4:
                    firstHinge = boringSize[0] ?? 1;
                    fourthHinge = boringSize[3] ?? 1;
                    secondHinge = boringSize[1] ?? (firstHinge + 1);
                    thirdHinge = boringSize[2] ?? (fourthHinge + 1);

                    if (firstHinge >= secondHinge) {
                        errorMessage = "좌측 경첩은 중좌 경첩보다 작아야 합니다.";
                    } else if (secondHinge + thirdHinge >= DoorWidth) {
                        errorMessage = "중좌 경첩과 중우 경첩의 합이 문 너비보다 작아야 합니다.";
                    } else if (thirdHinge <= fourthHinge) {
                        errorMessage = "우측 경첩은 중우 경첩보다 작아야 합니다.";
                    }
                    break;
            }

            setBoringError(errorMessage);
        } else {
            setBoringError("");
        }
    }, [boringSize, boringNum, DoorWidth]);

    // 플랩문 유효성 검사
    const isFormValid = () => {
        return (
            DoorWidth === null ||
            DoorHeight === null ||
            !!widthError ||
            !!heightError ||
            !!boringError
        );
    };

    return {
        widthError,
        heightError,
        boringError,
        isFormValid,
    };
} 