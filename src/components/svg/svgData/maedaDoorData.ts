import { DoorDimensions } from "../svgCore/svgTypes";

export type MaedaSubtype = '마에다1' | '마에다2' | '마에다3';
export const MAEDA_DOOR_RECTS = {
  '마에다1': { x: 404, y: 204, width: 392, height: 792, fillPatternId: 'url(#pattern0_6_48)' },
  '마에다2': { x: 404, y: 404, width: 392, height: 392, fillPatternId: 'url(#pattern0_9_582)' },
  '마에다3': { x: 204, y: 404, width: 792, height: 392, fillPatternId: 'url(#pattern0_9_602)' }
};
// 치수 위치 등 필요시 export
