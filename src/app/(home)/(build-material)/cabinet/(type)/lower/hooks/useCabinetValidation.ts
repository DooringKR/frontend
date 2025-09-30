import { useEffect, useState } from "react";

interface UseCabinetValidationProps {
  DoorWidth: number | null;
  DoorHeight: number | null;
  DoorDepth: number | null;
}

export function useCabinetValidation({
  DoorWidth,
  DoorHeight,
  DoorDepth,
}: UseCabinetValidationProps) {
  const [widthError, setWidthError] = useState<string>("");
  const [heightError, setHeightError] = useState<string>("");
  const [depthError, setDepthError] = useState<string>("");

  // 가로/세로/깊이 길이 유효성 검사
  useEffect(() => {
    // 가로 길이 검사
    if (DoorWidth !== null) {
      if (DoorWidth < 1) {
        setWidthError("가로 길이는 최소 1mm 이상이어야 합니다.");
      } else if (DoorWidth > 9999) {
        setWidthError("가로 길이는 최대 9999mm 이하여야 합니다.");
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
      } else if (DoorHeight > 9999) {
        setHeightError("세로 길이는 최대 9999mm 이하여야 합니다.");
      } else {
        setHeightError("");
      }
    } else {
      setHeightError("");
    }

    // 깊이 검사
    if (DoorDepth !== null) {
      if (DoorDepth < 1) {
        setDepthError("깊이는 최소 1mm 이상이어야 합니다.");
      } else if (DoorDepth > 9999) {
        setDepthError("깊이는 최대 9999mm 이하여야 합니다.");
      } else {
        setDepthError("");
      }
    } else {
      setDepthError("");
    }
  }, [DoorWidth, DoorHeight, DoorDepth]);

  // 폼 유효성 검사
  const isFormValid = () => {
    return (
      DoorWidth === null ||
      DoorHeight === null ||
      DoorDepth === null ||
      !!widthError ||
      !!heightError ||
      !!depthError
    );
  };

  return {
    widthError,
    heightError,
    depthError,
    isFormValid,
  };
}
