interface GrayVerticalLineProps {
  isExpanded?: boolean;
  expandedMinHeight?: string; // 확장되었을 때의 최소 높이 (예: "120px", "200px")
  marginX?: string; // 좌우 마진 (예: "mx-2", "mx-4")
  width?: string; // 너비 (예: "w-[4px]", "w-[2px]")
}

function GrayVerticalLine({
  isExpanded = false,
  expandedMinHeight = "120px",
  marginX = "mx-2",
  width = "w-[4px]",
}: GrayVerticalLineProps) {
  return (
    <div
      className={`${marginX} ${width} rounded-[9999px] bg-gray-200 ${isExpanded ? "h-full min-h-[48px]" : "h-full min-h-[48px]"
        }`}
      style={isExpanded ? { minHeight: expandedMinHeight } : undefined}
    />
  );
}

export default GrayVerticalLine;
