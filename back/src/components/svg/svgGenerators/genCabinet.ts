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

    // 패턴 <defs> (플랩 도어, 윗면 PNG 지원)
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    ["flapRight", "flapLeft", "top"].forEach((key) => {
      const value = colorProps[key];
      if (typeof value === 'string' && value.endsWith('.png')) {
        const patternId = `pattern_${key}`;
        const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
        pattern.setAttribute("id", patternId);
        pattern.setAttribute("patternUnits", "userSpaceOnUse");
        pattern.setAttribute("width", "1200");
        pattern.setAttribute("height", "1200");
        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttributeNS(null, "href", `/img/color-list/${value}`);
        image.setAttribute("x", "0");
        image.setAttribute("y", "0");
        image.setAttribute("width", "1200");
        image.setAttribute("height", "1200");
        image.setAttribute("preserveAspectRatio", "none");
        pattern.appendChild(image);
        defs.appendChild(pattern);
      }
    });
    if (defs.childNodes.length > 0) svg.appendChild(defs);

    // FLAP_CABINET_PARTS: 0-2(몸체), 3(우플랩), 4(좌플랩), 5(윗면)
    FLAP_CABINET_PARTS.forEach((part, idx) => {
      const path = makePath({ ...part });
      // 플랩 도어/윗면 PNG fill 적용
      if (idx === 3 && typeof colorProps.flapRight === 'string' && colorProps.flapRight.endsWith('.png')) {
        path.setAttribute('fill', `url(#pattern_flapRight)`);
      } else if (idx === 4 && typeof colorProps.flapLeft === 'string' && colorProps.flapLeft.endsWith('.png')) {
        path.setAttribute('fill', `url(#pattern_flapLeft)`);
      } else if (idx === 5 && typeof colorProps.top === 'string' && colorProps.top.endsWith('.png')) {
        path.setAttribute('fill', `url(#pattern_top)`);
      } else if (part.fill) {
        path.setAttribute('fill', part.fill);
      } else {
        path.setAttribute('fill', '#ccc');
      }
      svg.appendChild(path);
    });
    return svg;
  }
  // 바디 색상: body 키로 받거나, 없으면 hansol-dove-white.png
  const bodyColor = colorProps.body || 'hansol-dove-white.png';
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "1200");
  svg.setAttribute("height", "1200");
  svg.setAttribute("viewBox", "0 0 1200 1200");
  svg.setAttribute("fill", "none");

  // 1. 패턴 <defs> 생성 (colorProps의 값이 PNG 파일명일 때 pattern 추가)
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  Object.entries(colorProps).forEach(([key, value]) => {
    if (typeof value !== 'string' || !value.endsWith('.png')) return;
    const patternId = `pattern_${key}`;
    const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    pattern.setAttribute("id", patternId);
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", "1200");
    pattern.setAttribute("height", "1200");
    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttributeNS(null, "href", `/img/color-list/${value}`);
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    image.setAttribute("width", "1200");
    image.setAttribute("height", "1200");
    image.setAttribute("preserveAspectRatio", "none");
    pattern.appendChild(image);
    defs.appendChild(pattern);
  });
  if (defs.childNodes.length > 0) svg.appendChild(defs);

  // 2. 공통
  CABINET_BASE_PARTS.forEach(part => svg.appendChild(makePath(part)));

  // 3. 우측면, 윗면 등 파라미터화
  // hansol-dove-white.png 패턴이 필요하면 <defs>에 추가
  let doveWhitePatternAdded = false;
  // top, right는 항상 bodyColor를 사용
  ['right', 'top'].forEach(key => {
    let fillValue = bodyColor;
    if (typeof fillValue === 'string' && fillValue.endsWith('.png')) {
      const patternId = 'pattern_body';
      fillValue = `url(#${patternId})`;
      // 패턴이 없으면 추가
      if (!document.getElementById(patternId)) {
        const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
        pattern.setAttribute("id", patternId);
        pattern.setAttribute("patternUnits", "userSpaceOnUse");
        pattern.setAttribute("width", "1200");
        pattern.setAttribute("height", "1200");
        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttributeNS(null, "href", "/img/color-list/" + bodyColor);
        image.setAttribute("x", "0");
        image.setAttribute("y", "0");
        image.setAttribute("width", "1200");
        image.setAttribute("height", "1200");
        image.setAttribute("preserveAspectRatio", "none");
        pattern.appendChild(image);
        defs.appendChild(pattern);
        if (defs.childNodes.length > 0 && !svg.contains(defs)) svg.appendChild(defs);
      }
    }
    const shape = CABINET_SHAPES_DATA.find(s => s.key === key);
    if (shape) {
      svg.appendChild(makePath({
        ...shape,
        fill: fillValue,
      }));
    }
  });

  // 4. 상부장 문 파트 (좌측문, 우측문)
  ["leftDoor", "rightDoor"].forEach(doorKey => {
    if (colorProps[doorKey]) {
      let fillValue = colorProps[doorKey];
      if (typeof fillValue === 'string' && fillValue.endsWith('.png')) {
        fillValue = `url(#pattern_${doorKey})`;
      }
      svg.appendChild(makePath({
        ...UPPER_CABINET_DOOR_PARTS[doorKey],
        fill: fillValue,
      }));
    }
  });

