// 각 product_type별 item_options를 SVG 생성 함수 파라미터로 변환
export function mapItemOptionsToSvgParams(product_type: string, item_options: any) {
  switch (product_type) {
    case 'DOOR': {
      // hingeDirection: 'left'|'right'|'좌경'|'우경', boring: [..]
      const boringCount = Array.isArray(item_options.boring) ? item_options.boring.length : 0;
      let hingeDir = '좌경';
      if (item_options.hingeDirection === 'right' || item_options.hingeDirection === '우경') hingeDir = '우경';
      if (item_options.hingeDirection === 'left' || item_options.hingeDirection === '좌경') hingeDir = '좌경';
      const subtype = `${hingeDir}_${boringCount}보링`;
      // subtype이 GENERAL_DOOR_BORINGS에 없으면 fallback
      const validSubtypes = [
        '좌경_2보링','좌경_3보링','좌경_4보링','우경_2보링','우경_3보링','우경_4보링'
      ];
      const safeSubtype = validSubtypes.includes(subtype) ? subtype : '좌경_2보링';
      return {
        subtype: safeSubtype,
        size: {
          width: Number(item_options.width),
          height: Number(item_options.height)
        },
        color: { doorFill: item_options.color },
        boringValues: Array.isArray(item_options.boring) ? item_options.boring.map(Number) : []
      };
    }
    case 'CABINET':
      return {
        type: item_options.cabinet_type?.toLowerCase(),
        body: item_options.cabinet_color,
        leftDoor: item_options.left_door_color,
        rightDoor: item_options.right_door_color,
        top: item_options.top_color,
        flapLeft: item_options.flap_left_color,
        flapRight: item_options.flap_right_color,
        drawerType: item_options.drawer_type,
        drawerFill: item_options.drawer_color,
        width: item_options.cabinet_width,
        height: item_options.cabinet_height,
        depth: item_options.cabinet_depth
      };
    case 'FLAP_DOOR':
      return {
        subtype: item_options.door_type, // "FLAP"
        size: { width: item_options.door_width, height: item_options.door_height },
        color: { doorFill: item_options.door_color },
        boringValues: [
          item_options.first_hinge_size,
          item_options.second_hinge_size,
          item_options.third_hinge_size,
          item_options.fourth_hinge_size
        ].filter(Boolean)
      };
    case 'MAEDA':
      return {
        size: { width: item_options.door_width, height: item_options.door_height },
        color: { doorFill: item_options.door_color }
      };
    case 'FINISH':
      return {
        width: item_options.finish_base_width || item_options.finish_base_depth,
        height: item_options.finish_base_height,
        colorOrImage: { fallbackColor: item_options.finish_color }
      };
    default:
      return item_options;
  }
}
