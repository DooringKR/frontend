import {
  AccessoryRequest,
  AccessoryResponse,
  CabinetRequest,
  CabinetResponse,
  DoorRequest,
  DoorResponse,
  FinishRequest,
  FinishResponse,
  HardwareRequest,
  HardwareResponse,
} from "@/types/apiType";

// 문짝 가격 조회
export async function checkDoorPrice(body: DoorRequest): Promise<DoorResponse> {
  const response = await fetch("/api/checkcash/door", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("문짝 가격 조회 실패");
  }

  const data: DoorResponse = await response.json();
  return data;
}

// 마감재 가격 조회
export async function checkFinishPrice(body: FinishRequest): Promise<FinishResponse> {
  const response = await fetch("/api/checkcash/finish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("마감재 가격 조회 실패");
  }

  const data: FinishResponse = await response.json();
  return data;
}

// 부분장 가격 조회
export async function checkCabinetPrice(body: CabinetRequest): Promise<CabinetResponse> {
  const response = await fetch("/api/checkcash/cabinet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("부분장 가격 조회 실패");
  }

  const data: CabinetResponse = await response.json();
  return data;
}

// 부속품 가격 조회
export async function checkAccessoryPrice(body: AccessoryRequest): Promise<AccessoryResponse> {
  const response = await fetch("/api/checkcash/accessory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("부속품 가격 조회 실패");
  }

  const data: AccessoryResponse = await response.json();
  return data;
}

// 하드웨어 가격 조회
export async function checkHardWarePrice(body: HardwareRequest): Promise<HardwareResponse> {
  const response = await fetch("/api/checkcash/hardware", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("하드웨어 가격 조회 실패");
  }

  const data: HardwareResponse = await response.json();
  return data;
}
