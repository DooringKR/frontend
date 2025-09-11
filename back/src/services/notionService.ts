// src/services/notionService.ts

import { Client } from "@notionhq/client";
import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
// ProductType enum 직접 명시 또는 문자열 비교
// 환경 변수
const NOTION_TOKEN = process.env.NOTION_TOKEN!;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID!;
if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  throw new Error("환경변수 NOTION_TOKEN 또는 NOTION_DATABASE_ID가 설정되지 않았습니다.");
}


const notion = new Client({ auth: NOTION_TOKEN });

const DETAIL_KEY_LABEL_MAP: Record<string, string> = {
  // 문짝(door)
  "door_type": "문짝 종류",
  "door_color": "문짝 색상",
  "door_width": "문짝 폭",
  "door_height": "문짝 높이",
  "hinge_count": "경첩 개수",
  "door_request": "문짝 요청사항",
  "hinge_direction": "경첩 방향",
  "first_hinge_size": "첫번째 경첩 사이즈",
  "second_hinge_size": "두번째 경첩 사이즈",
  // 마감재(finish)
  "finish_color": "마감재 색상",
  "finish_request": "마감재 요청사항",
  "finish_base_depth": "기본 깊이",
  "finish_base_height": "기본 높이",
  "finish_additional_depth": "추가 깊이",
  "finish_additional_height": "추가 높이",
  // 부분장(cabinet)
  "body_type": "바디 종류",
  "finish_type": "마감재 타입",
  "handle_type": "손잡이 종류",
  "cabinet_type": "부분장 종류",
  "cabinet_color": "부분장 색상",
  "cabinet_depth": "부분장 깊이",
  "cabinet_width": "부분장 폭",
  "cabinet_height": "부분장 높이",
  "cabinet_request": "부분장 요청사항",
  // 부속(accessory)
  "accessory_type": "부속 종류",
  "accessory_model": "부속 모델",
  "accessory_madeby": "제조사",
  "accessory_request": "부속 요청사항",
  // 하드웨어(hardware)
  "hardware_type": "하드웨어 종류",
  "hardware_count": "수량",
  "hardware_request": "하드웨어 요청사항",
};

const withExtraLine = (s: string) => s + "\n";

