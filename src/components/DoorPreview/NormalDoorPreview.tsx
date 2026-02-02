import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";

import { DOOR_COLOR_LIST } from "../../constants/colorList";
import BoringInputField from "../Input/BoringInputField";
import { Chip } from "../Chip/Chip";
import { HingeDirection } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";

interface NormalDoorPreviewProps {
  DoorWidth?: number | null; // 가로 길이 (비워서 전달 가능)
  DoorHeight?: number | null; // 세로 길이 (비워서 전달 가능)
  boringDirection: HingeDirection;
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
  // 컨테이너 너비 측정을 위한 ref와 state
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(375); // 기본값

  // 컨테이너 너비 측정
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // 현재 포커스된 보어링 입력 필드 인덱스
  const [focusedBoringIndex, setFocusedBoringIndex] = React.useState<number | null>(null);

  // 동적 컨테이너 높이 먼저 계산
  const fixedWidth = containerWidth / 3;
  const actualWidth = DoorWidth || 600;
  const actualHeight = DoorHeight || 1200;
  const heightRatio = actualHeight / actualWidth;
  const calculatedHeight = fixedWidth * heightRatio;
  const minHeight = fixedWidth * 1.5;
  const maxHeight = fixedWidth * 2.0;
  const containerHeight = Math.max(minHeight, Math.min(calculatedHeight, maxHeight));

  // 보어링 input의 높이를 동적 컨테이너 높이 기준으로 계산
  const boringHeight = containerHeight / boringNum;

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

