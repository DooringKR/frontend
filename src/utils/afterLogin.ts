/**
 * 로그인 뒤 돌아갈 곳 — 로그인을 강제하지 않고 둘러보다가, 주문 직전에 로그인 화면으로 보낸 경우(상황 주문 확인 화면).
 * 카카오 로그인은 같은 탭에서 다녀오므로 탭 저장소에 둔다. 로그인·가입이 끝나는 자리에서 한 번 꺼내 쓴다.
 */
const KEY = "after-login";

export function setAfterLogin(path: string) {
  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    // 저장이 막힌 브라우저면 홈으로 간다
  }
}

/** 꺼내면서 지운다. 우리 사이트 안 경로만 */
export function takeAfterLogin(): string | null {
  try {
    const p = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return p && p.startsWith("/") && !p.startsWith("//") ? p : null;
  } catch {
    return null;
  }
}
