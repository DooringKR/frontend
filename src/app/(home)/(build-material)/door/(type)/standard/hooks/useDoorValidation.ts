import { useEffect, useState } from "react";

interface UseDoorValidationProps {
  DoorWidth: number | null;
  DoorHeight: number | null;
  hinge: (number | null)[];
  boringNum: 2 | 3 | 4 | null;
  hingeDirection: any;  // HingeDirection | null
}

export function useDoorValidation({
  DoorWidth,
  DoorHeight,
  hinge,
  boringNum,
  hingeDirection,
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
    if (hinge.length > 0 && DoorHeight !== null && boringNum !== null) {
      let errorMessage = "";

      // null을 임시 값으로 치환
      let firstHinge: number, secondHinge: number, thirdHinge: number, fourthHinge: number;

      switch (boringNum) {
        case 2:
          firstHinge = hinge[0] ?? 1;
          secondHinge = hinge[1] ?? 1;
          
          if (firstHinge + secondHinge >= DoorHeight) {
            errorMessage = "상단 경첩과 하단 경첩의 합이 문 높이보다 작아야 합니다.";
          }
          break;

        case 3:
          firstHinge = hinge[0] ?? 1;
          secondHinge = hinge[1] ?? (firstHinge + 1);
          thirdHinge = hinge[2] ?? 1;

          if (firstHinge >= secondHinge) {
            errorMessage = "상단 경첩은 중간 경첩보다 작아야 합니다.";
          } else if (secondHinge + thirdHinge >= DoorHeight) {
            errorMessage = "중간 경첩과 하단 경첩의 합이 문 높이보다 작아야 합니다.";
          }
          break;

        case 4:
          firstHinge = hinge[0] ?? 1;
          fourthHinge = hinge[3] ?? 1;
          secondHinge = hinge[1] ?? (firstHinge + 1);
          thirdHinge = hinge[2] ?? (fourthHinge + 1);

          if (firstHinge >= secondHinge) {
            errorMessage = "상단 경첩은 중상 경첩보다 작아야 합니다.";
          } else if (secondHinge + thirdHinge >= DoorHeight) {
            errorMessage = "중상 경첩과 중하 경첩의 합이 문 높이보다 작아야 합니다.";
          } else if (thirdHinge <= fourthHinge) {
            errorMessage = "하단 경첩은 중하 경첩보다 작아야 합니다.";
          }
          break;
      }

      setBoringError(errorMessage);
    } else {
      setBoringError("");
    }
  }, [hinge, boringNum, DoorHeight]);

  // 일반문 유효성 검사 - 경첩 개수와 방향 필수
  // 각각 독립적으로 "모름" 상태 확인
  const isFormValid = () => {
    // 경첩 개수 "모름" 체크 상태 확인
    const isDontKnowCount = hinge.length === 1 && hinge[0] === null;
    // 경첩 방향 "모름" 체크 상태 확인 (UNKNOWN은 문자열 'UNKNOWN')
    const isDontKnowDirection = hingeDirection === 'UNKNOWN';
    
    return (
      DoorWidth === null ||
      DoorHeight === null ||
      (!isDontKnowCount && boringNum === null) ||
      (!isDontKnowDirection && hingeDirection === null) ||
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
