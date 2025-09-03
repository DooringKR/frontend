type GeneralDoorSubtype =
  | '좌경_2보링'
  | '좌경_3보링'
  | '좌경_4보링'
  | '우경_2보링'
  | '우경_3보링'
  | '우경_4보링';

type FlapDoorSubtype = '2보링' | '3보링' | '4보링';

type MaedaSubtype = '마에다1' | '마에다2' | '마에다3';

type Size = { width: number; height: number };

type ColorProps = { doorFill?: string }; // ex: '#D9D9D9' or 'url(#pattern0_6_8)'

type Boring = { cx: number; cy: number; r: number };

type BoringValues = number[];

const SVG_NS = 'http://www.w3.org/2000/svg';

const FONT_SIZE = 50;
const VERTICAL_TEXT_OFFSET = 30;
const HORIZONTAL_TEXT_OFFSET = 20;
const BORING_TEXT_RECT_OFFSET = 30;
const BORING_RADIUS = 22;
const FLAP_BORING_RADIUS = 22;
const FLAP_BORING_TEXT_OFFSET = 30;

// 일반문 사각형, 보링좌표, 치수 텍스트 위치

const DOOR_RECT = { x: 304, y: 154, width: 392, height: 792 };

const GENERAL_DOOR_BORINGS: Record<GeneralDoorSubtype, Boring[]> = {
  '좌경_2보링': [
    { cx: 365, cy: 350, r: BORING_RADIUS },
    { cx: 365, cy: 750, r: BORING_RADIUS },
  ],
  '좌경_3보링': [
    { cx: 365, cy: 283.333, r: BORING_RADIUS },
    { cx: 365, cy: 550, r: BORING_RADIUS },
    { cx: 365, cy: 816.667, r: BORING_RADIUS },
  ],
  '좌경_4보링': [
    { cx: 365, cy: 250, r: BORING_RADIUS },
    { cx: 365, cy: 450, r: BORING_RADIUS },
    { cx: 365, cy: 650, r: BORING_RADIUS },
    { cx: 365, cy: 850, r: BORING_RADIUS },
  ],
  '우경_2보링': [
    { cx: 635, cy: 350, r: BORING_RADIUS },
    { cx: 635, cy: 750, r: BORING_RADIUS },
  ],
  '우경_3보링': [
    { cx: 635, cy: 283.333, r: BORING_RADIUS },
    { cx: 635, cy: 550, r: BORING_RADIUS },
    { cx: 635, cy: 816.667, r: BORING_RADIUS },
  ],
  '우경_4보링': [
    { cx: 635, cy: 250, r: BORING_RADIUS },
    { cx: 635, cy: 450, r: BORING_RADIUS },
    { cx: 635, cy: 650, r: BORING_RADIUS },
    { cx: 635, cy: 850, r: BORING_RADIUS },
  ],
};

type DimTextPosition = { x: number; y: number; anchor: 'start' | 'middle' | 'end' };

type DoorDimensions = {
  verticalPos: DimTextPosition;
  horizontalPos: DimTextPosition;
  boringTextPos: DimTextPosition[];
};

