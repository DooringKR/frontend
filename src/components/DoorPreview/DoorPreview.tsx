import React from "react";

import BoringInputField from "../Input/BoringInputField";

interface DoorPreviewProps {
  DoorWidth: number;
  DoorHeight: number;
  boringDirection: "left" | "right";
  boringNum: 2 | 3 | 4; // 보어링 개수는 2, 3, 4 중 하나
  boringSize: [];
}

const DoorPreview: React.FC<DoorPreviewProps> = ({
  DoorWidth,
  DoorHeight,
  boringDirection,
  boringNum,
  boringSize,
}) => {
  // 보어링 input의 높이 계산
  const boringHeight = 250 / boringNum;

  // 보어링 input 배열 생성
  const boringInputs = Array.from({ length: boringNum }).map((_, idx) => (
    <div
      key={idx}
      style={{ height: `${boringHeight}px` }} // style로 직접 높이 지정
      className="flex items-center justify-center"
    >
      <div className="max-w-[125px]">
        <BoringInputField
          placeholder="보링"
          value={""}
          onChange={function (value: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  ));

  // input height
  // Todo: boringDirection에 따라 좌우 정렬 달라져야 함
  const inputHeight = (
    <div className={`flex h-full flex-col items-center justify-center`}>
      <input
        placeholder="입력 필요"
        className="w-full text-center outline-none placeholder:text-[17px] placeholder:font-600 placeholder:text-gray-300"
        // 필요시 value/onChange 추가
      />
      <div className="text-center text-[14px] font-500 text-gray-400">세로</div>
    </div>
  );

  // 문 사각형
  const rectangle = <div className="h-full w-full rounded-[4px] bg-red-500" />;

  // 방향에 따라 순서 결정
  const mainRow =
    boringDirection === "left" ? (
      <>
        <div className="flex w-[125px] flex-col pr-[12px]">{boringInputs}</div>
        <div className="w-[125px]">{rectangle}</div>
        <div className="flex w-[125px] items-end pl-[12px]">{inputHeight}</div>
      </>
    ) : (
      <>
        <div className="flex w-[125px] items-start pr-[12px]">{inputHeight}</div>
        <div className="w-[125px]">{rectangle}</div>
        <div className="flex w-[125px] flex-col pl-[12px]">{boringInputs}</div>
      </>
    );

  return (
    <div className="flex w-[375px] flex-col items-center justify-center">
      <div className="flex h-[250px] w-full">{mainRow}</div>
      {/* input width */}
      <div className="flex w-full flex-col justify-center pt-3">
        <input
          placeholder="입력 필요"
          className="text-center outline-none placeholder:text-[17px] placeholder:font-600 placeholder:text-gray-300"
          // 필요시 value/onChange 추가
        />
        <div className="text-center text-[14px] font-500 text-gray-400">가로</div>
      </div>
    </div>
  );
};

export default DoorPreview;
