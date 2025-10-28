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

// amplitude.ts에 추가
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