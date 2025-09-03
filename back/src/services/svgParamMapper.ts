// 각 product_type별 item_options를 SVG 생성 함수 파라미터로 변환
export function mapItemOptionsToSvgParams(product_type: string, item_options: any) {
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
        let hingeDir = '좌경';
        if (item_options.hinge_direction === '우경' || item_options.hinge_direction === 'right') hingeDir = '우경';
        if (item_options.hinge_direction === '좌경' || item_options.hinge_direction === 'left') hingeDir = '좌경';
        const boringCount = Number(item_options.hinge_count) || 2;
        const subtype = `${hingeDir}_${boringCount}보링`;
        const hingeSizes = [
          item_options.first_hinge_size,
          item_options.second_hinge_size,
          item_options.third_hinge_size,
          item_options.fourth_hinge_size
        ];
        const boringValues = hingeSizes.slice(0, boringCount).filter(v => v !== undefined && v !== null).map(Number);
        const size = {
          width: Number(item_options.door_width),
          height: Number(item_options.door_height)
        };
        const color = { doorFill: `/img/color-png(new)/${colorName}.png` };
        const validSubtypes = [
          '좌경_2보링','좌경_3보링','좌경_4보링','우경_2보링','우경_3보링','우경_4보링'
        ];
        const safeSubtype = validSubtypes.includes(subtype) ? subtype : '좌경_2보링';
        return {
          subtype: safeSubtype,
          size,
          color,
          boringValues
        };
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
        const color = { doorFill: `/img/color-png(new)/${colorName}.png` };
        return {
          size,
          color
        };
      }
      // 기타 DOOR 타입은 기존 로직 유지
      return item_options;
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
      if (item_options.cabinet_type === 'flap') {
        return {
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
      }
      // Drawer cabinet
      if (item_options.cabinet_type === 'drawer') {
        return {
          type: 'drawer',
          body: bodyColor,
          cabinetColor,
          top: bodyColor,
          right: bodyColor,
          drawerFill: item_options.drawer_color,
          drawerType: item_options.drawer_type,
          width: Number(item_options.cabinet_width),
          height: Number(item_options.cabinet_height),
          depth: Number(item_options.cabinet_depth)
        };
      }
      // Open/Upper/Lower cabinet (no flap/drawer fields)
      return {
        type: item_options.cabinet_type?.toLowerCase(),
        body: bodyColor,
        cabinetColor,
        top: bodyColor,
        right: bodyColor,
        width: Number(item_options.cabinet_width),
        height: Number(item_options.cabinet_height),
        depth: Number(item_options.cabinet_depth)
      };
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
      return {
        width: Number(item_options.finish_base_depth),
        height: Number(item_options.finish_base_height),
        colorOrImage: { fallbackColor: `/img/color-png(new)/${colorName}.png` }
      };
    default:
      return item_options;
  }
}