const DOOR_DIMENSION_POSITIONS: Record<GeneralDoorSubtype, DoorDimensions> = {
  // 좌경
  '좌경_2보링': {
    verticalPos: {
      x: DOOR_RECT.x + DOOR_RECT.width + VERTICAL_TEXT_OFFSET,
      y: DOOR_RECT.y + DOOR_RECT.height / 2,
      anchor: 'start',
    },
    horizontalPos: {
      x: DOOR_RECT.x + DOOR_RECT.width / 2,
      y: DOOR_RECT.y + DOOR_RECT.height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
      anchor: 'middle',
    },
    boringTextPos: [
      { x: DOOR_RECT.x - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 350, anchor: 'end' },
      { x: DOOR_RECT.x - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 750, anchor: 'end' },
    ],
  },
  '좌경_3보링': {
    verticalPos: {
      x: DOOR_RECT.x + DOOR_RECT.width + VERTICAL_TEXT_OFFSET,
      y: DOOR_RECT.y + DOOR_RECT.height / 2,
      anchor: 'start',
    },
    horizontalPos: {
      x: DOOR_RECT.x + DOOR_RECT.width / 2,
      y: DOOR_RECT.y + DOOR_RECT.height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
      anchor: 'middle',
    },
    boringTextPos: [
      { x: DOOR_RECT.x - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 283.333, anchor: 'end' },
      { x: DOOR_RECT.x - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 550, anchor: 'end' },
      { x: DOOR_RECT.x - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 816.667, anchor: 'end' },
    ],
  },
  '좌경_4보링': {
    verticalPos: {
      x: DOOR_RECT.x + DOOR_RECT.width + VERTICAL_TEXT_OFFSET,
      y: DOOR_RECT.y + DOOR_RECT.height / 2,
      anchor: 'start',
    },
    horizontalPos: {
      x: DOOR_RECT.x + DOOR_RECT.width / 2,
      y: DOOR_RECT.y + DOOR_RECT.height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
      anchor: 'middle',
    },
    boringTextPos: [
      { x: DOOR_RECT.x - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 250, anchor: 'end' },
      { x: DOOR_RECT.x - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 450, anchor: 'end' },
      { x: DOOR_RECT.x - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 650, anchor: 'end' },
      { x: DOOR_RECT.x - BORING_TEXT_RECT_OFFSET - BORING_RADIUS, y: 850, anchor: 'end' },
    ],
  },
  // 우경
  '우경_2보링': {
    verticalPos: {
      x: DOOR_RECT.x - VERTICAL_TEXT_OFFSET,
      y: DOOR_RECT.y + DOOR_RECT.height / 2,
      anchor: 'end',
    },
    horizontalPos: {
      x: DOOR_RECT.x + DOOR_RECT.width / 2,
      y: DOOR_RECT.y + DOOR_RECT.height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
      anchor: 'middle',
    },
    boringTextPos: [
      { x: DOOR_RECT.x + DOOR_RECT.width + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 350, anchor: 'start' },
      { x: DOOR_RECT.x + DOOR_RECT.width + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 750, anchor: 'start' },
    ],
  },
  '우경_3보링': {
    verticalPos: {
      x: DOOR_RECT.x - VERTICAL_TEXT_OFFSET,
      y: DOOR_RECT.y + DOOR_RECT.height / 2,
      anchor: 'end',
    },
    horizontalPos: {
      x: DOOR_RECT.x + DOOR_RECT.width / 2,
      y: DOOR_RECT.y + DOOR_RECT.height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
      anchor: 'middle',
    },
    boringTextPos: [
      { x: DOOR_RECT.x + DOOR_RECT.width + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 283.333, anchor: 'start' },
      { x: DOOR_RECT.x + DOOR_RECT.width + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 550, anchor: 'start' },
      { x: DOOR_RECT.x + DOOR_RECT.width + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 816.667, anchor: 'start' },
    ],
  },
  '우경_4보링': {
    verticalPos: {
      x: DOOR_RECT.x - VERTICAL_TEXT_OFFSET,
      y: DOOR_RECT.y + DOOR_RECT.height / 2,
      anchor: 'end',
    },
    horizontalPos: {
      x: DOOR_RECT.x + DOOR_RECT.width / 2,
      y: DOOR_RECT.y + DOOR_RECT.height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
      anchor: 'middle',
    },
    boringTextPos: [
      { x: DOOR_RECT.x + DOOR_RECT.width + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 250, anchor: 'start' },
      { x: DOOR_RECT.x + DOOR_RECT.width + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 450, anchor: 'start' },
      { x: DOOR_RECT.x + DOOR_RECT.width + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 650, anchor: 'start' },
      { x: DOOR_RECT.x + DOOR_RECT.width + BORING_TEXT_RECT_OFFSET + BORING_RADIUS, y: 850, anchor: 'start' },
    ],
  },
};

// 플랩문 데이터

const FLAP_DOOR_RECT = { x: 126, y: 404, width: 792, height: 392 };

