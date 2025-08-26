import Image from "next/image";
import React from "react";

import { DOOR_COLOR_LIST } from "../../constants/colorList";
import BoringInputField from "../Input/BoringInputField";

interface FlapDoorPreviewProps {
  DoorWidth: number | null; // 가로 길이, null 경우 입력 필요
  DoorHeight: number | null; // 세로 길이, null 경우 입력 필요
  boringNum: 2 | 3 | 4; // 보어링 개수는 2, 3, 4 중 하나
  boringSize: (number | null)[];
  onChangeBoringSize?: (sizes: (number | null)[]) => void;
  doorColor?: string; // 문짝 색깔 (선택적)
}

const FlapDoorPreview: React.FC<FlapDoorPreviewProps> = ({
  DoorWidth,
  DoorHeight,
  boringNum,
  boringSize,
  onChangeBoringSize,
  doorColor,
}) => {
  const [focusedBoringIndex, setFocusedBoringIndex] = React.useState<number | null>(null);
  // boringSize 변경 핸들러
  const handleBoringInputChange = (idx: number, value: number | null) => {
    if (!onChangeBoringSize) return;

    const currentBoringSize = boringSize || [];

    const newSizes = [...currentBoringSize];
    newSizes[idx] = value;

    // 배열 길이가 boringNum과 맞지 않으면 조정
    if (newSizes.length !== boringNum) {
      const adjustedSizes = Array.from({ length: boringNum }, (_, i) => newSizes[i] ?? null);
      onChangeBoringSize(adjustedSizes);
    } else {
      onChangeBoringSize(newSizes);
    }
  };

  // boringSize가 boringNum과 맞지 않을 때 조정
  const adjustedBoringSize = React.useMemo(() => {
    if (!boringSize || boringSize.length !== boringNum) {
      return Array.from({ length: boringNum }, (_, i) => boringSize?.[i] ?? null);
    }
    return boringSize;
  }, [boringSize, boringNum]);

  // doorColor에 해당하는 이미지 URL 찾기
  const colorImage = doorColor
    ? DOOR_COLOR_LIST.find(color => color.name === doorColor)?.image
    : null;

  // 실제 문짝 크기 (입력값이 없으면 기본값 사용)
  const actualWidth = DoorWidth || 600;
  const actualHeight = DoorHeight || 1200;

  // 비율 계산 (가로/세로)
  const widthRatio = actualWidth / actualHeight;

  // 플랩문은 가로가 더 긴 형태이므로 가로를 260으로 고정, 세로는 비율에 따라 조정 (최대 650px)
  const doorWidth = 260;
  const doorHeight = Math.min(260 / widthRatio, 650);

  // 문 사각형
  const DoorImage = (
    <div
      style={{
        width: `${doorWidth}px`,
        height: `${doorHeight}px`,
        position: "relative",
        borderRadius: "8px",
        border: "2px solid #E5E7EB",
        overflow: "visible",
      }}
    >
      {/* 문짝 배경 이미지 또는 색상 */}
      {colorImage ? (
        <Image
          src={colorImage}
          alt="door color"
          fill
          style={{
            objectFit: "cover",
            borderRadius: "6px",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: doorColor || "#F9FAFB",
            borderRadius: "6px",
          }}
        />
      )}

      {/* 보어링 위치 표시 */}
      {Array.from({ length: boringNum }).map((_, index) => {
        // 플랩문은 보어링이 상단에 가로로 배열
        const startX = 30; // 시작 위치
        const endX = doorWidth - 30; // 끝 위치
        const boringX = startX + index * ((endX - startX) / (boringNum - 1)); // 가로로 균등 분배
        const boringY = 20; // 상단에서 20px 아래
        const isFocused = focusedBoringIndex === index;

        return (
          <div key={index}>
            {/* Boring Circle */}
            <div
              style={{
                position: "absolute",
                left: `${boringX - 4}px`,
                top: `${boringY - 4}px`,
                width: "8px",
                height: "8px",
                backgroundColor: isFocused ? "#EF4444" : "#3B82F6",
                border: `1px solid ${isFocused ? "#DC2626" : "#1E40AF"}`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "2px",
                  height: "2px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                }}
              />
            </div>

            {/* Arrow Guide */}
            {isFocused && (
              <div
                style={{
                  position: "absolute",
                  left:
                    index === 0 ||
                    (boringNum === 3 && index === 1) ||
                    (boringNum === 4 && index === 1)
                      ? "0px"
                      : `${boringX}px`,
                  top: `${boringY + 12}px`,
                  width:
                    index === 0 ||
                    (boringNum === 3 && index === 1) ||
                    (boringNum === 4 && index === 1)
                      ? `${boringX}px`
                      : `${doorWidth - boringX}px`,
                  height: "2px",
                  background:
                    index === 0 ||
                    (boringNum === 3 && index === 1) ||
                    (boringNum === 4 && index === 1)
                      ? "linear-gradient(to right, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.6))"
                      : "linear-gradient(to left, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.6))",
                  zIndex: 5,
                }}
              >
                {/* Arrow Head */}
                <div
                  style={{
                    position: "absolute",
                    top: "-5px",
                    left:
                      index === 0 ||
                      (boringNum === 3 && index === 1) ||
                      (boringNum === 4 && index === 1)
                        ? "auto"
                        : "-6px",
                    right:
                      index === 0 ||
                      (boringNum === 3 && index === 1) ||
                      (boringNum === 4 && index === 1)
                        ? "-6px"
                        : "auto",
                    width: "0",
                    height: "0",
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft:
                      index === 0 ||
                      (boringNum === 3 && index === 1) ||
                      (boringNum === 4 && index === 1)
                        ? "6px solid rgba(239, 68, 68, 0.6)"
                        : "none",
                    borderRight:
                      index === 0 ||
                      (boringNum === 3 && index === 1) ||
                      (boringNum === 4 && index === 1)
                        ? "none"
                        : "6px solid rgba(239, 68, 68, 0.6)",
                  }}
                />
              </div>
            )}

            {/* Tooltip */}
            {isFocused && (
              <div
                style={{
                  position: "absolute",
                  left:
                    index === 0 ||
                    (boringNum === 3 && index === 1) ||
                    (boringNum === 4 && index === 1)
                      ? "10px"
                      : "auto",
                  right:
                    index === 0 ||
                    (boringNum === 3 && index === 1) ||
                    (boringNum === 4 && index === 1)
                      ? "auto"
                      : "10px",
                  top: `${boringY + 25}px`,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  whiteSpace: "pre-line",
                  width: "120px",
                  textAlign: "center",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              >
                {index === 0 || (boringNum === 3 && index === 1) || (boringNum === 4 && index === 1)
                  ? "왼쪽을 기준으로\n작성해주세요!"
                  : "오른쪽을 기준으로\n작성해주세요!"}
                {/* Tooltip Arrow */}
                <div
                  style={{
                    position: "absolute",
                    top: "-4px",
                    left:
                      index === 0 ||
                      (boringNum === 3 && index === 1) ||
                      (boringNum === 4 && index === 1)
                        ? "20px"
                        : "auto",
                    right:
                      index === 0 ||
                      (boringNum === 3 && index === 1) ||
                      (boringNum === 4 && index === 1)
                        ? "auto"
                        : "20px",
                    width: "0",
                    height: "0",
                    borderTop: "none",
                    borderBottom: "4px solid rgba(0, 0, 0, 0.8)",
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* 문짝 테두리 강조 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: "1px solid #D1D5DB",
          borderRadius: "8px",
          pointerEvents: "none",
        }}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-[22.5px]">
      {/* 가로/세로 길이 + 문 이미지 */}
      <div className="flex justify-between">
        {/* 왼쪽 컬럼: 가로 길이 + 문 이미지 (세로 배치) */}
        <div className="flex flex-col gap-[22.5px]">
          {/* 가로 길이 */}
          <div className="flex flex-col items-center">
            <div className="text-center text-[17px]/[24px] font-500 text-gray-800">
              {DoorWidth !== undefined && DoorWidth !== null && DoorWidth !== 0 ? (
                <span className="text-[17px]/[24px]">{DoorWidth}mm</span>
              ) : (
                <span className="text-gray-300">입력 필요</span>
              )}
            </div>
            <div className="text-center text-[14px]/[20px] font-500 text-gray-400">가로</div>
          </div>

          {/* 문 이미지 */}
          <div
            className="flex items-center justify-center"
            style={{ width: `${doorWidth}px`, height: `${doorHeight}px` }}
          >
            {DoorImage}
          </div>
        </div>

        {/* 오른쪽 컬럼: 세로 길이 */}
        <div className="flex flex-col items-center justify-center pl-[12px] pt-[66.5px]">
          <div className="text-center text-[17px] font-500 text-gray-800">
            {DoorHeight !== undefined && DoorHeight !== null && DoorHeight !== 0 ? (
              <span>{DoorHeight}mm</span>
            ) : (
              <span className="text-gray-300">입력 필요</span>
            )}
          </div>
          <div className="text-center text-[14px] font-500 text-gray-400">세로</div>
        </div>
      </div>

      {/* 보어링 입력 필드들 */}
      <div className="flex w-full min-w-[375px] flex-col gap-2">
        {Array.from({ length: boringNum }, (_, idx) => (
          <div key={idx} className="flex flex-row items-center gap-3">
            {/* 번호 표시 */}
            <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500 text-[14px]/[20px] font-500 text-white">
              {idx + 1}
            </div>
            {/* 입력 필드 */}
            <div className="max-w-[150px]">
              <BoringInputField
                value={adjustedBoringSize[idx] ?? null}
                onChange={value => handleBoringInputChange(idx, value)}
                placeholder="보링 치수 입력(mm)"
                onFocus={() => setFocusedBoringIndex(idx)}
                onBlur={() => setFocusedBoringIndex(null)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlapDoorPreview;
