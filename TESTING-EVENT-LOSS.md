# Amplitude 이벤트 누락 재현 테스트

이 파일들은 **테스트 목적으로만** 사용됩니다. 프로덕션 이벤트 누락을 재현하기 위해 모든 보호 메커니즘을 제거했습니다.

## 파일 구조

- `src/services/analytics/amplitude-unstable.ts` - 불안정한 설정의 래퍼
- `src/app/(client-helpers)/init-amplitude-unstable.ts` - 불안정 모드 초기화 헬퍼

## 재현 방법

### 1. 레이아웃에서 불안정 버전 사용

기존 `InitAmplitude`를 임시로 교체:

```tsx
// src/app/layout.tsx 또는 해당 레이아웃
import InitAmplitudeUnstable from '@/app/(client-helpers)/init-amplitude-unstable';

export default function Layout({ children }) {
  return (
    <>
      <InitAmplitudeUnstable />
      {children}
    </>
  );
}
```

### 2. View/Click 추적을 불안정 버전으로 변경

```tsx
// 테스트할 컴포넌트에서
import { 
  trackViewAndWaitUnstable,
  trackClickAndWaitUnstable 
} from '@/services/analytics/amplitude-unstable';

// View 이벤트 누락 테스트
useEffect(() => {
  trackViewAndWaitUnstable({
    object_type: 'screen',
    object_name: 'test_page',
    current_screen: '/test',
    previous_screen: null,
  }).then(() => {
    // 즉시 리다이렉트 (View 이벤트 100% 누락)
    router.push('/other-page');
  });
}, []);

// Click 이벤트 누락 테스트
const handleClick = async () => {
  await trackClickAndWaitUnstable({
    object_type: 'button',
    object_name: 'test_redirect',
    current_page: '/test',
    modal_name: null,
  });
  
  // 즉시 리다이렉트 (Click 이벤트 100% 누락)
  window.location.href = 'https://google.com';
};
```

### 3. 콘솔 + 네트워크 탭에서 확인

1. 개발자 도구 열기
2. **콘솔**: 🔴 빨간 아이콘과 함께 "WILL BE LOST" 메시지 표시
3. **Network 탭**: "Preserve log" 체크
4. 버튼 클릭 또는 페이지 이동
5. **결과**: 
   - 콘솔에 경고 표시됨
   - `/2/httpapi` 요청이 **cancelled** 또는 아예 전송 안 됨
   - Amplitude Live에서 이벤트 안 보임

## 이벤트 누락을 유발하는 요소들

### ❌ Transport: fetch (not beacon)
```typescript
transport: 'fetch'  // 페이지 언로드 시 취소됨
```
- fetch/XHR은 브라우저가 언로드 시 중단
- beacon은 백그라운드 큐잉 보장

### ❌ 큰 flush queue
```typescript
flushQueueSize: 30  // 30개 이벤트가 쌓여야 전송
```
- 클릭 1개만 발생 → 큐에만 있고 전송 안 됨
- 리다이렉트 → 메모리 소실

### ❌ 긴 flush interval
```typescript
flushIntervalMillis: 10000  // 10초마다 flush
```
- 클릭 후 즉시 리다이렉트 → 10초 기다릴 시간 없음

### ❌ No flush call
```typescript
amp.track('Click', props);  // flush() 호출 없음
```
- 이벤트가 큐에만 들어가고 강제 전송 안 됨

### ❌ No await
```typescript
await new Promise(r => setTimeout(r, 5));  // 5ms만 대기 (10ms에서 감소)
```
- fetch 요청이 완료되려면 보통 50-200ms 필요
- **5ms 후 리다이렉트 → 요청 100% 취소 보장**
- 콘솔에 🔴 경고 표시로 시각적 확인 가능

## 안정 버전과 비교

| 항목 | 안정 버전 (amplitude.ts) | 불안정 버전 (amplitude-unstable.ts) |
|------|------------------------|-----------------------------------|
| Transport | `beacon` | `fetch` ❌ |
| Flush queue | `1` (즉시) | `30` (배치) ❌ |
| Flush interval | `500ms` | `10000ms` ❌ |
| Flush 호출 | ✅ 무조건 | ❌ 없음 |
| Await timeout | 400ms | **5ms** ❌ |
| sendBeacon fallback | ✅ | ❌ |
| 콘솔 경고 | - | 🔴 "WILL BE LOST" |
| 이벤트 전송률 | ~100% | **~0%** ✅

## 테스트 시나리오

### 시나리오 1: 카카오 로그인 (외부 리다이렉트)
```tsx
const handleKakaoLogin = async () => {
  await trackClickAndWaitUnstable({ 
    object_type: 'button',
    object_name: 'kakao_login',
    current_page: '/start',
    modal_name: null,
  });
  window.location.href = KAKAO_OAUTH_URL; 
  // 콘솔: 🔴 Click event with fake wait - WILL BE LOST: kakao_login
  // 네트워크: /2/httpapi cancelled
};
```

### 시나리오 2: 빠른 페이지 전환
```tsx
const handleNext = async () => {
  trackViewUnstable({ 
    object_type: 'screen',
    object_name: 'form_page',
    current_screen: '/form',
    previous_screen: '/start',
  });
  router.push('/next-page'); 
  // 콘솔: 🔴 View event queued (likely to be lost): /form
  // 즉시 전환, 이벤트 100% 누락!
};
```

### 시나리오 3: 페이지 로드 시 View 이벤트
```tsx
useEffect(() => {
  trackViewAndWaitUnstable({
    object_type: 'screen',
    object_name: 'landing',
    current_screen: '/landing',
    previous_screen: null,
  }).then(() => {
    // 바로 다른 페이지로 이동
    setTimeout(() => router.push('/home'), 100);
  });
}, []);
// 콘솔: 🔴 View event with fake wait - WILL BE LOST: /landing
// 5ms 대기 후 리턴, 100ms 후 이동 → fetch는 이미 취소됨
```

### 시나리오 4: 모바일에서 앱 전환
- 모바일에서 외부 링크 클릭 → 앱 전환
- 페이지가 백그라운드로 이동하면서 fetch 취소
- 콘솔에 🔴 경고 표시, 네트워크 탭에서 cancelled 확인

## 원복 방법

테스트 완료 후 반드시 안정 버전으로 되돌리기:

```tsx
// 다시 안정 버전 사용
import InitAmplitude from '@/app/(client-helpers)/init-amplitude';
import { trackClickAndWait } from '@/services/analytics/amplitude';
```

## 주의사항

⚠️ **절대 프로덕션에 배포하지 마세요**
⚠️ **테스트 후 반드시 안정 버전으로 되돌리세요**
⚠️ **콘솔에 "🔴 UNSTABLE MODE" 및 "WILL BE LOST" 경고가 표시됩니다**

## 왜 "거의 100%" 누락되는가?

현재 unstable 설정은 **의도적으로 극단적**입니다:

1. **fetch transport** - 언로드 시 100% 취소
2. **flushQueueSize: 30** - 30개 쌓일 때까지 전송 안 함 (테스트에서는 1-2개만 발생)
3. **flushIntervalMillis: 10000** - 10초마다만 전송 (리다이렉트는 5ms 후)
4. **No flush()** - 강제 전송 없음
5. **5ms timeout** - 네트워크 요청이 완료될 물리적 시간 없음
6. **콘솔 경고** - 🔴 아이콘으로 시각적 확인

이 조합으로 **거의 100%** 이벤트 누락을 보장합니다. 네트워크 탭에서 "cancelled"를 직접 눈으로 확인할 수 있습니다.
