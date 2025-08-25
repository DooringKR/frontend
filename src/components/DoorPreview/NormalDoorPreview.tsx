import Image from "next/image";
import React from "react";

import { DOOR_COLOR_LIST } from "../../constants/colorList";
import BoringInputField from "../Input/BoringInputField";

interface NormalDoorPreviewProps {
  DoorWidth: number | null; // 가로 길이, null 경우 입력 필요
  DoorHeight: number | null; // 세로 길이, null 경우 입력 필요
  boringDirection: "left" | "right";
  boringNum: 2 | 3 | 4; // 보어링 개수는 2, 3, 4 중 하나
  boringSize: (number | null)[];
  onChangeBoringSize?: (sizes: (number | null)[]) => void;
  doorColor?: string; // 문짝 색깔 (선택적)
}

const NormalDoorPreview: React.FC<NormalDoorPreviewProps> = ({
  DoorWidth,
  DoorHeight,
  boringDirection,
  boringNum,
  boringSize,
  onChangeBoringSize,
  doorColor,
}) => {
  // 현재 포커스된 보어링 입력 필드 인덱스
  const [focusedBoringIndex, setFocusedBoringIndex] = React.useState<number | null>(null);
  // 보어링 input의 높이 계산
  const boringHeight = 260 / boringNum;

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

  // 보어링 input 배열 생성
  const boringInputs = Array.from({ length: boringNum }).map((_, idx) => (
    <div
      key={idx}
      style={{ height: `${boringHeight}px` }} // style로 직접 높이 지정
      className="relative flex items-center justify-center"
    >
      <div className="max-w-[125px]">
        <BoringInputField
          placeholder="보링(mm)"
          value={adjustedBoringSize[idx] ?? null}
          onChange={value => handleBoringInputChange(idx, value)}
          onFocus={() => setFocusedBoringIndex(idx)}
          onBlur={() => setFocusedBoringIndex(null)}
        />
      </div>
    </div>
  ));

  // input height
  // Todo: boringDirection에 따라 좌우 정렬 달라져야 함
  const inputHeight = (
    <div className={`flex h-full flex-col items-center justify-center`}>
      <div className="w-full text-center text-[17px]">
        {DoorHeight !== undefined && DoorHeight !== null && DoorHeight !== 0 ? (
          <span className="font-500 text-gray-800">{DoorHeight}mm</span>
        ) : (
          <span className="font-600 text-gray-300">입력 필요</span>
        )}
      </div>
      <div className="text-center text-[14px] font-500 text-gray-400">세로</div>
    </div>
  );

  // Next.js Image로 문짝 미리보기 그리기
  const DoorImage = (() => {
    // 세로 길이 고정
    const fixedHeight = 260;

    // 실제 문짝 크기 (입력값이 없으면 기본값 사용)
    const actualWidth = DoorWidth || 600;
    const actualHeight = DoorHeight || 1200;

    // 비율 계산 (가로/세로)
    const widthRatio = actualWidth / actualHeight;

    // 가로 길이 계산 (세로 고정 기준)
    const doorWidth = Math.min(fixedHeight * widthRatio, 200); // 최대 200px로 제한
    const doorHeight = fixedHeight;

    // doorColor에 해당하는 이미지 URL 찾기
    const colorImage = doorColor
      ? DOOR_COLOR_LIST.find(color => color.name === doorColor)?.image
      : null;

    return (
      <div
        style={{
          width: `${doorWidth}px`,
          height: `${doorHeight}px`,
          position: "relative",
          borderRadius: "8px",
          border: "2px solid #E5E7EB",
          overflow: "hidden",
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
          // boringDirection에 따라 보어링 위치 조정
          const boringOffset = 15; // 보어링이 문짝 가장자리에서 떨어진 거리
          const centerX = boringDirection === "left" ? boringOffset : doorWidth - boringOffset;

          const startY = 30;
          const endY = doorHeight - 30;
          const y = startY + index * ((endY - startY) / (boringNum - 1));

          const isFocused = focusedBoringIndex === index;

          return (
            <div key={index}>
              {/* 보어링 원형 */}
              <div
                style={{
                  position: "absolute",
                  left: `${centerX - (isFocused ? 6 : 4)}px`,
                  top: `${y - (isFocused ? 6 : 4)}px`,
                  width: `${isFocused ? 12 : 8}px`,
                  height: `${isFocused ? 12 : 8}px`,
                  backgroundColor: isFocused ? "#EF4444" : "#3B82F6",
                  border: `2px solid ${isFocused ? "#DC2626" : "#1E40AF"}`,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease-in-out",
                  boxShadow: isFocused ? "0 0 8px rgba(239, 68, 68, 0.5)" : "none",
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

              {/* 문짝 내부 화살표 가이드 */}
              {isFocused && (
                <div
                  style={{
                    position: "absolute",
                    left:
                      boringDirection === "left"
                        ? `${centerX + 12}px` // 좌경: 보어링 오른쪽에 화살표
                        : `${centerX - 12}px`, // 우경: 보어링 왼쪽에 화살표
                    top: "10px", // 문짝 최상단에서 시작
                    width: "2px",
                    height: `${y - 10}px`, // 최상단부터 보어링 위치까지의 높이
                    background:
                      "linear-gradient(to bottom, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.6))",
                    zIndex: 5,
                  }}
                >
                  {/* 화살표 머리 */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-6px",
                      left: "-3px",
                      width: "0",
                      height: "0",
                      borderTop: "6px solid rgba(239, 68, 68, 0.6)",
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
  })();

  // 동적 너비 계산
  const doorContainerWidth = Math.min(260 * ((DoorWidth || 600) / (DoorHeight || 1200)), 200);

  // 방향에 따라 순서 결정
  const mainRow =
    boringDirection === "left" ? (
      <>
        <div className="flex w-[125px] flex-col pr-[12px]">{boringInputs}</div>
        <div style={{ width: `${doorContainerWidth}px` }}>{DoorImage}</div>
        <div className="flex w-[125px] items-end pl-[12px]">{inputHeight}</div>
      </>
    ) : (
      <>
        <div className="flex w-[125px] items-start pr-[12px]">{inputHeight}</div>
        <div style={{ width: `${doorContainerWidth}px` }}>{DoorImage}</div>
        <div className="flex w-[125px] flex-col pl-[12px]">{boringInputs}</div>
      </>
    );

  return (
    <div className="flex w-[375px] flex-col items-center justify-center">
      <div className="flex h-[260px] w-full">{mainRow}</div>
      {/* input width */}
      <div className="flex w-full flex-col justify-center pt-3">
        <div className="w-full text-center text-[17px]">
          {DoorWidth !== undefined && DoorWidth !== null && DoorWidth !== 0 ? (
            <span className="font-500 text-gray-800">{DoorWidth}mm</span>
          ) : (
            <span className="font-600 text-gray-300">입력 필요</span>
          )}
        </div>
        <div className="text-center text-[14px] font-500 text-gray-400">가로</div>
      </div>
    </div>
  );
};

export default NormalDoorPreview;
