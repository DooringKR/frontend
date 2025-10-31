// Lightweight Amplitude wrapper for manual event tracking
// Usage: call initAmplitude once (e.g., in app layout), then call trackView/trackClick

let amp: typeof import('@amplitude/analytics-browser') | null = null;
let initialized = false;
const preInitQueue: Array<{ name: string; props: Record<string, any> }> = [];

export type ViewEventProps = {
  object_type: string | null;
  object_name: string | null;
  current_screen: string | null;
  previous_screen: string | null;
};

export type ClickEventProps = {
  object_type: string | null;
  object_name: string | null;
  current_page: string | null;
  modal_name: string | null;
};

export type AddToCartEventProps = {
  product_type: string[]; // 카트 내 모든 product_type 배열 (중복 제거, 정렬)
  detail_product_type: string[]; // 카트 내 모든 detail_product_type 배열 (중복 제거, 정렬)
  quantity: number; // 방금 추가한 아이템의 수량
  price_unit: number; // 방금 추가한 아이템의 단가
  cart_quantity_total_before: number; // 추가 전 카트 내 총 수량
  cart_quantity_type_before: number; // 추가 전 카트 내 아이템 종류 개수
  cart_value_before: number; // 추가 전 카트 내 총 금액
};

export type PurchaseEventProps = {
  product_type: string[]; // 주문 내 모든 product_type 배열 (중복 제거, 정렬)
  detail_product_type: string[]; // 주문 내 모든 detail_product_type 배열 (중복 제거, 정렬)
  quantity_total: number; // 주문 내 아이템 개수의 총합
  quantity_type: number; // 주문 내 아이템 배열의 길이
  revenue_total: number; // 가구금액 + 배송비 - 할인총액
  revenue_product: number; // 가구 금액
  revenue_shipping: number; // 배송비
  coupon: boolean; // 쿠폰 적용 여부
  discount_total: number; // 할인 총액
  reward_point: number; // 적립 금액
  shipping_method: "배송" | "픽업"; // 배송 방법
  shipping_year: number; // 배송/픽업 연도
  shipping_month: number; // 배송/픽업 월
  shipping_day: number; // 배송/픽업 일
  shipping_hour: number; // 배송/픽업 시간
  shipping_minute: number; // 배송/픽업 분
};

export const initAmplitude = async (
  apiKey: string,
  // Keep config loosely typed to avoid coupling with SDK internal types
  config?: Record<string, any>
) => {
  if (initialized) return;
  if (typeof window === 'undefined') return; // client only
  const mod = await import('@amplitude/analytics-browser');
  amp = mod;
  // Provide safe defaults that improve delivery on navigation/redirect
  const defaultConfig: Record<string, any> = {
    transport: 'beacon', // prefer Beacon API to survive unloads
    flushQueueSize: 1, // send immediately for critical events
    flushIntervalMillis: 500, // short interval if batching occurs
    defaultTracking: false,
  };
  amp.init(apiKey, undefined, { ...defaultConfig, ...(config ?? {}) });
  initialized = true;
  // flush queued events
  preInitQueue.splice(0).forEach(({ name, props }) => {
    try {
      amp!.track(name, props);
    } catch { }
  });
};

// Attempt to use globally injected Amplitude (from CDN snippet in layout)
const getGlobalAmplitude = (): any | null => {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w && w.amplitude ? w.amplitude : null;
};

// Internal: best-effort send via SDK or global, otherwise queue
const send = (name: string, props: Record<string, any>) => {
  // Prefer SDK if initialized
  if (initialized && amp) {
    try {
      amp.track(name, props);
      return;
    } catch {
      // fall through
    }
  }
  const globalAmp = getGlobalAmplitude();
  if (globalAmp) {
    try {
      globalAmp.track(name, props);
      return;
    } catch {
      // fall through to queue
    }
  }
  preInitQueue.push({ name, props });
};

// normalize helper: convert empty string/undefined to null
const normalize = <T extends Record<string, any>>(props: T): T => {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === '') {
      out[k] = null;
    } else {
      out[k] = v;
    }
  }
  return out as T;
};

