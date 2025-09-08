export type SvgPart = {
  d: string;
  fill: string;
  stroke?: string;
  strokeWidth?: string;
  strokeLinejoin?: string;
};

export type DimTextPosition = { x: number; y: number; anchor: 'start' | 'middle' | 'end' };

export type DoorDimensions = {
  verticalPos: DimTextPosition;
  horizontalPos: DimTextPosition;
  boringTextPos?: DimTextPosition[]; // 일부만 사용
};

export type ColorProps = { [key: string]: string }; // 예: { right: "url(#...)", top: "#ccc", ... }

export type Size = {
  width: number;
  height: number;
};