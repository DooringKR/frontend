// 각 product_type별 item_options를 SVG 생성 함수 파라미터로 변환
export function mapItemOptionsToSvgParams(product_type: string, item_options: any) {
  let result;
  switch (product_type) {
    case 'DOOR': {
      // 일반문(STANDARD), 플랩문(FLAP), 서랍문(DRAWER) 모두 처리
      if (item_options.door_type === 'STANDARD' || item_options.door_type === 'FLAP') {
        let colorName = '';
        if (typeof item_options.door_color === 'string') {
          const colorParts = item_options.door_color.split(',').map((s: string) => s.trim());
          if (colorParts.length >= 4) {
            colorName = `${colorParts[1]} ${colorParts[3]}`;
          }
        }
        const boringCount = Number(item_options.hinge_count) || 2;
        // 플랩문은 hinge_direction 무시, boringCount만 반영
        const subtype = item_options.door_type === 'FLAP'
          ? `${boringCount}보링`
          : (() => {
              let hingeDir = '좌경';
              if (item_options.hinge_direction === '우경' || item_options.hinge_direction === 'right') hingeDir = '우경';
              if (item_options.hinge_direction === '좌경' || item_options.hinge_direction === 'left') hingeDir = '좌경';
              return `${hingeDir}_${boringCount}보링`;
            })();
        const hingeSizes = [
          item_options.first_hinge,
          item_options.second_hinge,
          item_options.third_hinge,
          item_options.fourth_hinge
        ];
        const boringValues = hingeSizes.slice(0, boringCount).filter(v => v !== undefined && v !== null).map(Number);
        const size = {
          width: Number(item_options.door_width),
          height: Number(item_options.door_height)
        };
        const color = {
          doorFillImageUrl: `/img/color-png(new)/${colorName}.png`
        };
        // 플랩문 validSubtypes: '2보링','3보링','4보링', 일반문 validSubtypes: ...
        const validSubtypes = item_options.door_type === 'FLAP'
          ? ['2보링','3보링','4보링']
          : ['좌경_2보링','좌경_3보링','좌경_4보링','우경_2보링','우경_3보링','우경_4보링'];
        const safeSubtype = validSubtypes.includes(subtype) ? subtype : (item_options.door_type === 'FLAP' ? '2보링' : '좌경_2보링');
        result = {
          subtype: safeSubtype,
          size,
          color,
          boringValues
        };
        break;
      } else if (item_options.door_type === 'DRAWER') {
        let colorName = '';
        if (typeof item_options.door_color === 'string') {
          const colorParts = item_options.door_color.split(',').map((s: string) => s.trim());
          if (colorParts.length >= 4) {
            colorName = `${colorParts[1]} ${colorParts[3]}`;
          }
        }
        const size = {
          width: Number(item_options.door_width),
          height: Number(item_options.door_height)
        };
        const color = {
          doorFillImageUrl: `/img/color-png(new)/${colorName}.png`
        };
        result = {
          size,
          color
        };
        break;
      }
      // 기타 DOOR 타입은 기존 로직 유지
  result = item_options;
  break;
    }
    case 'CABINET': {
      // Extract bodyColor and cabinetColor
      let bodyColor = '';
      let cabinetColor = '';
      if (typeof item_options.body_type === 'string') {
        if (item_options.body_type.startsWith('PATAGONIA')) {
          bodyColor = '/img/color-png(new)/한솔 파타고니아 크림.png';
        } else if (item_options.body_type.startsWith('HERRINGBONE')) {
          bodyColor = '/img/color-png(new)/헤링본.png';
        }
      }
      if (typeof item_options.cabinet_color === 'string') {
        const colorParts = item_options.cabinet_color.split(',').map((s: string) => s.trim());
        if (colorParts.length >= 4) {
          cabinetColor = `/img/color-png(new)/${colorParts[1]} ${colorParts[3]}.png`;
        }
      }

      // Flap cabinet
      if (item_options.cabinet_type === 'FLAP') {
        result = {
          type: 'flapCabinet',
          body: bodyColor,
          cabinetColor,
          top: bodyColor,
          right: bodyColor,
          flapLeft: item_options.flap_left_color,
          flapRight: item_options.flap_right_color,
          width: Number(item_options.cabinet_width),
          height: Number(item_options.cabinet_height),
          depth: Number(item_options.cabinet_depth)
        };
      } else if (item_options.cabinet_type === 'DRAWER') {
        // drawerType 매핑: 2단, 3단 등 구분 필요시 추가
        let drawerType = item_options.drawer_type;
        // 예시: 2단 서랍장 → drawerCabinet2, 3단 1:1:2 → drawerCabinet3_112, 3단 겉2:속1 → drawerCabinet3_211
        if (drawerType === '2단 서랍') drawerType = 'drawerCabinet2';
        else if (drawerType === '3단 서랍 (1 : 1 : 2') drawerType = 'drawerCabinet3_112';
        else if (drawerType === '3단 서랍 (겉2 ∙ 속1)') drawerType = 'drawerCabinet3_211';
        result = {
          type: drawerType,
          body: bodyColor,
          cabinetColor,
          top: bodyColor,
          right: bodyColor,
          drawerFill: item_options.drawer_color,
          drawerType,
          width: Number(item_options.cabinet_width),
          height: Number(item_options.cabinet_height),
          depth: Number(item_options.cabinet_depth)
        };
      } else {
        // Open/Upper/Lower cabinet (no flap/drawer fields)
        let cabinetType = item_options.cabinet_type?.toLowerCase();
        if (cabinetType === 'open') cabinetType = 'openCabinet';
        else if (cabinetType === 'upper') cabinetType = 'upperCabinet';
        else if (cabinetType === 'lower') cabinetType = 'lowerCabinet';
        result = {
          type: cabinetType,
          body: bodyColor,
          cabinetColor,
          top: bodyColor,
          right: bodyColor,
          width: Number(item_options.cabinet_width),
          height: Number(item_options.cabinet_height),
          depth: Number(item_options.cabinet_depth)
        };
      }
      break;
    }
    case 'FINISH':
      // 색상 추출: finish_color에서 두번째와 네번째 값
      let colorName = '';
      if (typeof item_options.finish_color === 'string') {
        const colorParts = item_options.finish_color.split(',').map((s: string) => s.trim());
        if (colorParts.length >= 4) {
          colorName = `${colorParts[1]} ${colorParts[3]}`;
        }
      }
      result = {
        width: Number(item_options.finish_base_depth),
        height: Number(item_options.finish_base_height),
        colorOrImage: { fallbackColor: `/img/color-png(new)/${colorName}.png` }
      };
      break;
    default:
      result = item_options;
      break;
  }
  console.log('[svgParamMapper] 반환값:', JSON.stringify(result, null, 2));
  return result;
}
