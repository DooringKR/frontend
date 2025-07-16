// src/services/notionService.ts

import { Client } from "@notionhq/client";
import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";

// ✅ Notion 클라이언트 인스턴스
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  throw new Error("환경변수 NOTION_TOKEN 또는 NOTION_DATABASE_ID가 설정되지 않았습니다.");
}

const notion = new Client({
  auth: NOTION_TOKEN,
  notionVersion: "2022-06-28",
});

/** 주문 한 건을 Notion DB에 추가하기 위한 페이로드 인터페이스 */
export interface NotionOrderPayload {
  orderedAt: Date;             // 📅 주문일시
  customerName: string;        // Aa 고객성함 (Title)
  recipientPhone: string;      // 📞 전화번호
  shippingMethod: string;      // ▽ 배송방법 (Select)
  materialType: string;        // ▽ 자재종류 (Select)
}

/** Notion Database의 Select 유효값 정의 */
const VALID_SHIPPING_METHODS = ["직접 픽업하러 갈게요", "현장으로 배송해주세요"]; 
const VALID_MATERIAL_TYPES = ['문짝', '부속', '하드웨어', '기타(고객센터 직접 문의)']; 

/** Notion 주문 생성 함수 */
export async function createNotionOrderPage(payload: NotionOrderPayload): Promise<void> {
  try {
    // 배송 방법 유효성 검사
    if (!VALID_SHIPPING_METHODS.includes(payload.shippingMethod)) {
      throw new Error(`❌ 유효하지 않은 배송방법입니다: ${payload.shippingMethod}`);
    }
    // 자재종류 유효성 검사
    if (!VALID_MATERIAL_TYPES.includes(payload.materialType)) {
      throw new Error(`❌ 유효하지 않은 자재종류입니다: ${payload.materialType}`);
    }

    const newPage: CreatePageParameters = {
      parent: { database_id: NOTION_DATABASE_ID! },
      properties: {
        // 1) “주문일시” → Date 속성
        "주문일시": {
          date: { start: payload.orderedAt.toISOString() }
        },
        // 2) “고객성함” → Title 속성
        "고객성함": {
          title: [{ text: { content: payload.customerName } }]
        },
        // 3) “전화번호” → Phone 속성
        "전화번호": {
          phone_number: payload.recipientPhone
        },
        // 4) “배송방법” → Select 속성
        "배송방법": {
          select: { name: payload.shippingMethod }
        },
        // 5) “자재종류” → Select 속성 (Multi-select가 아니라 단일 값)
        "자재종류": {
          select: { name: payload.materialType }
        }
      }
    };

    const response = await notion.pages.create(newPage);
    console.log(`✅ Notion 페이지가 성공적으로 생성되었습니다: ${response.id}`);
  } catch (error) {
    console.error("❌ Notion 페이지 생성 중 오류 발생:", (error as Error).message);
    throw error;
  }
}