  // 보링 input 배열 생성 - 보링 원 위치와 일치
  const boringInputs = Array.from({ length: boringNum }).map((_, idx) => {
    // 보링 원과 동일한 위치 계산
    const startY = 30;
    const endY = containerHeight - 30;
    const y = startY + idx * ((endY - startY) / (boringNum - 1));

    return (
      <div
        key={idx}
        style={{
          position: "absolute",
          top: `${y - 20}px`, // 입력 필드 중심을 보링 원과 맞춤
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}
        className="relative flex items-center justify-center"
      >
        <div className="flex items-center w-full">
          <BoringInputField
            placeholder="보링(mm)"
            value={adjustedBoringSize[idx] ?? null}
            onChange={value => handleBoringInputChange(idx, value)}
            onFocus={() => setFocusedBoringIndex(idx)}
            onBlur={() => setFocusedBoringIndex(null)}
          />
        </div>
      </div>
    );
  });

  // input height (세로 길이는 더 이상 옆에 표시하지 않음)
  // Todo: boringDirection에 따라 좌우 정렬 달라져야 함
  const inputHeight = null; // 사용하지 않음

  // Next.js Image로 문짝 미리보기 그리기
  const DoorImage = (() => {
    // 실제 컨테이너 너비에서 가로 길이 계산
    const fixedWidth = containerWidth / 3; // 1/3 영역
    const doorWidth = fixedWidth;

    // doorColor에 해당하는 이미지 URL 찾기
    const colorImage = doorColor
      ? DOOR_COLOR_LIST.find(color => color.name === doorColor)?.image
      : null;

    return (

      <div
        style={{
          width: "100%",
          height: `${containerHeight}px`, // 외부에서 계산한 containerHeight 사용
          position: "relative",
          overflow: "visible",
          display: "flex",
          alignItems: "flex-start", // 상단 정렬로 변경
          justifyContent: "center",
          maxWidth: "100%",
        }}
      >
        <div
          style={{
            width: `${Math.max(doorWidth, 60)}px`,
            maxWidth: "100%",
            height: `${containerHeight}px`,
            position: "relative",
            overflow: "visible",
            minWidth: "60px",
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
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: doorColor || "#E5E7EB",
                border: "2px solid #111827", // border-gray-900
              }}
            />
          )}

          {/* 보어링 위치 표시 */}
          {Array.from({ length: boringNum }).map((_, index) => {
            // boringDirection에 따라 보어링 위치 조정
            const boringOffset = 15; // 보어링이 문짝 가장자리에서 떨어진 거리
            const centerX = boringDirection === HingeDirection.LEFT ? boringOffset : doorWidth - boringOffset;

            const startY = 30;
            const endY = containerHeight - 30;
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
                        boringDirection === HingeDirection.LEFT
                          ? `${centerX + 12}px` // 좌경: 보어링 오른쪽에 화살표
                          : `${centerX - 12}px`, // 우경: 보어링 왼쪽에 화살표
                      top:
                        index === boringNum - 1 || (boringNum === 4 && index === 2)
                          ? `${y}px`
                          : "10px", // 맨 아래 보링과 4개일 때 3번째는 해당 위치에서 시작, 나머지는 최상단에서 시작
                      width: "2px",
                      height:
                        index === boringNum - 1 || (boringNum === 4 && index === 2)
                          ? `${containerHeight - y - 10}px`
                          : `${y - 10}px`, // 맨 아래 보링과 4개일 때 3번째는 아래쪽으로, 나머지는 위쪽으로
                      background:
                        index === boringNum - 1 || (boringNum === 4 && index === 2)
                          ? "linear-gradient(to top, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.6))"
                          : "linear-gradient(to bottom, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.6))",
                      zIndex: 5,
                    }}
                  >
                    {/* 화살표 머리 */}
                    <div
                      style={{
                        position: "absolute",
                        bottom:
                          index === boringNum - 1 || (boringNum === 4 && index === 2)
                            ? "auto"
                            : "-6px",
                        top:
                          index === boringNum - 1 || (boringNum === 4 && index === 2)
                            ? "-6px"
                            : "auto",
                        left: "-3px",
                        width: "0",
                        height: "0",
                        borderTop:
                          index === boringNum - 1 || (boringNum === 4 && index === 2)
                            ? "none"
                            : "6px solid rgba(239, 68, 68, 0.6)",
                        borderBottom:
                          index === boringNum - 1 || (boringNum === 4 && index === 2)
                            ? "6px solid rgba(239, 68, 68, 0.6)"
                            : "none",
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                      }}
                    />
                  </div>
                )}

                {/* 툴팁 */}
                {isFocused && (
                  <div
                    style={{
                      position: "absolute",
                      left:
                        boringDirection === HingeDirection.LEFT
                          ? `${centerX + 30}px` // 좌경: 화살표 오른쪽에 툴팁
                          : `${centerX - 150}px`, // 우경: 화살표 왼쪽에 툴팁 (더 왼쪽으로)
                      top: `${y - 15}px`,
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
                    {index === boringNum - 1 || (boringNum === 4 && index === 2)
                      ? "아래를 기준으로\n작성해주세요!"
                      : "위를 기준으로\n작성해주세요!"}
                    {/* 툴팁 화살표 */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: boringDirection === HingeDirection.LEFT ? "-4px" : "auto",
                        right: boringDirection === HingeDirection.LEFT ? "auto" : "-4px",
                        transform: "translateY(-50%)",
                        width: "0",
                        height: "0",
                        borderTop: "4px solid transparent",
                        borderBottom: "4px solid transparent",
                        borderLeft:
                          boringDirection === HingeDirection.LEFT ? "none" : "4px solid rgba(0, 0, 0, 0.8)",
                        borderRight:
                          boringDirection === HingeDirection.LEFT ? "4px solid rgba(0, 0, 0, 0.8)" : "none",
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
              border: "2px solid #111827", // border-2 border-gray-900
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

    );
  })();



  // 방향에 따른 3컬럼 구조 결정
  const mainRow =
    boringDirection === HingeDirection.LEFT ? (
      <>
        {/* 좌경첩: 보링 입력 | 이미지 | 빈 곳 */}
        <div className="relative flex items-start justify-center pr-3">
          {boringInputs}
        </div>
        <div className="flex items-start justify-center">{DoorImage}</div>
        <div className="flex items-start justify-center"></div>
      </>
    ) : (
      <>
        {/* 우경첩: 빈 곳 | 이미지 | 보링 입력 */}
        <div className="flex items-start justify-center"></div>
        <div className="flex items-start justify-center">{DoorImage}</div>
        <div className="relative flex items-start justify-center pl-3">
          {boringInputs}
        </div>
      </>
    );

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center justify-center">
      <div className="grid grid-cols-3 w-full" style={{ height: `${containerHeight}px` }}>{mainRow}</div>
      {/* 가로/세로 길이를 이미지 아래에 Chip으로 표시 */}
      {(DoorWidth !== undefined && DoorWidth !== null && DoorWidth !== 0) ||
        (DoorHeight !== undefined && DoorHeight !== null && DoorHeight !== 0) ? (
        <div className="flex w-full justify-center pt-3 gap-4">
          {DoorWidth !== undefined && DoorWidth !== null && DoorWidth !== 0 && (
            <div className="flex items-center gap-2">
              <Chip text="가로" color="gray" weight="weak" />
              <div className="text-[17px]">
                <span className="font-500 text-gray-800">{DoorWidth}</span>
              </div>
            </div>
          )}
          {DoorHeight !== undefined && DoorHeight !== null && DoorHeight !== 0 && (
            <div className="flex items-center gap-2">
              <Chip text="세로" color="gray" weight="weak" />
              <div className="text-[17px]">
                <span className="font-500 text-gray-800">{DoorHeight}</span>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default NormalDoorPreview;
