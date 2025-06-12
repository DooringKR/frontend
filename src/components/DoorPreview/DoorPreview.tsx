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
                    }} />
            </div>

        </div>
    ));

    // input height
    const inputHeight = (
        <div>
            <input
                placeholder="높이"
            // 필요시 value/onChange 추가
            />
        </div>
    );

    // 문 사각형
    const rectangle = (
        <div className="w-full h-full rounded-[4px] bg-red-500" />
    );

    // 방향에 따라 순서 결정
    const mainRow =
        boringDirection === "left" ? (
            <>
                <div className="flex flex-col w-[125px] pr-[12px]">{boringInputs}</div>
                <div className="w-[125px]">{rectangle}</div>
                <div className="w-[125px] pl-[12px]">{inputHeight}</div>
            </>
        ) : (
            <>
                <div className="w-[125px] pr-[12px]">{inputHeight}</div>
                <div className="w-[125px]">{rectangle}</div>
                <div className="flex flex-col w-[125px] pl-[12px]">{boringInputs}</div>
            </>
        );

    return (
        <div className="flex flex-col w-[375px] justify-center items-center">
            <div className="flex w-full h-[250px]">
                {mainRow}
            </div>
            {/* input width */}
            <div className="flex justify-center mt-2">
                <input
                    className="w-20 border rounded text-center"
                    placeholder="폭"
                // 필요시 value/onChange 추가
                />
            </div>
        </div>
    );
};

export default DoorPreview;
