import React from "react";
import Image from "next/image";

import BoringInputField from "../Input/BoringInputField";

interface DoorPreviewProps {
  DoorWidth: number | null; // 가로 길이, null 경우 입력 필요
  DoorHeight: number | null; // 세로 길이, null 경우 입력 필요
  boringDirection: "left" | "right";
  boringNum: 2 | 3 | 4; // 보어링 개수는 2, 3, 4 중 하나
  boringSize: (number | null)[];
  onChangeBoringSize?: (sizes: (number | null)[]) => void;
}

const DoorPreview: React.FC<DoorPreviewProps> = ({
  DoorWidth,
  DoorHeight,
  boringDirection,
  boringNum,
  boringSize,
  onChangeBoringSize,
}) => {
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
      className="flex items-center justify-center"
    >
      <div className="max-w-[125px]">
        <BoringInputField
          placeholder="보링(mm)"
          value={adjustedBoringSize[idx] ?? null}
          onChange={value => handleBoringInputChange(idx, value)}
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

  // next/image 컴포넌트를 사용하여 오류를 수정합니다.
  const DoorImage = (
    <Image
      src={`/img/door-preview/DoorPreviewB${boringNum}.png`}
      alt="door"
      width={130}
      height={260}
      style={{
        width: "130px",
        height: "260px",
        objectFit: "contain",
        transform: boringDirection === "left" ? "rotate(180deg)" : ""
      }}
    />
  );

  // 방향에 따라 순서 결정
  const mainRow =
    boringDirection === "left" ? (
      <>
        <div className="flex w-[125px] flex-col pr-[12px]">{boringInputs}</div>
        <div className="w-[130px]">{DoorImage}</div>
        <div className="flex w-[125px] items-end pl-[12px]">{inputHeight}</div>
      </>
    ) : (
      <>
        <div className="flex w-[125px] items-start pr-[12px]">{inputHeight}</div>
        <div className="w-[130px]">{DoorImage}</div>
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

export default DoorPreview;