const FLAP_DOOR_BORINGS: Record<FlapDoorSubtype, Boring[]> = {
  '2보링': [
    { cx: 350, cy: 365, r: FLAP_BORING_RADIUS },
    { cx: 750, cy: 365, r: FLAP_BORING_RADIUS },
  ],
  '3보링': [
    { cx: 255.333, cy: 365, r: FLAP_BORING_RADIUS },
    { cx: 522, cy: 365, r: FLAP_BORING_RADIUS },
    { cx: 788.667, cy: 365, r: FLAP_BORING_RADIUS },
  ],
  '4보링': [
    { cx: 222, cy: 365, r: FLAP_BORING_RADIUS },
    { cx: 422, cy: 365, r: FLAP_BORING_RADIUS },
    { cx: 622, cy: 365, r: FLAP_BORING_RADIUS },
    { cx: 822, cy: 365, r: FLAP_BORING_RADIUS },
  ],
};

const FLAP_DOOR_DIMENSION_POSITIONS: Record<FlapDoorSubtype, DoorDimensions> = {
  '2보링': {
    verticalPos: {
      x: FLAP_DOOR_RECT.x + FLAP_DOOR_RECT.width + VERTICAL_TEXT_OFFSET,
      y: FLAP_DOOR_RECT.y + FLAP_DOOR_RECT.height / 2,
      anchor: 'start',
    },
    horizontalPos: {
      x: FLAP_DOOR_RECT.x + FLAP_DOOR_RECT.width / 2,
      y: FLAP_DOOR_RECT.y + FLAP_DOOR_RECT.height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
      anchor: 'middle',
    },
    boringTextPos: FLAP_DOOR_BORINGS['2보링'].map(({ cx, cy, r }) => ({
      x: cx,
      y: cy - r - FLAP_BORING_TEXT_OFFSET,
      anchor: 'middle' as const,
    })),
  },
  '3보링': {
    verticalPos: {
      x: FLAP_DOOR_RECT.x + FLAP_DOOR_RECT.width + VERTICAL_TEXT_OFFSET,
      y: FLAP_DOOR_RECT.y + FLAP_DOOR_RECT.height / 2,
      anchor: 'start',
    },
    horizontalPos: {
      x: FLAP_DOOR_RECT.x + FLAP_DOOR_RECT.width / 2,
      y: FLAP_DOOR_RECT.y + FLAP_DOOR_RECT.height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
      anchor: 'middle',
    },
    boringTextPos: FLAP_DOOR_BORINGS['3보링'].map(({ cx, cy, r }) => ({
      x: cx,
      y: cy - r - FLAP_BORING_TEXT_OFFSET,
      anchor: 'middle' as const,
    })),
  },
  '4보링': {
    verticalPos: {
      x: FLAP_DOOR_RECT.x + FLAP_DOOR_RECT.width + VERTICAL_TEXT_OFFSET,
      y: FLAP_DOOR_RECT.y + FLAP_DOOR_RECT.height / 2,
      anchor: 'start',
    },
    horizontalPos: {
      x: FLAP_DOOR_RECT.x + FLAP_DOOR_RECT.width / 2,
      y: FLAP_DOOR_RECT.y + FLAP_DOOR_RECT.height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
      anchor: 'middle',
    },
    boringTextPos: FLAP_DOOR_BORINGS['4보링'].map(({ cx, cy, r }) => ({
      x: cx,
      y: cy - r - FLAP_BORING_TEXT_OFFSET,
      anchor: 'middle' as const,
    })),
  },
};

// 마에다 서랍 데이터

const MAEDA_DOOR_RECTS: Record<MaedaSubtype, { x: number; y: number; width: number; height: number; fillPatternId: string }> = {
  '마에다1': { x: 404, y: 204, width: 392, height: 792, fillPatternId: 'url(#pattern0_6_48)' },
  '마에다2': { x: 404, y: 404, width: 392, height: 392, fillPatternId: 'url(#pattern0_9_582)' },
  '마에다3': { x: 204, y: 404, width: 792, height: 392, fillPatternId: 'url(#pattern0_9_602)' },
};

