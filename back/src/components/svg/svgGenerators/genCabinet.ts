import { CABINET_BASE_PARTS, CABINET_SHAPES_DATA, UPPER_CABINET_DOOR_PARTS, DRAWER_CABINET_PARTS, FLAP_CABINET_PARTS } from "../svgData/cabinetData";
import { makePath } from "../svgCore/svgUtils";
import { ColorProps } from "../svgCore/svgTypes";

export function genCabinetSvg(colorProps: ColorProps = {}) {

  // 플랩장 3D 타입 지원: colorProps.type === 'flapCabinet'이면 FLAP_CABINET_PARTS 사용
  if (colorProps.type === 'flapCabinet') {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "1200");
    svg.setAttribute("height", "1200");
    svg.setAttribute("viewBox", "0 0 1200 1200");
    svg.setAttribute("fill", "none");

    FLAP_CABINET_PARTS.forEach((part) => {
      const path = makePath({ ...part, fill: 'white' });
      svg.appendChild(path);
    });
    return svg;
  }

  // 바디 색상: body 키로 받거나, 없으면 hansol-dove-white.png
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "1200");
  svg.setAttribute("height", "1200");
  svg.setAttribute("viewBox", "0 0 1200 1200");
  svg.setAttribute("fill", "none");

  CABINET_BASE_PARTS.forEach(part => svg.appendChild(makePath({ ...part, fill: 'white' })));

  const shapes = ['right', 'top'];
  shapes.forEach(key => {
    const shape = CABINET_SHAPES_DATA.find(s => s.key === key);
    if (shape) {
      svg.appendChild(makePath({ ...shape, fill: 'white' }));
    }
  });

  ["leftDoor", "rightDoor"].forEach(doorKey => {
    if (UPPER_CABINET_DOOR_PARTS[doorKey]) {
      svg.appendChild(makePath({ ...UPPER_CABINET_DOOR_PARTS[doorKey], fill: 'white' }));
    }
  });

  if (colorProps.drawerType && DRAWER_CABINET_PARTS[colorProps.drawerType]) {
    const parts = DRAWER_CABINET_PARTS[colorProps.drawerType];
    const moveX = 40;
    parts.forEach((part) => {
      const movedD = part.d.replace(/(\d+)(\s|,)/g, (m, num, sep) => `${parseInt(num, 10) - moveX}${sep}`);
      svg.appendChild(makePath({ ...part, d: movedD, fill: 'white' }));
    });
    const rightPart = CABINET_SHAPES_DATA.find((p) => p.key === 'right');
    if (rightPart) {
      svg.appendChild(makePath({ ...rightPart, fill: 'white' }));
    }
  }
  return svg;
}
