import { FinishEdgeCount } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useEffect, useState } from "react";

interface UseFinishValidationProps {
  depth: number | null;
  height: number | null;
  depthIncrease: number | null;
  heightIncrease: number | null;
  edgeCount: FinishEdgeCount | null;
}

export function useFinishValidation({
  depth,
  height,
  depthIncrease,
  heightIncrease,
  edgeCount,
}: UseFinishValidationProps) {
  const [depthError, setDepthError] = useState<string>("");
  const [heightError, setHeightError] = useState<string>("");
  const [edgeCountError, setEdgeCountError] = useState<string>("");

  // 깊이 유효성 검사 (finish_base_depth + finish_additional_depth)
  useEffect(() => {
    const totalDepth = (depth || 0) + (depthIncrease || 0);
    const totalHeight = (height || 0) + (heightIncrease || 0);

    if (totalDepth > 0) {
      if (totalDepth < 1) {
        setDepthError("깊이 합계는 최소 1mm 이상이어야 합니다.");
      } else if (totalDepth > 99999) {
        setDepthError("깊이 합계는 최대 99999mm 이하여야 합니다.");
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
      } else if (totalHeight > 99999) {
        setHeightError("높이 합계는 최대 99999mm 이하여야 합니다.");
      } else {
        setHeightError("");
      }
    } else {
      setHeightError("");
    }
  }, [height, heightIncrease, depth, depthIncrease]);

  // 엣지 면 수 유효성 검사
  useEffect(() => {
    if (edgeCount === null) {
      setEdgeCountError("엣지 면 수를 선택해주세요.");
    } else {
      setEdgeCountError("");
    }
  }, [edgeCount]);

  // 폼 유효성 검사
  const isFormValid = () => {
    return depth === null || height === null || edgeCount === null || !!depthError || !!heightError;
  };

  return {
    depthError,
    heightError,
    edgeCountError,
    isFormValid,
  };
}