function formatDateToYMDHM(date: Date): string {
  // YYYY-MM-DD HH:mm (초 생략)
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${h}:${m}`;
}
/**
 * order, order_items, user, order_options 전체를 전달받아 Notion 페이지를 생성
 */
export interface NotionOrderPayload {
  orderedAt: Date; // 주문 생성 시각
  userRoadAddress: string; // 주소(도로명)
  userPhone: string; // 주문한 분 전화번호
  recipientPhone: string; // 받는 분 전화번호
  orderType: string; // PICK_UP / DELIVERY
  orderPrice: number;
  orderOptions: any; // { ... } delivery/pick_up 옵션 구조
  orderItems: {
  product_type: string;
    // product_detail: string; // 옵션에 세부종류 필요시 추가
    item_count: number;
    unit_price: number;
    item_options: any;
  }[];
}

const PRODUCT_TYPE_LABEL: Record<string, string> = {
  DOOR: "문짝",
  FINISH: "마감재",
  CABINET: "부분장",
  HARDWARE: "하드웨어",
  ACCESSORY: "부속",
};

// 배송방법: Select
const SHIPPING_METHOD_MAP: Record<string, string> = {
  DELIVERY: "현장으로 배송해주세요",
  PICK_UP: "직접 픽업하러 갈게요",
};

const VALID_GAGU_TYPES = Object.values(PRODUCT_TYPE_LABEL); // = ["문짝", "마감재", ...]
const VALID_SHIPPING_METHODS = ["직접 픽업하러 갈게요", "현장으로 배송해주세요"];

export async function createNotionOrderPage(payload: NotionOrderPayload) {
  // orderItems 배열 데이터 구조 점검용 로그
  console.log('[NotionSync][DEBUG] orderItems:', JSON.stringify(payload.orderItems, null, 2));
  // 1. 제목: user_road_address 두 어절만 파싱
  const title = payload.userRoadAddress.split(" ").slice(0, 2).join(" ");
  // 2. 배송방법: PICK_UP / DELIVERY → 사용자 친화적 문자열
  const shippingMethod = SHIPPING_METHOD_MAP[payload.orderType as keyof typeof SHIPPING_METHOD_MAP] || payload.orderType;
  // 3. 가구종류: 중복 제거 및 사용자 친화적 문자열
  const furnitureTypes = Array.from(new Set(payload.orderItems.map(item => PRODUCT_TYPE_LABEL[item.product_type]))).filter(Boolean) as string[];

  // 가구 블록 생성 순서 지정: DOOR, FINISH, CABINET, ACCESSORY, HARDWARE
  const PRODUCT_TYPE_ORDER = ['DOOR', 'FINISH', 'CABINET', 'ACCESSORY', 'HARDWARE'];
  const DOOR_TYPE_ORDER = ['STANDARD', 'FLAP', 'DRAWER'];
  const FINISH_TYPE_ORDER = ['ep', 'molding', 'galle'];
  const CABINET_TYPE_ORDER = ['upper', 'lower', 'flap', 'drawer', 'open'];
  const sortedOrderItems = [...payload.orderItems].sort((a, b) => {
    const idxA = PRODUCT_TYPE_ORDER.indexOf(a.product_type?.toUpperCase() || '');
    const idxB = PRODUCT_TYPE_ORDER.indexOf(b.product_type?.toUpperCase() || '');
    if (idxA === idxB) {
      if (a.product_type?.toUpperCase() === 'DOOR') {
        const doorA = DOOR_TYPE_ORDER.indexOf(a.item_options?.door_type || '');
        const doorB = DOOR_TYPE_ORDER.indexOf(b.item_options?.door_type || '');
        return doorA - doorB;
      }
      if (a.product_type?.toUpperCase() === 'FINISH') {
        const finishA = FINISH_TYPE_ORDER.indexOf((a.item_options?.finish_category || '').toLowerCase());
        const finishB = FINISH_TYPE_ORDER.indexOf((b.item_options?.finish_category || '').toLowerCase());
        return finishA - finishB;
      }
      if (a.product_type?.toUpperCase() === 'CABINET') {
        const cabinetA = CABINET_TYPE_ORDER.indexOf((a.item_options?.cabinet_type || '').toLowerCase());
        const cabinetB = CABINET_TYPE_ORDER.indexOf((b.item_options?.cabinet_type || '').toLowerCase());
        return cabinetA - cabinetB;
      }
    }
    return idxB - idxA;
  });

  // 1. 제목: user_road_address 두 어절만 파싱
    // 사용자 친화적 옵션 번역 (page.tsx 참조)
    // 2. 가구정보 블록 (비동기: SVG→PNG→S3→image)
    async function makeFurnitureBlock(item: any, i: number): Promise<any> {

      const itemOptions = item.item_options || {};
      let optionStr = "";
      switch (item.product_type?.toLowerCase()) {
        case "cabinet":
          optionStr = [
            // 종류: 오픈장, 플랩장 등 세부명칭 표시 (대소문자 무시)
            `종류 : ${itemOptions.cabinet_type ? getCategoryLabel(itemOptions.cabinet_type, CABINET_CATEGORY_LIST, "부분장") : "-"}`,
            // 색상, 너비, 깊이, 높이, 서랍, 레일, 용도, 요청사항
            `색상: ${itemOptions.cabinet_color || "-"}`,
            // 소재(바디): 값이 있으면 변환, 없으면 "기타"
            itemOptions.body_type ? `몸통 소재: ${CABINET_BODY_TYPE_NAME[itemOptions.body_type.toUpperCase() as keyof typeof CABINET_BODY_TYPE_NAME] ?? "기타"}` : "몸통 소재: 기타",
            `너비: ${itemOptions.cabinet_width ? itemOptions.cabinet_width.toLocaleString() : "-"}mm`,
            `높이: ${itemOptions.cabinet_height ? itemOptions.cabinet_height.toLocaleString() : "-"}mm`,
            `깊이: ${itemOptions.cabinet_depth ? itemOptions.cabinet_depth.toLocaleString() : "-"}mm`,
            // 손잡이 종류 (대소문자 구분 없이)
            (itemOptions.cabinet_type?.toLowerCase() !== 'open' && itemOptions.handle_type)
              ? `손잡이 종류: ${CABINET_HANDLE_TYPE_NAME[itemOptions.handle_type.toUpperCase() as keyof typeof CABINET_HANDLE_TYPE_NAME] ?? "기타"}`
              : "",
            // 마감 방식: finish_category 우선, 없으면 finish_type, 둘 다 없으면 "기타"
            itemOptions.finish_category ? `마감 방식: ${getCategoryLabel(itemOptions.finish_category, FINISH_CATEGORY_LIST, "기타")}` :
              (itemOptions.finish_type ? `마감 방식: ${CABINET_FINISH_TYPE_NAME[itemOptions.finish_type.toUpperCase() as keyof typeof CABINET_FINISH_TYPE_NAME] ?? "기타"}` : "마감 방식: 기타"),
            // 소재(흡음재): 값이 있으면 변환, 없으면 "기타"
            itemOptions.absorber_type ? `쇼바 종류: ${CABINET_ABSORBER_TYPE_NAME[itemOptions.absorber_type.toUpperCase() as keyof typeof CABINET_ABSORBER_TYPE_NAME] ?? "기타"}` : "",
            itemOptions.drawer_type ? `서랍 종류: ${itemOptions.drawer_type}` : "",
            itemOptions.rail_type ? `레일 종류: ${itemOptions.rail_type}` : "",
            itemOptions.cabinet_location ? `용도 ∙ 장소: ${formatLocation(itemOptions.cabinet_location)}` : "",
            typeof itemOptions.addon_construction === "boolean"
              ? `시공 필요 여부: ${itemOptions.addon_construction ? "시공도 필요해요" : "필요없어요"}`
              : (itemOptions.addon_construction ? `시공 필요 여부: ${itemOptions.addon_construction}` : ""),
            itemOptions.leg_type ? `다리발: ${itemOptions.leg_type}` : "",
            itemOptions.cabinet_request ? `기타 요청 사항: ${itemOptions.cabinet_request}` : "",


          ].filter(Boolean).join("\n");
          break;
        case "door":
          const boringSizes = [
            itemOptions.first_hinge_size,
            itemOptions.second_hinge_size,
            itemOptions.third_hinge_size,
            itemOptions.fourth_hinge_size
          ].filter(v => v !== undefined && v !== null && v !== "");
          let boringStr = "";
          if (boringSizes.length > 0) {
            boringStr = `보링 치수: ${boringSizes.join(", ")} (아래 이미지 참고)`;
          }
          let hingeAddStr = "";
          if (typeof itemOptions.addOn_hinge === "boolean") {
            hingeAddStr = `경첩 추가 여부: ${itemOptions.addOn_hinge ? "경첩도 받기" : "필요없어요"}`;
          }
          const doorTypeLower = itemOptions.door_type ? itemOptions.door_type.toLowerCase() : "";
          const isFlap = doorTypeLower === "flap";
          const isDrawer = doorTypeLower === "drawer";
          optionStr = [
            `종류 : ${itemOptions.door_type ? getCategoryLabel(doorTypeLower, DOOR_CATEGORY_LIST, "일반문") : "-"}`,
            `색상 : ${itemOptions.door_color || "-"}`,
            `가로 길이 : ${itemOptions.door_width ? itemOptions.door_width.toLocaleString() : "-"}mm`,
            `세로 길이 : ${itemOptions.door_height ? itemOptions.door_height.toLocaleString() : "-"}mm`,
            boringStr,
            itemOptions.door_location ? `용도 ∙ 장소: ${formatLocation(itemOptions.door_location)}` : "",
            !(isFlap || isDrawer) ? `경첩 개수 : ${itemOptions.hinge_count || "-"}` : "",
            !(isFlap || isDrawer) ? `경첩 방향 : ${itemOptions.hinge_direction === "left" ? "좌경" : itemOptions.hinge_direction === "right" ? "우경" : "-"}` : "",
            hingeAddStr,
            itemOptions.door_request ? `추가 요청: ${itemOptions.door_request}` : ""
          ].filter(Boolean).join("\n");
          break;
        case "finish":
          // 종류: category.ts의 FINISH_CATEGORY_LIST를 따름
          let finishType = "-";
          if (itemOptions.finish_category) {
            const normalized = itemOptions.finish_category.toLowerCase();
            const found = FINISH_CATEGORY_LIST.find(cat => cat.slug === normalized);
            finishType = found?.header ?? found?.name ?? itemOptions.finish_category;
          }
          // 색상
          const finishColor = itemOptions.finish_color || "-";
          // 엣지 면 수
          const edgeCount = itemOptions.finish_edge_count !== undefined ? itemOptions.finish_edge_count : "-";
          // 깊이
          let depthStr = "";
          if (itemOptions.finish_base_depth !== undefined && itemOptions.finish_base_depth !== null) {
            if (itemOptions.finish_additional_depth !== undefined && itemOptions.finish_additional_depth !== null && itemOptions.finish_additional_depth > 0) {
              depthStr = `깊이: ${(itemOptions.finish_base_depth + itemOptions.finish_additional_depth).toLocaleString()}mm (${itemOptions.finish_base_depth.toLocaleString()} + ${itemOptions.finish_additional_depth.toLocaleString()})`;
            } else {
              depthStr = `깊이: ${itemOptions.finish_base_depth.toLocaleString()}mm(키움 없음)`;
            }
          } else {
            depthStr = "깊이: -";
          }
          // 높이
          let heightStr = "";
          if (itemOptions.finish_base_height !== undefined && itemOptions.finish_base_height !== null) {
            if (itemOptions.finish_additional_height !== undefined && itemOptions.finish_additional_height !== null && itemOptions.finish_additional_height > 0) {
              heightStr = `높이: ${(itemOptions.finish_base_height + itemOptions.finish_additional_height).toLocaleString()}mm (${itemOptions.finish_base_height.toLocaleString()} + ${itemOptions.finish_additional_height.toLocaleString()})`;
            } else {
              heightStr = `높이: ${itemOptions.finish_base_height.toLocaleString()}mm(키움 없음)`;
            }
          } else {
            heightStr = "높이: -";
          }
          optionStr = [
            `종류: ${finishType}`,
            `색상: ${finishColor}`,
            `엣지 면 수: ${edgeCount}`,
            depthStr,
            heightStr,
            itemOptions.finish_location ? `용도 ∙ 장소: ${formatLocation(itemOptions.finish_location)}` : "",
            itemOptions.finish_request ? `기타 요청 사항: ${itemOptions.finish_request}` : ""
          ].filter(Boolean).join("\n");
          break;

          case "hardware":
            
            // 하드웨어/부속 종류 한글 매핑 (함수 최상단)
            const HARDWARE_TYPE_KR: Record<string, string> = {
              hinge: "경첩",
              rail: "레일",
              bolt: "피스"
            };
            optionStr = [
              `종류: ${itemOptions.hardware_type ? (HARDWARE_TYPE_KR[itemOptions.hardware_type.toLowerCase()] || itemOptions.hardware_type) : "-"}`,
              `제조사 : ${itemOptions.hardware_madeby || "-"}`,
              `모델명 : ${itemOptions.hardware_size || "-"}`,
              itemOptions.hardware_request ? `요청 사항 : ${itemOptions.hardware_request}` : ""
            ].filter(Boolean).join("\n");
            break;
        case "accessory":
            const ACCESSORY_TYPE_KR: Record<string, string> = {
              hood: "후드",
              cooktop: "쿡탑",
              sinkbowl: "싱크볼"
            };
            optionStr = [
              `종류: ${itemOptions.accessory_type ? (ACCESSORY_TYPE_KR[itemOptions.accessory_type.toLowerCase()] || itemOptions.accessory_type) : "-"}`,
              `제조사: ${itemOptions.accessory_madeby || "-"}`,
              `모델명 : ${itemOptions.accessory_model || "-"}`,
              itemOptions.accessory_request ? `요청 사항 : ${itemOptions.accessory_request}` : ""
            ].filter(Boolean).join("\n");
            break;
        default:
          optionStr = Object.entries(itemOptions).map(([k, v]) => `${DETAIL_KEY_LABEL_MAP[k] || k}: ${v ?? "-"}`).join("\n");
      }
        const total = (item.unit_price ?? 0) * item.item_count;
        const textContent = 
          `${i + 1}. [${PRODUCT_TYPE_LABEL[item.product_type]}]
  ${optionStr}
  개수: ${item.item_count}
  단가: ${item.unit_price?.toLocaleString() ?? "-"}원
  총 금액: ${total?.toLocaleString() ?? "-"}원
  `;

    // DB에서 전달된 image_url을 그대로 사용 (함수 내에서 한 번만 선언)
    const imageUrl = item.image_url;
    const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'https://dooring-backend.onrender.com';

        // 부속/하드웨어는 이미지 없이 텍스트 블록만 생성
        if (["hardware", "accessory"].includes(item.product_type?.toLowerCase())) {
          return {
            object: "block",
            type: "callout",
            callout: {
              rich_text: [
                { type: "text", text: { content: textContent } } as any
              ]
            }
          } as any;
        }

        // 나머지 카테고리는 기존대로 이미지 포함
        if (imageUrl) {
          const notionImageUrl = imageUrl.startsWith('http') ? imageUrl : `${PUBLIC_BASE_URL}${imageUrl}`;
          return {
            object: "block",
            type: "callout",
            callout: {
              rich_text: [
                { type: "text", text: { content: textContent } } as any
              ],
              children: [
                {
                  object: "block",
                  type: "image",
                  image: {
                    type: "external",
                    external: { url: notionImageUrl }
                  }
                } as any
              ]
            }
          } as any;
        } else {
          // 이미지가 없으면 텍스트 블록만 생성
          return {
            object: "block",
            type: "callout",
            callout: {
              rich_text: [
                { type: "text", text: { content: textContent } } as any
              ]
            }
          } as any;
        }

  // ...existing code...
    }

  // 모든 orderItems에 대해 비동기 처리
  const furnitureBlocks: any[] = await Promise.all(
    sortedOrderItems.map((item: any, i: number) => makeFurnitureBlock(item, i))
  );
  if (!furnitureBlocks.length || furnitureBlocks.every(b => !b)) {
    console.warn('[NotionSync][IMAGE][ERROR] furnitureBlocks가 비어있음. 이미지 생성 실패 가능성 높음.');
  }

  // 배송정보 본문 블록
  const typeCounts: Record<string, number> = {};
  for (const item of payload.orderItems) {
    const type = PRODUCT_TYPE_LABEL[item.product_type];
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }
  const productTypesStats = Object.entries(typeCounts)
    .map(([type, cnt]) => `• ${type}: ${cnt}개`).join("\n");
  const orderedAtText = formatDateToYMDHM(payload.orderedAt);
  const deliveryInfoBlock = {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [
        { type: "text", text: { content:
`${productTypesStats}\n
총 금액: ${payload.orderPrice.toLocaleString()}원
주문 일시: ${orderedAtText}
주문한 분 휴대전화 번호: ${payload.userPhone}
받는 분 휴대전화 번호: ${payload.recipientPhone}
배송 방법: ${shippingMethod}
${interpretOptions(payload.orderOptions, payload.orderType)}
` } } as any
      ],
    },
  };

  const notionPage: CreatePageParameters = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      "도로명주소": {
        title: [
          { text: { content: title } },
        ],
      },
      "배송방법": {
        select: { name: shippingMethod }
      },
      "가구종류": {
        multi_select: furnitureTypes.map(name => ({ name }))
      },
      "전화번호": {
        phone_number: payload.recipientPhone
      },
      "주문일시": {
        date: { start: payload.orderedAt.toISOString() }
      }
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            { type: "text", text: { content: "배송정보" } }
          ]
        }
      },
      deliveryInfoBlock,
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            { type: "text", text: { content: "가구정보" } }
          ]
        }
      },
      ...furnitureBlocks.filter(Boolean)
    ],
  };

  // (2) 옵션 번역: delivery/pick_up 구조에서 적절히 해석해 표시
  function interpretOptions(opts: any, orderType: string): string {
    if (!opts) return "-";
    if (orderType === "DELIVERY") {
      // recipient_road_address, delivery_type, delivery_request 등 상세 표시
      const lines = [];
      if (opts.recipient_road_address) lines.push(`배송 주소: ${opts.recipient_road_address}`);
      if (opts.delivery_type) lines.push(`희망 도착: ${opts.delivery_type === "TOMORROW" ? "내일/지정일" : "오늘중"}`);
      if (opts.delivery_request) {
        let request = (opts.delivery_request === "CALL")
          ? "도착 시 전화"
          : (opts.delivery_request === "LEAVE_DOOR")
            ? "문 앞에 놓기"
            : (opts.delivery_request === "OPEN_GATE")
              ? "공동현관 비밀번호로 열기"
              : opts.delivery_request;
        lines.push(`특이 배송 요청: ${request}`);
        if (opts.delivery_request === "OPEN_GATE" && opts.gate_password)
          lines.push(`공동현관 비밀번호: ${opts.gate_password}`);
        if (opts.delivery_request === "DIRECT_INPUT" && opts.delivery_request_direct_input)
          lines.push(`직접 입력 요청: ${opts.delivery_request_direct_input}`);
      }
      return lines.join("\n") || "-";
    } else if (orderType === "PICK_UP") {
      // 차량종류 등 표시
      if (opts.vehicle_type) {
        let vehicle = (opts.vehicle_type === "TRUCK") ? "트럭" : (opts.vehicle_type === "CAR") ? "승용차" : opts.vehicle_type;
        let vehicleLine = `차량종류: ${vehicle}`;
        if (opts.vehicle_type === "DIRECT_INPUT" && opts.vehicle_type_direct_input)
          vehicleLine += `(${opts.vehicle_type_direct_input})`;
        return vehicleLine;
      }
      return "-";
    }
    return "-";
  }

  try {
    const response = await notion.pages.create(notionPage);
    if (!response || !response.id) {
      throw new Error('Notion API 응답에 페이지 ID가 없습니다. 페이지 생성 실패.');
    }
    console.log(`[NotionSync][SUCCESS] Notion 페이지 생성됨: ${response.id}`);
    return response;
  } catch (error: any) {
    // Notion API 에러 상세 출력 및 throw
    if (error && error.body) {
      console.error('[NotionSync][ERROR] Notion API 호출 실패:', error.body);
    } else {
      console.error('[NotionSync][ERROR] Notion API 호출 실패:', error);
    }
    throw error;
  }
}

// --- 프론트엔드 옵션/카테고리/포맷 유틸 백엔드 이식 ---
const DOOR_CATEGORY_LIST = [
  { slug: "standard", header: "일반문" },
  { slug: "drawer", header: "서랍 마에다" },
  { slug: "flap", header: "플랩도어" },
];
const CABINET_CATEGORY_LIST = [
  { name: "상부장", image: "/img/cabinet-category/Upper.png", slug: "upper", header: "상부장" },
  { name: "하부장", image: "/img/cabinet-category/Lower.png", slug: "lower", header: "하부장" },
  { name: "플랩장", image: "/img/cabinet-category/Flap.png", slug: "flap", header: "플랩장" },
  { name: "서랍장", image: "/img/cabinet-category/Drawers.png", slug: "drawer", header: "서랍장" },
  { name: "오픈장", image: "/img/cabinet-category/Open.png", slug: "open", header: "오픈장" },
];
const FINISH_CATEGORY_LIST = [
  { name: "EP 마감", image: "/img/finish-category/EP.png", slug: "ep", header: "EP 마감" },
  { name: "몰딩", image: "/img/finish-category/Molding.png", slug: "molding", header: "몰딩" },
  { name: "걸레받이", image: "/img/finish-category/Galle.png", slug: "galle", header: "걸레받이" },
];
// --- 프론트엔드 modelList.ts에서 이식 ---
const CABINET_HANDLE_TYPE_NAME = {
  CHANNEL: "찬넬",
  OUTER: "겉손잡이",
  PULL_DOWN: "내리기",
  PUSH: "푸쉬",
};
const CABINET_BODY_TYPE_NAME = {
  HERRINGBONE_PP_15T: "헤링본 PP 15T",
  HERRINGBONE_PP_18T: "헤링본 PP 18T",
  PATAGONIA_CREAM_LPM_18T: "파타고니아 크림 LPM 18T",
  DIRECT_INPUT: "직입",
};
const CABINET_FINISH_TYPE_NAME = {
  MAK_URA: "막우라",
  URAHOME: "우라홈",
};
const CABINET_ABSORBER_TYPE_NAME = {
  NONE: "없음",
  MOONJU_AVENTOS: "문주 아벤토스",
  BLUM_AVENTOS: "블룸 아벤토스",
  GAS: "가스",
  FOLDABLE: "폴더블",
  DIRECT_INPUT: "직접 입력",
};
// --- 타입 오류 수정 ---
function getCategoryLabel(
  category: string | null,
  list: { slug: string; name?: string; header?: string }[],
  fallback = "기타",
): string {
  if (!category) return fallback;
  const normalized = category.toLowerCase();
  const found = list.find(item => item.slug === normalized);
  return found?.header ?? found?.name ?? fallback;
}
function formatLocation(value: string): string {
    const locationMap: Record<string, string> = {
        KITCHEN: "주방",
        SHOES: "신발장",
        BUILT_IN: "붙박이장",
        ETC: "기타 수납장",
        BALCONY: "발코니 창고문",
    };
    return locationMap[value] || value;
}