const MAEDA_DIMENSION_POSITIONS: Record<MaedaSubtype, { verticalPos: DimTextPosition; horizontalPos: DimTextPosition }> = {
  '마에다1': {
    verticalPos: {
      x: MAEDA_DOOR_RECTS['마에다1'].x + MAEDA_DOOR_RECTS['마에다1'].width + VERTICAL_TEXT_OFFSET,
      y: MAEDA_DOOR_RECTS['마에다1'].y + MAEDA_DOOR_RECTS['마에다1'].height / 2,
      anchor: 'start',
    },
    horizontalPos: {
      x: MAEDA_DOOR_RECTS['마에다1'].x + MAEDA_DOOR_RECTS['마에다1'].width / 2,
      y: MAEDA_DOOR_RECTS['마에다1'].y + MAEDA_DOOR_RECTS['마에다1'].height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
      anchor: 'middle',
    },
  },
  '마에다2': {
    verticalPos: {
      x: MAEDA_DOOR_RECTS['마에다2'].x + MAEDA_DOOR_RECTS['마에다2'].width + VERTICAL_TEXT_OFFSET,
      y: MAEDA_DOOR_RECTS['마에다2'].y + MAEDA_DOOR_RECTS['마에다2'].height / 2,
      anchor: 'start',
    },
    horizontalPos: {
      x: MAEDA_DOOR_RECTS['마에다2'].x + MAEDA_DOOR_RECTS['마에다2'].width / 2,
      y: MAEDA_DOOR_RECTS['마에다2'].y + MAEDA_DOOR_RECTS['마에다2'].height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
      anchor: 'middle',
    },
  },
  '마에다3': {
    verticalPos: {
      x: MAEDA_DOOR_RECTS['마에다3'].x + MAEDA_DOOR_RECTS['마에다3'].width + VERTICAL_TEXT_OFFSET,
      y: MAEDA_DOOR_RECTS['마에다3'].y + MAEDA_DOOR_RECTS['마에다3'].height / 2,
      anchor: 'start',
    },
    horizontalPos: {
      x: MAEDA_DOOR_RECTS['마에다3'].x + MAEDA_DOOR_RECTS['마에다3'].width / 2,
      y: MAEDA_DOOR_RECTS['마에다3'].y + MAEDA_DOOR_RECTS['마에다3'].height + HORIZONTAL_TEXT_OFFSET + FONT_SIZE / 2,
      anchor: 'middle',
    },
  },
};

// 일반문 SVG 생성 함수

export function generateGeneralDoorSvg(
  subtype: GeneralDoorSubtype,
  size: Size,
  color: ColorProps = {},
  boringValues?: BoringValues
): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '1200');
  svg.setAttribute('height', '1200');
  svg.setAttribute('viewBox', '0 0 1200 1200');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('xmlns', SVG_NS);

  // 배경
  const bg = document.createElementNS(SVG_NS, 'rect');
  bg.setAttribute('width', '1200');
  bg.setAttribute('height', '1200');
  bg.setAttribute('fill', 'white');
  svg.appendChild(bg);

  // 문짝 고정 사각형
  const door = document.createElementNS(SVG_NS, 'rect');
  door.setAttribute('x', `${DOOR_RECT.x}`);
  door.setAttribute('y', `${DOOR_RECT.y}`);
  door.setAttribute('width', `${DOOR_RECT.width}`);
  door.setAttribute('height', `${DOOR_RECT.height}`);
  door.setAttribute('fill', color.doorFill ?? 'url(#pattern0_6_8)');
  door.setAttribute('stroke', 'black');
  door.setAttribute('stroke-width', '8');
  svg.appendChild(door);

  // 보링 원 생성
  GENERAL_DOOR_BORINGS[subtype].forEach(({ cx, cy, r }) => {
    const c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('cx', `${cx}`);
    c.setAttribute('cy', `${cy}`);
    c.setAttribute('r', `${r}`);
    c.setAttribute('fill', 'white');
    c.setAttribute('stroke', 'black');
    c.setAttribute('stroke-width', '6');
    svg.appendChild(c);
  });

  // 치수 텍스트 삽입
  insertDimensionTexts(svg, subtype, size, boringValues);

  return svg;
}

// 플랩문 SVG 생성 함수

