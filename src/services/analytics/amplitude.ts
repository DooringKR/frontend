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
  if (!initialized || !amp) {
    preInitQueue.push({ name: 'View', props: payload });
    return;
  }
  amp.track('View', payload);
};

export const trackClick = (props: ClickEventProps) => {
  const payload = encodeForAmplitude(normalize(props));
  if (!initialized || !amp) {
    preInitQueue.push({ name: 'Click', props: payload });
    return;
  }
  amp.track('Click', payload);
};
