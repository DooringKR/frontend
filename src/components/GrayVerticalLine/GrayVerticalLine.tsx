interface GrayVerticalLineProps {
  isExpanded?: boolean;
  expandedMinHeight?: string; // 확장되었을 때의 최소 높이 (예: "120px", "200px")
}

function GrayVerticalLine({
  isExpanded = false,
  expandedMinHeight = "120px",
}: GrayVerticalLineProps) {
  return (
    <div
      className={`mx-2 w-[4px] rounded-[9999px] bg-gray-200 ${
        isExpanded ? "h-full min-h-[48px]" : "h-full min-h-[48px]"
      }`}
      style={isExpanded ? { minHeight: expandedMinHeight } : undefined}
    />
  );
}

export default GrayVerticalLine;
