// src/services/notionService.ts

import { Client } from "@notionhq/client";
import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import { ProductType } from "@prisma/client";

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
    product_type: ProductType;
    // product_detail: string; // 옵션에 세부종류 필요시 추가
    item_count: number;
    unit_price: number;
    item_options: any;
  }[];
}

const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
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
  // 1. 제목: user_road_address 두 어절만 파싱
  const title =
    (payload.userRoadAddress || "")
      .split(" ")
      .slice(0, 2)
      .join(" ")
      .trim() || "주문";

  // 2. 배송방법
  const shippingMethod = SHIPPING_METHOD_MAP[payload.orderType] || "직접 픽업하러 갈게요";
  // 3. 가구종류(다중선택): order_items의 product_type 중복없이 추출→한글→Array
  const furnitureTypes = [
    ...new Set(payload.orderItems.map(item => PRODUCT_TYPE_LABEL[item.product_type])),
  ].filter(t => VALID_GAGU_TYPES.includes(t));

  // --- children 본문 생성 ---
  // 1. 배송정보 블록
  // (1) 가구종류별 개수
  const typeCounts: Record<string, number> = {};
  for (const item of payload.orderItems) {
    const type = PRODUCT_TYPE_LABEL[item.product_type];
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }

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

  // 배송정보 본문 블록
  const productTypesStats = Object.entries(typeCounts)
    .map(([type, cnt]) => `• ${type}: ${cnt}개`).join("\n");

  const orderedAtText = formatDateToYMDHM(payload.orderedAt);

  const deliveryInfoBlock = {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [
        { type: "text", text: { content:
`${productTypesStats}
총 금액: ${payload.orderPrice.toLocaleString()}원
주문 일시: ${orderedAtText}
주문한 분 휴대전화 번호: ${payload.userPhone}
받는 분 휴대전화 번호: ${payload.recipientPhone}
배송 방법: ${shippingMethod}
${interpretOptions(payload.orderOptions, payload.orderType)}
`
        }},
      ],
    },
  };

  // 2. 가구정보 블록
  const furnitureBlocks: any[] = payload.orderItems.map((item, i) => {
  const optionStr =
    item.item_options && Object.keys(item.item_options).length > 0
      ? Object.entries(item.item_options)
          .map(([k, v]) => {
            const label = DETAIL_KEY_LABEL_MAP[k] || k;
            return `${label}: ${v ?? "-"}`;
          })
          .join(" | ")
      : "-";
  const total = (item.unit_price ?? 0) * item.item_count;
  return {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text", text: {
            content:
`${i + 1}. [${PRODUCT_TYPE_LABEL[item.product_type]}]
- 세부종류: ${optionStr}
- 개수: ${item.item_count}
- 단가: ${item.unit_price?.toLocaleString() ?? "-"}원
- 총 금액: ${total?.toLocaleString() ?? "-"}원
`
          }
        }
      ]
    }
  };
});

  // --------- Notion API로 페이지 생성 ---------
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
      ...furnitureBlocks
    ],
  };

  try {
    const response = await notion.pages.create(notionPage);
    console.log(`✅ Notion 페이지 생성 완료: ${response.id}`);
  } catch (error) {
    console.error("[Notion Sync Error]", (error as Error).message);
    throw error;
  }
}