// Amplitude Live View hides null-valued properties; encode them as the string "null"
const encodeForAmplitude = <T extends Record<string, any>>(props: T): T => {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(props)) {
    out[k] = v === null ? 'null' : v;
  }
  return out as T;
};

export const trackView = (props: ViewEventProps) => {
  const payload = encodeForAmplitude(normalize(props));
  send('View', payload);
};

// Awaitable view tracking - use when view happens right before navigation
export const trackViewAndWait = async (
  props: ViewEventProps,
  options?: { timeoutMs?: number }
) => {
  const payload = encodeForAmplitude(normalize(props));

  // Same guaranteed delivery as trackClickAndWait
  if (initialized && amp) {
    try {
      amp.track('View', payload);

      if (typeof (amp as any).flush === 'function') {
        try {
          const flushResult = (amp as any).flush();
          if (flushResult && typeof flushResult.then === 'function') {
            await flushResult;
          }
          await new Promise((r) => setTimeout(r, 50));
          return;
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('[Amplitude] flush failed:', err);
          }
        }
      }

      await new Promise((r) => setTimeout(r, options?.timeoutMs ?? 400));
      return;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[Amplitude] track failed:', err);
      }
    }
  }

  const globalAmp = getGlobalAmplitude();
  if (globalAmp) {
    try {
      globalAmp.track('View', payload);
      if (typeof globalAmp.flush === 'function') {
        try {
          const flushResult = globalAmp.flush();
          if (flushResult && typeof flushResult.then === 'function') {
            await flushResult;
          }
        } catch {
          // ignore
        }
      }
      await new Promise((r) => setTimeout(r, options?.timeoutMs ?? 400));
      return;
    } catch {
      // ignore
    }
  }

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    if (apiKey) {
      try {
        const beaconPayload = {
          api_key: apiKey,
          events: [
            {
              event_type: 'View',
              event_properties: payload,
              time: Date.now(),
            },
          ],
        };
        const sent = navigator.sendBeacon(
          'https://api2.amplitude.com/2/httpapi',
          JSON.stringify(beaconPayload)
        );
        if (sent) {
          return;
        }
      } catch {
        // ignore beacon failure
      }
    }
  }

  preInitQueue.push({ name: 'View', props: payload });
  await new Promise((r) => setTimeout(r, options?.timeoutMs ?? 400));
};

export const trackClick = (props: ClickEventProps) => {
  const payload = encodeForAmplitude(normalize(props));
  send('Click', payload);
};

// Awaitable click tracking useful before hard navigations / OAuth redirects
// CRITICAL: ensures event is sent before redirect, using flush + promise + beacon fallback
export const trackClickAndWait = async (
  props: ClickEventProps,
  options?: { timeoutMs?: number; flush?: boolean }
) => {
  const payload = encodeForAmplitude(normalize(props));

  // Strategy 1: Use SDK with guaranteed flush
  if (initialized && amp) {
    try {
      // Track the event first
      amp.track('Click', payload);

      // ALWAYS flush when available (ignore options.flush - we want certainty)
      if (typeof (amp as any).flush === 'function') {
        try {
          const flushResult = (amp as any).flush();
          // If flush returns a promise, await it
          if (flushResult && typeof flushResult.then === 'function') {
            await flushResult;
          }
          // Even if flush is void, give a tiny buffer for beacon dispatch
          await new Promise((r) => setTimeout(r, 50));
          return;
        } catch (err) {
          // Log flush failure in dev
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('[Amplitude] flush failed:', err);
          }
        }
      }

      // Fallback: if no flush API, wait longer to let beacon transport complete
      await new Promise((r) => setTimeout(r, options?.timeoutMs ?? 400));
      return;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[Amplitude] track failed:', err);
      }
    }
  }

  // Strategy 2: Fallback to global amplitude with sendBeacon polyfill
  const globalAmp = getGlobalAmplitude();
  if (globalAmp) {
    try {
      globalAmp.track('Click', payload);
      // Try to flush global instance if available
      if (typeof globalAmp.flush === 'function') {
        try {
          const flushResult = globalAmp.flush();
          if (flushResult && typeof flushResult.then === 'function') {
            await flushResult;
          }
        } catch {
          // ignore
        }
      }
      // Wait for beacon
      await new Promise((r) => setTimeout(r, options?.timeoutMs ?? 400));
      return;
    } catch {
      // ignore
    }
  }

  // Strategy 3: Manual sendBeacon as last resort
  // If SDK isn't initialized, try to send directly via Beacon API
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    if (apiKey) {
      try {
        const beaconPayload = {
          api_key: apiKey,
          events: [
            {
              event_type: 'Click',
              event_properties: payload,
              time: Date.now(),
            },
          ],
        };
        const sent = navigator.sendBeacon(
          'https://api2.amplitude.com/2/httpapi',
          JSON.stringify(beaconPayload)
        );
        if (sent) {
          // Beacon queued successfully
          return;
        }
      } catch {
        // ignore beacon failure
      }
    }
  }

  // Last resort: queue for later
  preInitQueue.push({ name: 'Click', props: payload });
  await new Promise((r) => setTimeout(r, options?.timeoutMs ?? 400));
};

