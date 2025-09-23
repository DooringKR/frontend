import { useEffect, useState } from "react";

interface UseDoorValidationProps {
  DoorWidth: number | null;
  DoorHeight: number | null;
  hinge: (number | null)[];
  boringNum: 2 | 3 | 4;
}

export function useDoorValidation({
  DoorWidth,
  DoorHeight,
  hinge,
  boringNum,
}: UseDoorValidationProps) {
  const [widthError, setWidthError] = useState<string>("");
  const [heightError, setHeightError] = useState<string>("");
  const [boringError, setBoringError] = useState<string>("");

  // 가로/세로 길이 유효성 검사 (일반문만)
  useEffect(() => {
    // 가로 길이 검사
    if (DoorWidth !== null) {
      if (DoorWidth < 1) {
        setWidthError("가로 길이는 최소 1mm 이상이어야 합니다.");
      } else if (DoorWidth > 1220) {
        setWidthError("가로 길이는 최대 1220mm 이하여야 합니다.");
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
      } else if (DoorHeight > 2440) {
        setHeightError("세로 길이는 최대 2440mm 이하여야 합니다.");
      } else {
        setHeightError("");
      }
    } else {
      setHeightError("");
    }
  }, [DoorWidth, DoorHeight]);

  // 보링 위치 유효성 검사 (일반문만)
  useEffect(() => {
    if (hinge.length > 0 && DoorHeight !== null) {
      const [firstHinge, secondHinge, thirdHinge, fourthHinge] = hinge;

      let errorMessage = "";

      // 일반문 보링 검증
      switch (boringNum) {
        case 2:
          if (firstHinge !== null && secondHinge !== null) {
            if (firstHinge + secondHinge >= DoorHeight) {
              errorMessage = "상단 경첩과 하단 경첩의 합이 문 높이보다 작아야 합니다.";
            }
          }
          break;

        case 3:
          if (firstHinge !== null && secondHinge !== null && thirdHinge !== null) {
            if (firstHinge >= secondHinge) {
              errorMessage = "상단 경첩은 중간 경첩보다 작아야 합니다.";
            } else if (secondHinge + thirdHinge >= DoorHeight) {
              errorMessage = "중간 경첩과 하단 경첩의 합이 문 높이보다 작아야 합니다.";
            }
          }
          break;

        case 4:
          if (
            firstHinge !== null &&
            secondHinge !== null &&
            thirdHinge !== null &&
            fourthHinge !== null
          ) {
            if (firstHinge >= secondHinge) {
              errorMessage = "상단 경첩은 중상 경첩보다 작아야 합니다.";
            } else if (secondHinge + thirdHinge >= DoorHeight) {
              errorMessage = "중상 경첩과 중하 경첩의 합이 문 높이보다 작아야 합니다.";
            } else if (thirdHinge <= fourthHinge) {
              errorMessage = "하단 경첩은 중하 경첩보다 작아야 합니다.";
            }
          }
          break;
      }

      setBoringError(errorMessage);
    } else {
      setBoringError("");
    }
  }, [hinge, boringNum, DoorHeight]);

  // 일반문 유효성 검사
  const isFormValid = () => {
    return (
      DoorWidth === null ||
      DoorHeight === null ||
      hinge.some(v => v === null) ||
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
