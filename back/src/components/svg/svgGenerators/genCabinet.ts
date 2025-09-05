import { CABINET_BASE_PARTS, CABINET_SHAPES_DATA, UPPER_CABINET_DOOR_PARTS, DRAWER_CABINET_PARTS, FLAP_CABINET_PARTS } from "../svgData/cabinetData";
import { makePath } from "../svgCore/svgUtils";
import { ColorProps } from "../svgCore/svgTypes";

export function genCabinetSvg(colorProps: ColorProps = {}) {

  // 플랩장 3D 타입 지원: colorProps.type === 'flapCabinet'이면 FLAP_CABINET_PARTS 사용
    // 오픈장 타입 지원: colorProps.type === 'openCabinet'이면 지정된 SVG 구조 생성
    if (colorProps.type === 'openCabinet') {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "1200");
      svg.setAttribute("height", "1200");
      svg.setAttribute("viewBox", "0 0 1200 1200");
      svg.setAttribute("fill", "none");

      // 바탕
      const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bg.setAttribute("width", "1200");
      bg.setAttribute("height", "1200");
      bg.setAttribute("fill", "white");
      svg.appendChild(bg);

      // 각 도어 파트
      const rects = [
        { width: 146, height: 68, x: 877, y: 542 },
        { width: 146, height: 68, x: 657, y: 206 },
        { width: 146, height: 68, x: 190, y: 254 },
      ];
      rects.forEach(({ width, height, x, y }) => {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("width", String(width));
        rect.setAttribute("height", String(height));
        rect.setAttribute("transform", `translate(${x} ${y})`);
        rect.setAttribute("fill", "white");
        svg.appendChild(rect);
      });
      return svg;
    }
    
    // 2단 서랍장 타입 지원: colorProps.type === 'drawerCabinet2'이면 지정된 SVG 구조 생성
    if (colorProps.type === 'drawerCabinet2') {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "1200");
      svg.setAttribute("height", "1200");
      svg.setAttribute("viewBox", "0 0 1200 1200");
      svg.setAttribute("fill", "none");

      // 바탕
      const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bg.setAttribute("width", "1200");
      bg.setAttribute("height", "1200");
      bg.setAttribute("fill", "white");
      svg.appendChild(bg);

      // 주요 path들
      const paths = [
        { d: "M464 240V720L260 864V384L464 240Z", fill: "#F3F4F6" },
        { d: "M260 864V384", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M860 336L464 240V720L860 816V336Z", fill: "#F3F4F6" },
        { d: "M464 720L260 864L656 960L860 816L464 720Z", fill: "#E3E3E3" },
        { d: "M464 240L260 384L656 480L860 336L464 240Z", fill: "url(#pattern0_6_54)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M464 480L192 672L588 768L860 576L464 480Z", fill: "#F3F4F6" },
        { d: "M464 720L158 936L554 1032L860 816L464 720Z", fill: "#F3F4F6" },
        { d: "M588 528L192 432V672L588 768V528Z", fill: "url(#pattern1_6_54)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M554 792L158 696V936L554 1032V792Z", fill: "url(#pattern2_6_54)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M554 952L758 808V888L554 1032V952Z", fill: "#D1D5DC", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M588 688L792 544V624L588 768V688Z", fill: "#D1D5DC", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M656 480L860 336V816L656 960V480Z", fill: "url(#pattern3_6_54)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
      ];
      paths.forEach((props) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", props.d);
        if (props.fill) path.setAttribute("fill", props.fill);
        if (props.stroke) path.setAttribute("stroke", props.stroke);
        if (props.strokeWidth) path.setAttribute("stroke-width", props.strokeWidth);
        if (props.strokeLinejoin) path.setAttribute("stroke-linejoin", props.strokeLinejoin);
        svg.appendChild(path);
      });
      return svg;
    }

    // 3단 서랍장 1:1:2 타입 지원: colorProps.type === 'drawerCabinet3_112'이면 지정된 SVG 구조 생성
    if (colorProps.type === 'drawerCabinet3_112') {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "1200");
      svg.setAttribute("height", "1200");
      svg.setAttribute("viewBox", "0 0 1200 1200");
      svg.setAttribute("fill", "none");

      // 바탕
      const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bg.setAttribute("width", "1200");
      bg.setAttribute("height", "1200");
      bg.setAttribute("fill", "white");
      svg.appendChild(bg);

      // 주요 path들
      const paths = [
        { d: "M860 336L464 240V720L860 816V336Z", fill: "#F3F4F6" },
        { d: "M464 720L158 936L554 1032L860 816L464 720Z", fill: "#F3F4F6" },
        { d: "M464 240V720L260 864V384L464 240Z", fill: "#F3F4F6" },
        { d: "M464 240L260 384L656 480L860 336L464 240Z", fill: "url(#pattern0_10_1270)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M588 708L792 564V624L588 768V708Z", fill: "#D1D5DC", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M622 564L826 420V480L622 624V564Z", fill: "#D1D5DC", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M554 952L758 808V888L554 1032V952Z", fill: "#D1D5DC", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M656 480L860 336V816L656 960V480Z", fill: "url(#pattern1_10_1270)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M260 864V384", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M622 504L226 408V528L622 624V504Z", fill: "url(#pattern2_10_1270)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M588 648L192 552V672L588 768V648Z", fill: "url(#pattern3_10_1270)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        { d: "M554 792L158 696V936L554 1032V792Z", fill: "url(#pattern4_10_1270)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
      ];
      paths.forEach((props) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", props.d);
        if (props.fill) path.setAttribute("fill", props.fill);
        if (props.stroke) path.setAttribute("stroke", props.stroke);
        if (props.strokeWidth) path.setAttribute("stroke-width", props.strokeWidth);
        if (props.strokeLinejoin) path.setAttribute("stroke-linejoin", props.strokeLinejoin);
        svg.appendChild(path);
      });
      return svg;
    }

      // 3단 서랍장 겉2:속1 타입 지원: colorProps.type === 'drawerCabinet3_211'이면 지정된 SVG 구조 생성
      if (colorProps.type === 'drawerCabinet3_211') {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "1200");
        svg.setAttribute("height", "1200");
        svg.setAttribute("viewBox", "0 0 1200 1200");
        svg.setAttribute("fill", "none");

        // 바탕
        const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bg.setAttribute("width", "1200");
        bg.setAttribute("height", "1200");
        bg.setAttribute("fill", "white");
        svg.appendChild(bg);

        // 주요 path들
        const paths = [
          { d: "M464 240V720L260 864V384L464 240Z", fill: "#F3F4F6" },
          { d: "M260 864V384", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
          { d: "M860 336L464 240V720L860 816V336Z", fill: "#F3F4F6" },
          { d: "M464 720L260 864L656 960L860 816L464 720Z", fill: "#E3E3E3" },
          { d: "M464 240L260 384L656 480L860 336L464 240Z", fill: "url(#pattern0_10_1278)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
          { d: "M464 480L192 672L588 768L860 576L464 480Z", fill: "#F3F4F6" },
          { d: "M464 720L158 936L554 1032L860 816L464 720Z", fill: "#F3F4F6" },
          { d: "M537 804L141 708V948L537 1044V804Z", fill: "url(#pattern1_10_1278)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
          { d: "M537 964L741 820V900L537 1044V964Z", fill: "#D1D5DC", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
          { d: "M571 700L775 556V636L571 780V700Z", fill: "#D1D5DC", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
          { d: "M622 594L826 450V500L622 644V594Z", fill: "#D1D5DC", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
          { d: "M656 480L860 336V816L656 960V480Z", fill: "url(#pattern2_10_1278)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
          { d: "M622 524L226 428V548L622 644V524Z", fill: "url(#pattern3_10_1278)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
          { d: "M571 540L175 444V684L571 780V540Z", fill: "url(#pattern4_10_1278)", stroke: "black", strokeWidth: "4", strokeLinejoin: "round" },
        ];
        paths.forEach((props) => {
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", props.d);
          if (props.fill) path.setAttribute("fill", props.fill);
          if (props.stroke) path.setAttribute("stroke", props.stroke);
          if (props.strokeWidth) path.setAttribute("stroke-width", props.strokeWidth);
          if (props.strokeLinejoin) path.setAttribute("stroke-linejoin", props.strokeLinejoin);
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
