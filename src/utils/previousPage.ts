// src/utils/previousPage.ts

// 전역 previousPage 변수 선언 및 관리
export let previousPage: string | null = null;

export function setPreviousPage(page: string) {
  previousPage = page;
}

export function getPreviousPage() {
  return previousPage;
}
