/**
 * 동작 뒤 화면 옮기기 — 바로키친 어드민 lib/nav/go 와 같은 규칙.
 *  goBack: 앞 화면이 없으면(새 탭·링크로 바로 열었으면) 정해 둔 곳으로. 앱 밖으로 나가지 않는다.
 *  goAfterSubmit: 주문·접수처럼 끝난 뒤 넘어가는 곳은 replace — 뒤로 가도 빈 입력 화면이 다시 나오지 않게.
 *  goAfterSave: 하위 입력 화면(주소·전화·요청) 저장 뒤 돌아가기 — goBack 과 같고 갈 곳을 꼭 적는다.
 */
type Router = { back: () => void; replace: (href: string) => void; push: (href: string) => void };

export function goBack(router: Router, fallback = "/") {
  if (typeof window !== "undefined" && window.history.length > 1) router.back();
  else router.replace(fallback);
}

export function goAfterSubmit(router: Router, href: string) {
  router.replace(href);
}

export const goAfterSave = goBack;
