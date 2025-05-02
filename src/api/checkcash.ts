export interface AccessoryRequest {
  category: "accessory";
  slug: "싱크볼" | "후드" | "쿡탑";
  madeBy: string;
  model: string;
  orderRepuests: string;
}

export interface AccessoryResponse {
  category: "accessory";
  slug: "싱크볼" | "후드" | "쿡탑";
  madeBy: string;
  model: string;
  orderRepuests: string;
  price: number;
}

export async function checkAccessoryPrice(body: AccessoryRequest): Promise<AccessoryResponse> {
  const response = await fetch("/api/checkcash/accessory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("액세서리 가격 조회 실패");
  }

  const data: AccessoryResponse = await response.json();
  return data;
}