// User ID 설정
export const setAmplitudeUserId = (userId: string) => {
  if (initialized && amp) {
    amp.setUserId(userId);
  }
  // fallback to global
  const globalAmp = getGlobalAmplitude();
  if (globalAmp && typeof globalAmp.setUserId === 'function') {
    globalAmp.setUserId(userId);
  }
};

// User Properties 설정
export const setAmplitudeUserProperties = (properties: {
  business_type?: string;
  providers?: string;
  [key: string]: any;
}) => {
  if (initialized && amp) {
    try {
      const identify = new amp.Identify();
      Object.entries(properties).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          identify.set(key, value);
        }
      });
      amp.identify(identify);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[Amplitude] identify failed:', err);
      }
    }
  }
  
  // fallback to global
  const globalAmp = getGlobalAmplitude();
  if (globalAmp && typeof globalAmp.identify === 'function') {
    try {
      const identify = new globalAmp.Identify();
      Object.entries(properties).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          identify.set(key, value);
        }
      });
      globalAmp.identify(identify);
    } catch {
      // ignore
    }
  }
};

// Sign Up 이벤트 타입 정의
export type SignupEventProps = {
  business_type: string | null;
  providers: string | null;
};

// Sign Up 이벤트 전송 (회원가입 성공 시)
export const trackSignup = async (props: SignupEventProps) => {
  const payload = encodeForAmplitude(normalize(props));

  // Same guaranteed delivery as trackClickAndWait
  if (initialized && amp) {
    try {
      amp.track('Sign Up', payload);
      
      if (typeof (amp as any).flush === 'function') {
        try {
          const flushResult = (amp as any).flush();
          if (flushResult && typeof flushResult.then === 'function') {
            await flushResult;
          }
          await new Promise((r) => setTimeout(r, 50));
          return;
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('[Amplitude] signup flush failed:', err);
          }
        }
      }
      
      await new Promise((r) => setTimeout(r, 400));
      return;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[Amplitude] signup track failed:', err);
      }
    }
  }

  const globalAmp = getGlobalAmplitude();
  if (globalAmp) {
    try {
      globalAmp.track('Sign Up', payload);
      if (typeof globalAmp.flush === 'function') {
        try {
          const flushResult = globalAmp.flush();
          if (flushResult && typeof flushResult.then === 'function') {
            await flushResult;
          }
        } catch {
          // ignore
        }
      }
      await new Promise((r) => setTimeout(r, 400));
      return;
    } catch {
      // ignore
    }
  }

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    if (apiKey) {
      try {
        const beaconPayload = {
          api_key: apiKey,
          events: [
            {
              event_type: 'Sign Up',
              event_properties: payload,
              time: Date.now(),
            },
          ],
        };
        const sent = navigator.sendBeacon(
          'https://api2.amplitude.com/2/httpapi',
          JSON.stringify(beaconPayload)
        );
        if (sent) {
          return;
        }
      } catch {
        // ignore beacon failure
      }
    }
  }

  preInitQueue.push({ name: 'Sign Up', props: payload });
  await new Promise((r) => setTimeout(r, 400));
};