// ...existing code...

// 5. 서랍장 파트 (drawerType: drawer2, drawer3_112, drawer3_221)
// colorProps.drawerType: 'drawer2' | 'drawer3_112' | 'drawer3_221'
// colorProps.drawerFill: string (png or color)
  if (colorProps.drawerType && DRAWER_CABINET_PARTS[colorProps.drawerType]) {
    // 기존 레일 path 사용
    const parts = DRAWER_CABINET_PARTS[colorProps.drawerType];
    // 1. 레일(회색, 왼쪽으로 40px 이동)
    const moveX = 40;
    parts.forEach((part) => {
      if (part.fill === '#D1D5DC') {
        const movedD = part.d.replace(/(\d+)(\s|,)/g, (m, num, sep) => `${parseInt(num, 10) - moveX}${sep}`);
        svg.appendChild(makePath({
          ...part,
          d: movedD,
        }));
      }
    });
    // 2. 서랍 도어(왼쪽으로 40px 이동)
    const drawerFill = colorProps.drawerFill || '#eee';
    if (colorProps.drawerType === 'drawer3_221') {
      // 겉2속1: 제일 위 서랍문(겉)이 가장 마지막(맨 위)에 그려져 겉이 바깥에 보임
      // (서랍문 파트만 추출)
      const drawerParts = parts.filter((part) => part.fill === '');
      // 순서: [2, 1, 0] (아래, 중간, 위) → 겉(위)이 가장 위에 보이고, 속(중간)이 그 아래, 맨 아래가 가장 안쪽에 보임
      const order = [2, 1, 0];
      order.forEach((idx) => {
        const part = drawerParts[idx];
        if (!part) return;
        const movedD = part.d.replace(/(\d+)(\s|,)/g, (m, num, sep) => `${parseInt(num, 10) - moveX}${sep}`);
        let fillValue = drawerFill;
        if (typeof drawerFill === 'string' && drawerFill.endsWith('.png')) {
          fillValue = `url(#pattern_drawerFill)`;
        }
        svg.appendChild(makePath({
          ...part,
          d: movedD,
          fill: fillValue,
        }));
      });
    } else {
      // 나머지 서랍장은 기존 순서대로
      parts.forEach((part) => {
        if (part.fill === '') {
          const movedD = part.d.replace(/(\d+)(\s|,)/g, (m, num, sep) => `${parseInt(num, 10) - moveX}${sep}`);
          let fillValue = drawerFill;
          if (typeof drawerFill === 'string' && drawerFill.endsWith('.png')) {
            fillValue = `url(#pattern_drawerFill)`;
          }
          svg.appendChild(makePath({
            ...part,
            d: movedD,
            fill: fillValue,
          }));
        }
      });
    }
    // 3. 오른쪽 면(맨 위에 덮어 그림)
    // CABINET_SHAPES_DATA에서 key가 'right'인 path만 추출
    const rightPart = CABINET_SHAPES_DATA.find((p) => p.key === 'right');
    if (rightPart) {
      svg.appendChild(makePath({
        ...rightPart,
        fill: '#F3F4F6',
      }));
    }
  }
// ...existing code...
  return svg;
}