export function generateFlapDoorSvg(
  subtype: FlapDoorSubtype,
  size: Size,
  color: ColorProps = {},
  boringValues?: BoringValues
): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '1200');
  svg.setAttribute('height', '1200');
  svg.setAttribute('viewBox', '0 0 1200 1200');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('xmlns', SVG_NS);

  // 배경
  const bg = document.createElementNS(SVG_NS, 'rect');
  bg.setAttribute('width', '1200');
  bg.setAttribute('height', '1200');
  bg.setAttribute('fill', 'white');
  svg.appendChild(bg);

  // 사각형 문짝
  const door = document.createElementNS(SVG_NS, 'rect');
  door.setAttribute('x', `${FLAP_DOOR_RECT.x}`);
  door.setAttribute('y', `${FLAP_DOOR_RECT.y}`);
  door.setAttribute('width', `${FLAP_DOOR_RECT.width}`);
  door.setAttribute('height', `${FLAP_DOOR_RECT.height}`);
  door.setAttribute('fill', color.doorFill ?? 'url(#pattern0_8_266)');
  door.setAttribute('stroke', 'black');
  door.setAttribute('stroke-width', '8');
  svg.appendChild(door);

  // 보링 원
  FLAP_DOOR_BORINGS[subtype].forEach(({ cx, cy, r }) => {
    const c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('cx', `${cx}`);
    c.setAttribute('cy', `${cy}`);
    c.setAttribute('r', `${r}`);
    c.setAttribute('fill', 'white');
    c.setAttribute('stroke', 'black');
    c.setAttribute('stroke-width', '6');
    svg.appendChild(c);
  });

  // 치수 텍스트 삽입
  insertFlapDimensionTexts(svg, subtype, size, boringValues);

  return svg;
}

// 마에다 서랍 SVG 생성 함수

export function generateMaedaDoorSvg(
  subtype: MaedaSubtype,
  size: Size,
  color?: ColorProps
): SVGSVGElement {
  const rect = MAEDA_DOOR_RECTS[subtype];
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '1200');
  svg.setAttribute('height', '1200');
  svg.setAttribute('viewBox', '0 0 1200 1200');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('xmlns', SVG_NS);

  // 배경
  const bg = document.createElementNS(SVG_NS, 'rect');
  bg.setAttribute('width', '1200');
  bg.setAttribute('height', '1200');
  bg.setAttribute('fill', 'white');
  svg.appendChild(bg);

  // 마에다 서랍 사각형
  const doorRect = document.createElementNS(SVG_NS, 'rect');
  doorRect.setAttribute('x', `${rect.x}`);
  doorRect.setAttribute('y', `${rect.y}`);
  doorRect.setAttribute('width', `${rect.width}`);
  doorRect.setAttribute('height', `${rect.height}`);
  doorRect.setAttribute('fill', color?.doorFill ?? rect.fillPatternId);
  doorRect.setAttribute('stroke', 'black');
  doorRect.setAttribute('stroke-width', '8');
  svg.appendChild(doorRect);

  // 치수 텍스트 위치
  const dimPos = MAEDA_DIMENSION_POSITIONS[subtype];

  // 세로 치수 텍스트
  const verticalText = document.createElementNS(SVG_NS, 'text');
  verticalText.setAttribute('x', `${dimPos.verticalPos.x}`);
  verticalText.setAttribute('y', `${dimPos.verticalPos.y}`);
  verticalText.setAttribute('fill', 'black');
  verticalText.style.fontSize = `${FONT_SIZE}px`;
  verticalText.style.dominantBaseline = 'middle';
  verticalText.style.textAnchor = dimPos.verticalPos.anchor;
  verticalText.textContent = `${size.height}`;
  svg.appendChild(verticalText);

  // 가로 치수 텍스트
  const horizontalText = document.createElementNS(SVG_NS, 'text');
  horizontalText.setAttribute('x', `${dimPos.horizontalPos.x}`);
  horizontalText.setAttribute('y', `${dimPos.horizontalPos.y}`);
  horizontalText.setAttribute('fill', 'black');
  horizontalText.style.fontSize = `${FONT_SIZE}px`;
  horizontalText.style.textAnchor = dimPos.horizontalPos.anchor;
  horizontalText.textContent = `${size.width}`;
  svg.appendChild(horizontalText);

  return svg;
}

// 치수 텍스트 삽입 함수들

