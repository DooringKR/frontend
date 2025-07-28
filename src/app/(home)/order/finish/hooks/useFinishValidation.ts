import { useEffect, useState } from "react";

interface UseFinishValidationProps {
  depth: number | null;
  height: number | null;
  depthIncrease: number | null;
  heightIncrease: number | null;
}

export function useFinishValidation({
  depth,
  height,
  depthIncrease,
  heightIncrease,
}: UseFinishValidationProps) {
  const [depthError, setDepthError] = useState<string>("");
  const [heightError, setHeightError] = useState<string>("");

  // 깊이 유효성 검사 (finish_base_depth + finish_additional_depth)
  useEffect(() => {
    const totalDepth = (depth || 0) + (depthIncrease || 0);
    const totalHeight = (height || 0) + (heightIncrease || 0);

    if (totalDepth > 0) {
      if (totalDepth < 1) {
        setDepthError("깊이 합계는 최소 1mm 이상이어야 합니다.");
      } else if (totalHeight >= 1221 && totalDepth > 1220) {
        setDepthError("높이 길이가 1221mm 이상일 때는 깊이 합계가 최대 1220mm 이하여야 합니다.");
      } else if (totalDepth > 2440) {
        setDepthError("깊이 합계는 최대 2440mm 이하여야 합니다.");
      } else {
        setDepthError("");
      }
    } else {
      setDepthError("");
    }
  }, [depth, depthIncrease, height, heightIncrease]);

  // 높이 유효성 검사 (finish_base_height + finish_additional_height)
  useEffect(() => {
    const totalHeight = (height || 0) + (heightIncrease || 0);
    const totalDepth = (depth || 0) + (depthIncrease || 0);

    if (totalHeight > 0) {
      if (totalHeight < 1) {
        setHeightError("높이 합계는 최소 1mm 이상이어야 합니다.");
      } else if (totalDepth >= 1221 && totalHeight > 1220) {
        setHeightError("깊이 길이가 1221mm 이상일 때는 높이 합계가 최대 1220mm 이하여야 합니다.");
      } else if (totalHeight > 2440) {
        setHeightError("높이 합계는 최대 2440mm 이하여야 합니다.");
      } else {
        setHeightError("");
      }
    } else {
      setHeightError("");
    }
  }, [height, heightIncrease, depth, depthIncrease]);

  // 폼 유효성 검사
  const isFormValid = () => {
    return depth === null || height === null || !!depthError || !!heightError;
  };

  return {
    depthError,
    heightError,
    isFormValid,
  };
}
