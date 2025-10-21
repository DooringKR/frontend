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
  amp.init(apiKey, undefined, config);
  initialized = true;
  // flush queued events
  preInitQueue.splice(0).forEach(({ name, props }) => {
    try {
      amp!.track(name, props);
    } catch {}
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

export const trackClick = (props: ClickEventProps) => {
  const payload = encodeForAmplitude(normalize(props));
  send('Click', payload);
};

// Awaitable click tracking useful before hard navigations / OAuth redirects
export const trackClickAndWait = async (
  props: ClickEventProps,
  options?: { timeoutMs?: number }
) => {
  const payload = encodeForAmplitude(normalize(props));

  // Try SDK first: it returns a promise we can await
  if (initialized && amp) {
    try {
      const res = amp.track('Click', payload);
      // Some versions expose a .promise, others may be then-able, many return void
      const maybeAny = res as any;
      if (maybeAny && maybeAny.promise && typeof maybeAny.promise.then === 'function') {
        try {
          await maybeAny.promise;
          return;
        } catch {
          // ignore and fall back to timeout
        }
      } else if (maybeAny && typeof maybeAny.then === 'function') {
        try {
          await maybeAny;
          return;
        } catch {
          // ignore and fall back to timeout
        }
      } else {
        // No promise, fall back to small delay
        await new Promise((r) => setTimeout(r, options?.timeoutMs ?? 150));
        return;
      }
    } catch {
      // ignore and fall through
    }
  }

  // Fallback to global amplitude (no promise API) then wait a short time
  const globalAmp = getGlobalAmplitude();
  if (globalAmp) {
    try {
      globalAmp.track('Click', payload);
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, options?.timeoutMs ?? 150));
    return;
  }

  // If neither available, queue and still delay a bit to increase chance of later flush
  preInitQueue.push({ name: 'Click', props: payload });
  await new Promise((r) => setTimeout(r, options?.timeoutMs ?? 150));
};