// Add to Cart 이벤트 전송 (장바구니에 아이템 추가 시)
export const trackAddToCart = async (props: AddToCartEventProps) => {
  const payload = encodeForAmplitude(normalize(props));

  // Same guaranteed delivery as trackClickAndWait
  if (initialized && amp) {
    try {
      amp.track('Add to Cart', payload);
      
      if (typeof (amp as any).flush === 'function') {
        try {
          const flushResult = (amp as any).flush();
          if (flushResult && typeof flushResult.then === 'function') {
            await flushResult;
          }
          await new Promise((r) => setTimeout(r, 50));
          return;
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('[Amplitude] add to cart flush failed:', err);
          }
        }
      }
      
      await new Promise((r) => setTimeout(r, 400));
      return;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[Amplitude] add to cart track failed:', err);
      }
    }
  }

  const globalAmp = getGlobalAmplitude();
  if (globalAmp) {
    try {
      globalAmp.track('Add to Cart', payload);
      if (typeof globalAmp.flush === 'function') {
        try {
          const flushResult = globalAmp.flush();
          if (flushResult && typeof flushResult.then === 'function') {
            await flushResult;
          }
        } catch {
          // ignore
        }
      }
      await new Promise((r) => setTimeout(r, 400));
      return;
    } catch {
      // ignore
    }
  }

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    if (apiKey) {
      try {
        const beaconPayload = {
          api_key: apiKey,
          events: [
            {
              event_type: 'Add to Cart',
              event_properties: payload,
              time: Date.now(),
            },
          ],
        };
        const sent = navigator.sendBeacon(
          'https://api2.amplitude.com/2/httpapi',
          JSON.stringify(beaconPayload)
        );
        if (sent) {
          return;
        }
      } catch {
        // ignore beacon failure
      }
    }
  }

  preInitQueue.push({ name: 'Add to Cart', props: payload });
  await new Promise((r) => setTimeout(r, 400));
};

// Purchase 이벤트 전송 (주문 완료 시)
export const trackPurchase = async (props: PurchaseEventProps) => {
  const payload = encodeForAmplitude(normalize(props));

  // Same guaranteed delivery pattern
  if (initialized && amp) {
    try {
      amp.track('Purchase', payload);
      
      if (typeof (amp as any).flush === 'function') {
        try {
          const flushResult = (amp as any).flush();
          if (flushResult && typeof flushResult.then === 'function') {
            await flushResult;
          }
          await new Promise((r) => setTimeout(r, 50));
          return;
        } catch (err) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('[Amplitude] purchase flush failed:', err);
          }
        }
      }
      
      await new Promise((r) => setTimeout(r, 400));
      return;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[Amplitude] purchase track failed:', err);
      }
    }
  }

  const globalAmp = getGlobalAmplitude();
  if (globalAmp) {
    try {
      globalAmp.track('Purchase', payload);
      if (typeof globalAmp.flush === 'function') {
        try {
          const flushResult = globalAmp.flush();
          if (flushResult && typeof flushResult.then === 'function') {
            await flushResult;
          }
        } catch {
          // ignore
        }
      }
      await new Promise((r) => setTimeout(r, 400));
      return;
    } catch {
      // ignore
    }
  }

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    if (apiKey) {
      try {
        const beaconPayload = {
          api_key: apiKey,
          events: [
            {
              event_type: 'Purchase',
              event_properties: payload,
              time: Date.now(),
            },
          ],
        };
        const sent = navigator.sendBeacon(
          'https://api2.amplitude.com/2/httpapi',
          JSON.stringify(beaconPayload)
        );
        if (sent) {
          return;
        }
      } catch {
        // ignore beacon failure
      }
    }
  }

  preInitQueue.push({ name: 'Purchase', props: payload });
  await new Promise((r) => setTimeout(r, 400));
};