function insertDimensionTexts(
  svg: SVGSVGElement,
  subtype: GeneralDoorSubtype,
  size: Size,
  boringValues?: BoringValues
) {
  const dimPos = DOOR_DIMENSION_POSITIONS[subtype];
  if (!dimPos) return;

  // 세로 치수 텍스트
  const verticalText = document.createElementNS(SVG_NS, 'text');
  verticalText.setAttribute('x', `${dimPos.verticalPos.x}`);
  verticalText.setAttribute('y', `${dimPos.verticalPos.y}`);
  verticalText.setAttribute('fill', 'black');
  verticalText.style.fontSize = `${FONT_SIZE}px`;
  verticalText.style.dominantBaseline = 'middle';
  verticalText.style.textAnchor = dimPos.verticalPos.anchor;
  verticalText.textContent = `${size.height}`;
  svg.appendChild(verticalText);

  // 가로 치수 텍스트
  const horizontalText = document.createElementNS(SVG_NS, 'text');
  horizontalText.setAttribute('x', `${dimPos.horizontalPos.x}`);
  horizontalText.setAttribute('y', `${dimPos.horizontalPos.y}`);
  horizontalText.setAttribute('fill', 'black');
  horizontalText.style.fontSize = `${FONT_SIZE}px`;
  horizontalText.style.textAnchor = dimPos.horizontalPos.anchor;
  horizontalText.textContent = `${size.width}`;
  svg.appendChild(horizontalText);

  // 보링 치수 텍스트
  const borings = GENERAL_DOOR_BORINGS[subtype];
  borings.forEach(({ cy }, i) => {
    const boringText = document.createElementNS(SVG_NS, 'text');
    boringText.setAttribute('x', `${dimPos.boringTextPos[i].x}`);
    boringText.setAttribute('y', `${dimPos.boringTextPos[i].y}`);
    boringText.setAttribute('fill', 'black');
    boringText.style.fontSize = `${FONT_SIZE}px`;
    boringText.style.dominantBaseline = 'middle';
    boringText.style.textAnchor = dimPos.boringTextPos[i].anchor;
    boringText.textContent = boringValues && boringValues[i] !== undefined ? `${boringValues[i]}` : `${cy}`;
    svg.appendChild(boringText);
  });
}

function insertFlapDimensionTexts(
  svg: SVGSVGElement,
  subtype: FlapDoorSubtype,
  size: Size,
  boringValues?: BoringValues
) {
  const dimPos = FLAP_DOOR_DIMENSION_POSITIONS[subtype];
  if (!dimPos) return;

  // 세로 치수 텍스트
  const verticalText = document.createElementNS(SVG_NS, 'text');
  verticalText.setAttribute('x', `${dimPos.verticalPos.x}`);
  verticalText.setAttribute('y', `${dimPos.verticalPos.y}`);
  verticalText.setAttribute('fill', 'black');
  verticalText.style.fontSize = `${FONT_SIZE}px`;
  verticalText.style.dominantBaseline = 'middle';
  verticalText.style.textAnchor = dimPos.verticalPos.anchor;
  verticalText.textContent = `${size.height}`;
  svg.appendChild(verticalText);

  // 가로 치수 텍스트
  const horizontalText = document.createElementNS(SVG_NS, 'text');
  horizontalText.setAttribute('x', `${dimPos.horizontalPos.x}`);
  horizontalText.setAttribute('y', `${dimPos.horizontalPos.y}`);
  horizontalText.setAttribute('fill', 'black');
  horizontalText.style.fontSize = `${FONT_SIZE}px`;
  horizontalText.style.textAnchor = dimPos.horizontalPos.anchor;
  horizontalText.textContent = `${size.width}`;
  svg.appendChild(horizontalText);

  // 보링별 치수 텍스트 (입력된 boringValues 사용, 없으면 cy 기준 숫자)
  const borings = FLAP_DOOR_BORINGS[subtype];
  borings.forEach(({ cy }, i) => {
    const boringText = document.createElementNS(SVG_NS, 'text');
    boringText.setAttribute('x', `${dimPos.boringTextPos[i].x}`);
    boringText.setAttribute('y', `${dimPos.boringTextPos[i].y}`);
    boringText.setAttribute('fill', 'black');
    boringText.style.fontSize = `${FONT_SIZE}px`;
    boringText.style.dominantBaseline = 'middle';
    boringText.style.textAnchor = dimPos.boringTextPos[i].anchor;
    boringText.textContent = boringValues && boringValues[i] !== undefined ? `${boringValues[i]}` : `${cy}`;
    svg.appendChild(boringText);
  });
}
