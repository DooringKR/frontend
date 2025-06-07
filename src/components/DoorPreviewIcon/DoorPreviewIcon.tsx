import React from "react";

interface DoorPreviewIconProps {
  DoorType: "일반문" | "플랩문";
  FatOrTall: "Fat" | "Tall" | "Same";
  BoringDirection: "left" | "right";
  BoringNum: 2 | 3 | 4; // 보어링 개수는 2, 3, 4 중 하나
}

const DoorPreviewIcon: React.FC<DoorPreviewIconProps> = ({
  DoorType,
  FatOrTall,
  BoringDirection,
  BoringNum,
}) => {
  // 문 크기 결정
  const getDimensions = () => {
    switch (FatOrTall) {
      case "Fat":
        return { width: 60, height: 36 };
      case "Tall":
        return { width: 36, height: 60 };
      case "Same":
        return { width: 60, height: 60 };
      default:
        console.warn(`Unexpected FatOrTall value: ${FatOrTall}`);
        return { width: 60, height: 60 };
    }
  };

  const { width, height } = getDimensions();

  // 보어링 위치 하드코딩
  const getBoringPositions = () => {
    switch (`${FatOrTall}-${DoorType}-${BoringNum}`) {
      // 일반문
      case "Same-일반문-2":
      case "Tall-일반문-2":
        return [
          { cx: BoringDirection === "left" ? 6.5 : width - 6.5, cy: 16.5 },
          { cx: BoringDirection === "left" ? 6.5 : width - 6.5, cy: height - 16.5 },
        ];
      case "Same-일반문-3":
      case "Tall-일반문-3":
        return [
          { cx: BoringDirection === "left" ? 6.5 : width - 6.5, cy: 13 },
          { cx: BoringDirection === "left" ? 6.5 : width - 6.5, cy: height / 2 },
          { cx: BoringDirection === "left" ? 6.5 : width - 6.5, cy: height - 13 },
        ];
      case "Same-일반문-4":
      case "Tall-일반문-4":
        return [
          { cx: BoringDirection === "left" ? 6.5 : width - 6.5, cy: 10.5 },
          { cx: BoringDirection === "left" ? 6.5 : width - 6.5, cy: 23.5 },
          { cx: BoringDirection === "left" ? 6.5 : width - 6.5, cy: height - 23.5 },
          { cx: BoringDirection === "left" ? 6.5 : width - 6.5, cy: height - 10.5 },
        ];
      case "Fat-일반문-2":
        return [
          { cx: BoringDirection === "left" ? 8.5 : width - 8.5, cy: 8.5 },
          { cx: BoringDirection === "left" ? 8.5 : width - 8.5, cy: height - 8.5 },
        ];
      case "Fat-일반문-3":
        return [
          { cx: BoringDirection === "left" ? 8.5 : width - 8.5, cy: 7 },
          { cx: BoringDirection === "left" ? 8.5 : width - 8.5, cy: height / 2 },
          { cx: BoringDirection === "left" ? 8.5 : width - 8.5, cy: height - 7 },
        ];
      case "Fat-일반문-4":
        return [
          { cx: BoringDirection === "left" ? 8.5 : width - 8.5, cy: 6 },
          { cx: BoringDirection === "left" ? 8.5 : width - 8.5, cy: 14 },
          { cx: BoringDirection === "left" ? 8.5 : width - 8.5, cy: height - 14 },
          { cx: BoringDirection === "left" ? 8.5 : width - 8.5, cy: height - 6 },
        ];
      // 플랩문
      case "Tall-플랩문-2":
        return [
          { cx: 8.5, cy: BoringDirection === "left" ? 8.5 : height - 8.5 },
          { cx: width - 8.5, cy: BoringDirection === "left" ? 8.5 : height - 8.5 },
        ];
      case "Tall-플랩문-3":
        return [
          { cx: 7.5, cy: BoringDirection === "left" ? 8.5 : height - 8.5 },
          { cx: width / 2, cy: BoringDirection === "left" ? 8.5 : height - 8.5 },
          { cx: width - 7.5, cy: BoringDirection === "left" ? 8.5 : height - 8.5 },
        ];
      case "Tall-플랩문-4":
        return [
          { cx: 6, cy: BoringDirection === "left" ? 8.5 : height - 8.5 },
          { cx: 14, cy: BoringDirection === "left" ? 8.5 : height - 8.5 },
          { cx: width - 14, cy: BoringDirection === "left" ? 8.5 : height - 8.5 },
          { cx: width - 6, cy: BoringDirection === "left" ? 8.5 : height - 8.5 },
        ];
      case "Same-플랩문-2":
      case "Fat-플랩문-2":
        return [
          { cx: 16.5, cy: BoringDirection === "left" ? 6.5 : height - 6.5 },
          { cx: width - 16.5, cy: BoringDirection === "left" ? 6.5 : height - 6.5 },
        ];
      case "Same-플랩문-3":
      case "Fat-플랩문-3":
        return [
          { cx: 11, cy: BoringDirection === "left" ? 6.5 : height - 6.5 },
          { cx: width / 2, cy: BoringDirection === "left" ? 6.5 : height - 6.5 },
          { cx: width - 11, cy: BoringDirection === "left" ? 6.5 : height - 6.5 },
        ];
      case "Same-플랩문-4":
      case "Fat-플랩문-4":
        return [
          { cx: 10.5, cy: BoringDirection === "left" ? 6.5 : height - 6.5 },
          { cx: 23.5, cy: BoringDirection === "left" ? 6.5 : height - 6.5 },
          { cx: width - 23.5, cy: BoringDirection === "left" ? 6.5 : height - 6.5 },
          { cx: width - 10.5, cy: BoringDirection === "left" ? 6.5 : height - 6.5 },
        ];
      default:
        console.warn(`Unexpected combination: ${FatOrTall}-${DoorType}-${BoringNum}`);
        return [];
    }
  };

  const boringPositions = getBoringPositions();

  // SVG 렌더링
  return (
    <div className="flex h-[60px] w-[60px] items-center justify-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={2}
          fill="rgba(247, 247, 237, 1)" // #F7F7ED을 rgba로 변환
          stroke="rgba(3, 7, 18, 0.4)" // stroke 투명도 40%
          strokeWidth={1}
        />
        {boringPositions.map((pos, idx) => (
          <circle
            key={idx}
            cx={pos.cx}
            cy={pos.cy}
            r={2.5}
            fill="#FFFFFF"
            stroke="rgba(3, 7, 18, 0.4)" // stroke 투명도 40%
            strokeWidth={1}
          />
        ))}
      </svg>
    </div>
  );
};

export default DoorPreviewIcon;
