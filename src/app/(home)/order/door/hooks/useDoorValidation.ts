import { useEffect, useState } from "react";

interface UseDoorValidationProps {
  DoorWidth: number | null;
  DoorHeight: number | null;
  boringSize: (number | null)[];
  boringNum: 2 | 3 | 4;
  category: string | null | undefined;
}

export function useDoorValidation({
  DoorWidth,
  DoorHeight,
  boringSize,
  boringNum,
  category,
}: UseDoorValidationProps) {
  const [widthError, setWidthError] = useState<string>("");
  const [heightError, setHeightError] = useState<string>("");
  const [boringError, setBoringError] = useState<string>("");

  // 가로/세로 길이 유효성 검사
  useEffect(() => {
    // 가로 길이 검사
    if (DoorWidth !== null) {
      if (DoorWidth < 1) {
        setWidthError("가로 길이는 최소 1mm 이상이어야 합니다.");
      } else if (category === "normal" && DoorWidth > 1220) {
        setWidthError("가로 길이는 최대 1220mm 이하여야 합니다.");
      } else if (category === "flap" && DoorWidth > 2440) {
        setWidthError("가로 길이는 최대 2440mm 이하여야 합니다.");
      } else if (category === "drawer") {
        if (DoorHeight !== null && DoorHeight >= 1221 && DoorWidth > 1220) {
          setWidthError("세로 길이가 1221mm 이상일 때는 가로 길이가 최대 1220mm 이하여야 합니다.");
        } else if (DoorWidth > 2440) {
          setWidthError("가로 길이는 최대 2440mm 이하여야 합니다.");
        } else {
          setWidthError("");
        }
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
      } else if (category === "normal" && DoorHeight > 2440) {
        setHeightError("세로 길이는 최대 2440mm 이하여야 합니다.");
      } else if (category === "flap" && DoorHeight > 1220) {
        setHeightError("세로 길이는 최대 1220mm 이하여야 합니다.");
      } else if (category === "drawer") {
        if (DoorWidth !== null && DoorWidth >= 1221 && DoorHeight > 1220) {
          setHeightError("가로 길이가 1221mm 이상일 때는 세로 길이가 최대 1220mm 이하여야 합니다.");
        } else if (DoorHeight > 2440) {
          setHeightError("세로 길이는 최대 2440mm 이하여야 합니다.");
        } else {
          setHeightError("");
        }
      } else {
        setHeightError("");
      }
    } else {
      setHeightError("");
    }
  }, [DoorWidth, DoorHeight, category]);

  // 보링 위치 유효성 검사 (normal door와 flap door에 적용)
  useEffect(() => {
    if ((category === "normal" || category === "flap") && boringSize.length > 0) {
      const [firstHinge, secondHinge, thirdHinge, fourthHinge] = boringSize;

      let errorMessage = "";

      if (category === "normal" && DoorHeight !== null) {
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
      } else if (category === "flap" && DoorWidth !== null) {
        // 플랩문 보링 검증
        switch (boringNum) {
          case 2:
            if (firstHinge !== null && secondHinge !== null) {
              if (firstHinge + secondHinge >= DoorWidth) {
                errorMessage = "좌측 경첩과 우측 경첩의 합이 문 너비보다 작아야 합니다.";
              }
            }
            break;

          case 3:
            if (firstHinge !== null && secondHinge !== null && thirdHinge !== null) {
              if (firstHinge >= secondHinge) {
                errorMessage = "좌측 경첩은 중간 경첩보다 작아야 합니다.";
              } else if (secondHinge + thirdHinge >= DoorWidth) {
                errorMessage = "중간 경첩과 우측 경첩의 합이 문 너비보다 작아야 합니다.";
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
                errorMessage = "좌측 경첩은 중좌 경첩보다 작아야 합니다.";
              } else if (secondHinge + thirdHinge >= DoorWidth) {
                errorMessage = "중좌 경첩과 중우 경첩의 합이 문 너비보다 작아야 합니다.";
              } else if (thirdHinge <= fourthHinge) {
                errorMessage = "우측 경첩은 중우 경첩보다 작아야 합니다.";
              }
            }
            break;
        }
      }

      setBoringError(errorMessage);
    } else {
      setBoringError("");
    }
  }, [boringSize, boringNum, DoorHeight, DoorWidth, category]);

  // 카테고리별 유효성 검사
  const isFormValid = () => {
    switch (category || "") {
      case "normal":
        return (
          DoorWidth === null ||
          DoorHeight === null ||
          boringSize.some(v => v === null) ||
          !!widthError ||
          !!heightError ||
          !!boringError
        );
      case "flap":
        return (
          DoorWidth === null ||
          DoorHeight === null ||
          boringSize.some(v => v === null) ||
          !!widthError ||
          !!heightError ||
          !!boringError
        );
      case "drawer":
        return DoorWidth === null || DoorHeight === null || !!widthError || !!heightError;
      default:
        return DoorWidth === null || DoorHeight === null || boringSize.some(v => v === null);
    }
  };

  return {
    widthError,
    heightError,
    boringError,
    isFormValid,
  };
}
