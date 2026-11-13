import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const isMaintenanceMode = (): boolean => {
    return false;
};

/** shadcn 클래스 합치기 — 뒤에 온 것이 이긴다 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 그림 주소 꺼내기 — dooring-core-domain 색·종류 목록의 image 는 타입이 string 이지만 실제로는 정적 그림 객체({ src })다.
 * 그대로 url(...)·img src 에 넣으면 깨진다(롱문 문 칸 배경이 그랬다).
 */
export function imageSrc(image: unknown): string | undefined {
  if (typeof image === "string") return image || undefined;
  if (image && typeof image === "object" && "src" in image && typeof (image as { src: unknown }).src === "string") return (image as { src: string }).src;
  return undefined;
}
