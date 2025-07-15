import React from "react";
import Image from "next/image";

import BoringInputField from "../Input/BoringInputField";

interface FlapDoorPreviewProps {
    DoorWidth: number | null; // 가로 길이, null 경우 입력 필요
    DoorHeight: number | null; // 세로 길이, null 경우 입력 필요
    boringNum: 2 | 3 | 4; // 보어링 개수는 2, 3, 4 중 하나
    boringSize: (number | null)[];
    onChangeBoringSize?: (sizes: (number | null)[]) => void;
}

const FlapDoorPreview: React.FC<FlapDoorPreviewProps> = ({
    DoorWidth,
    DoorHeight,
    boringNum,
    boringSize,
    onChangeBoringSize,
}) => {

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

    // 문 사각형
    const DoorImage = (
        <Image
            src={`/img/door-preview/FlapDoorPreviewBadgeB${boringNum}.png`}
            alt="door"
            width={260}
            height={130}
            style={{
                width: "260px",
                height: "130px",
                objectFit: "contain",
            }}
        />
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
                    <div className="w-[260px] h-[130px] flex items-center justify-center">
                        {DoorImage}
                    </div>
                </div>

                {/* 오른쪽 컬럼: 세로 길이 */}
                <div className="flex flex-col pt-[66.5px] pl-[12px] items-center justify-center">
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
            <div className="flex flex-col gap-2 w-full min-w-[375px]">
                {Array.from({ length: boringNum }, (_, idx) => (
                    <div key={idx} className="flex flex-row items-center gap-3">
                        {/* 번호 표시 */}
                        <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500 text-[14px]/[20px] font-500 text-white">
                            {idx + 1}
                        </div>
                        {/* 입력 필드 */}
                        <div className="max-w-[125px]">
                            <BoringInputField
                                value={adjustedBoringSize[idx] ?? null}
                                onChange={(value) => handleBoringInputChange(idx, value)}
                                placeholder="보링 치수 입력"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlapDoorPreview;
