import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";

import { DOOR_COLOR_LIST } from "../../constants/colorList";
import BoringInputField from "../Input/BoringInputField";
import { Chip } from "../Chip/Chip";

interface PairDoorPreviewProps {
  DoorWidth: number | null; // 가로 길이, null 경우 입력 필요
  DoorHeight: number | null; // 세로 길이, null 경우 입력 필요
  boringNum: 2 | 3 | 4 | null; // 보어링 개수는 2, 3, 4 중 하나, null일 때는 보링을 표시하지 않음
  boringSize: (number | null)[];
  onChangeBoringSize?: (sizes: (number | null)[]) => void;
  doorColor?: string; // 문짝 색깔 (선택적)
  isPreviewOnly?: boolean; // true일 때는 입력 필드를 렌더링하지 않음
}

const PairDoorPreview: React.FC<PairDoorPreviewProps> = ({
  DoorWidth,
  DoorHeight,
  boringNum,
  boringSize,
  onChangeBoringSize,
  doorColor,
  isPreviewOnly = false,
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
  
  // 문짝 크기 계산
  const fixedWidth = containerWidth / 3; // 1/3 영역 (각 문짝용)
  const singleDoorWidth = DoorWidth || 600;
  const actualHeight = DoorHeight || 1200;
  const heightRatio = actualHeight / singleDoorWidth;
  
  // 세로 길이 계산 및 제한
  const calculatedHeight = fixedWidth * heightRatio;
  const minHeight = fixedWidth * 1.5;
  const maxHeight = fixedWidth * 2.0;
  const doorHeight = Math.max(minHeight, Math.min(calculatedHeight, maxHeight));
  const singleDoorWidthDisplay = fixedWidth;
  
  // 보어링 input의 높이를 동적 문짝 높이 기준으로 계산 (boringNum이 null이 아닐 때만)
  const boringHeight = boringNum ? doorHeight / boringNum : 0;

  // boringSize 변경 핸들러
  const handleBoringInputChange = (idx: number, value: number | null) => {
    if (!onChangeBoringSize || !boringNum) return;

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
    if (!boringNum || !boringSize || boringSize.length !== boringNum) {
      return boringNum ? Array.from({ length: boringNum }, (_, i) => boringSize?.[i] ?? null) : [];
    }
    return boringSize;
  }, [boringSize, boringNum]);

  // 보링 input 배열 생성 - 보링 원 위치와 일치 (isPreviewOnly이거나 boringNum이 null일 때는 입력 필드 렌더링하지 않음)
  const boringInputs = (isPreviewOnly || !boringNum) ? [] : Array.from({ length: boringNum }).map((_, idx) => {
    // 보링 원과 동일한 위치 계산
    const startY = 30;
    const endY = doorHeight - 30;
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
        <div className="flex items-center w-full pl-3">
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

  // 단일 문짝 생성 함수
  const createSingleDoor = (doorWidth: number, doorHeight: number, isLeft: boolean) => {
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
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: doorColor || "#F9FAFB",
            }}
          />
        )}

        {/* 보어링 위치 표시 - boringNum이 null이 아닐 때만 */}
        {boringNum && Array.from({ length: boringNum }).map((_, index) => {
          // 양문에서는 좌측문은 왼쪽 가장자리, 우측문은 오른쪽 가장자리에 보링 위치
          const boringOffset = 15; // 보어링이 문짝 가장자리에서 떨어진 거리
          const centerX = isLeft ? boringOffset : doorWidth - boringOffset; // 좌측문은 왼쪽 가장자리, 우측문은 오른쪽 가장자리

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
                    left: isLeft
                      ? `${centerX + 12}px` // 좌측문: 보어링 오른쪽에 화살표
                      : `${centerX - 12}px`, // 우측문: 보어링 왼쪽에 화살표
                    top:
                      index === boringNum - 1 || (boringNum === 4 && index === 2)
                        ? `${y}px`
                        : "10px", // 맨 아래 보링과 4개일 때 3번째는 해당 위치에서 시작, 나머지는 최상단에서 시작
                    width: "2px",
                    height:
                      index === boringNum - 1 || (boringNum === 4 && index === 2)
                        ? `${doorHeight - y - 10}px`
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

              {/* 툴팁은 컴포넌트 레벨에서 통합 표시 */}
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
    );
  };

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center justify-center">
      {/* 문짝 및 보링 그리드 (높이 고정) */}
      <div className="grid grid-cols-3 w-full items-start justify-center" style={{ height: `${doorHeight}px`, position: "relative" }}>
        {/* 문 1 (좌측 문짝) */}
        <div className="flex items-start justify-center">
          {createSingleDoor(singleDoorWidthDisplay, doorHeight, true)}
        </div>
        {/* 문 2 (우측 문짝) */}
        <div className="flex items-start justify-center">
          {createSingleDoor(singleDoorWidthDisplay, doorHeight, false)}
        </div>
        {/* 보링 입력 필드 */}
        <div className="relative flex items-start justify-center">
          {boringInputs}
        </div>
        
        {/* 통합 툴팁 - 포커스된 보링이 있을 때만 표시 (isPreviewOnly가 아니고 boringNum이 있을 때만) */}
        {!isPreviewOnly && boringNum && focusedBoringIndex !== null && (() => {
          // 포커스된 보링의 Y 위치 계산
          const startY = 30;
          const endY = doorHeight - 30;
          const focusedY = startY + focusedBoringIndex * ((endY - startY) / (boringNum - 1));
          
          return (
            <div
              style={{
                position: "absolute",
                left: "33.33%", // 첫 번째와 두 번째 컬럼 사이 (두 문짝 사이)
                top: `${focusedY - 15}px`, // 포커스된 보링의 Y 위치에 맞춤
                transform: "translateX(-50%)",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "8px 20px", // 패딩을 늘려서 더 넓게
                borderRadius: "6px",
                fontSize: "12px",
                whiteSpace: "pre-line",
                textAlign: "center",
                zIndex: 15,
                pointerEvents: "none",
                width: "210px", // 말풍선을 더 넓게 확장
              }}
            >
              {focusedBoringIndex === boringNum - 1 || (boringNum === 4 && focusedBoringIndex === 2)
                ? "아래를 기준으로\n작성해주세요!"
                : "위를 기준으로\n작성해주세요!"}
              
              {/* 좌측 보링을 가리키는 꼬리 */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "-6px",
                  transform: "translateY(-50%)",
                  width: "0",
                  height: "0",
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderRight: "6px solid rgba(0, 0, 0, 0.8)",
                }}
              />
              
              {/* 우측 보링을 가리키는 꼜리 */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "-6px",
                  transform: "translateY(-50%)",
                  width: "0",
                  height: "0",
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  borderLeft: "6px solid rgba(0, 0, 0, 0.8)",
                }}
              />
            </div>
          );
        })()}
      </div>

      {/* 가로 길이 치수선 - grid 밖에서 렌더링 (왼쪽 문짝 아래) */}
      {DoorWidth && DoorWidth > 0 && (
        <div className="grid grid-cols-3 w-full mt-3">
          {/* 첫 번째 컬럼 - 왼쪽 문짝과 동일한 위치 */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center" style={{ width: `${singleDoorWidthDisplay}px`, position: 'relative' }}>
              {/* 가로선과 화살표 */}
              <div
                style={{
                  position: "absolute",
                  left: "6px",
                  top: "0px",
                  width: `${singleDoorWidthDisplay - 12}px`,
                  height: "2px",
                  background: "linear-gradient(to right, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.6))",
                  zIndex: 5,
                }}
              >
                {/* 좌측 화살표 머리 - 선의 시작점(왼쪽 끝)에 배치 */}
                <div
                  style={{
                    position: "absolute",
                    left: "-6px",
                    top: "-3px",
                    width: "0",
                    height: "0",
                    borderLeft: "none",
                    borderRight: "6px solid rgba(239, 68, 68, 0.6)",
                    borderTop: "4px solid transparent",
                    borderBottom: "4px solid transparent",
                  }}
                />
                {/* 우측 화살표 머리 - 선의 끝점(오른쪽 끝)에 배치 */}
                <div
                  style={{
                    position: "absolute",
                    right: "-6px",
                    top: "-3px",
                    width: "0",
                    height: "0",
                    borderRight: "none",
                    borderLeft: "6px solid rgba(239, 68, 68, 0.6)",
                    borderTop: "4px solid transparent",
                    borderBottom: "4px solid transparent",
                  }}
                />
              </div>
              
              {/* 텍스트 */}
              <div 
                style={{ 
                  marginTop: "8px",
                  fontSize: "16px",
                  color: "#EF4444",
                  fontFamily: "Pretendard, Arial",
                  fontWeight: "500",
                }}
              >
                {DoorWidth}mm
              </div>
            </div>
          </div>
          {/* 두 번째, 세 번째 컬럼은 비워둠 */}
          <div></div>
          <div></div>
        </div>
      )}
      
      {/* 가로/세로 길이를 이미지 아래에 Chip으로 표시 (grid 밖에서 자연스럽게 배치) */}
      <div className="flex w-full justify-center pt-3 gap-4">
        <div className="flex items-center gap-2">
          <Chip text="가로" color="gray" weight="weak" />
          <div className="text-[17px]">
            {DoorWidth !== undefined && DoorWidth !== null && DoorWidth !== 0 ? (
              <span className="font-500 text-gray-800">{DoorWidth * 2}mm ({DoorWidth} × 2)</span>
            ) : (
              <span className="font-600 text-gray-300">입력 필요</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Chip text="세로" color="gray" weight="weak" />
          <div className="text-[17px]">
            {DoorHeight !== undefined && DoorHeight !== null && DoorHeight !== 0 ? (
              <span className="font-500 text-gray-800">{DoorHeight}mm</span>
            ) : (
              <span className="font-600 text-gray-300">입력 필요</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PairDoorPreview;