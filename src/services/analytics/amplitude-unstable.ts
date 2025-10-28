// TESTING ONLY: Unstable amplitude wrapper to reproduce event loss
// This file intentionally removes all safeguards to simulate production event drops

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

// Initialize with UNSTABLE settings that cause event loss
export const initAmplitudeUnstable = async (
  apiKey: string,
  config?: Record<string, any>
) => {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  const mod = await import('@amplitude/analytics-browser');
  amp = mod;
  
  // UNSTABLE: Use fetch transport (not beacon) - cancels on navigation
  // UNSTABLE: Large flush queue - batches events instead of sending immediately
  // UNSTABLE: Long flush interval - delays sending
  const unstableConfig: Record<string, any> = {
    transport: 'fetch', // ❌ Will be cancelled on redirect
    flushQueueSize: 30, // ❌ Won't send until 30 events accumulated
    flushIntervalMillis: 10000, // ❌ 10 second delay
    defaultTracking: false,
  };
  
  amp.init(apiKey, undefined, { ...unstableConfig, ...(config ?? {}) });
  initialized = true;
  
  // Flush queue without waiting (fire and forget)
  preInitQueue.splice(0).forEach(({ name, props }) => {
    try {
      amp!.track(name, props);
    } catch {}
  });
};

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

const encodeForAmplitude = <T extends Record<string, any>>(props: T): T => {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(props)) {
    out[k] = v === null ? 'null' : v;
  }
  return out as T;
};

// UNSTABLE: Fire and forget, no waiting
const sendUnstable = (name: string, props: Record<string, any>) => {
  if (initialized && amp) {
    try {
      amp.track(name, props); // No await, no flush, no promise handling
      return;
    } catch {}
  }
  // If not initialized, just queue (will likely be lost on redirect)
  preInitQueue.push({ name, props });
};

export const trackViewUnstable = (props: ViewEventProps) => {
  const payload = encodeForAmplitude(normalize(props));
  sendUnstable('View', payload);
  // eslint-disable-next-line no-console
  console.log('🔴 [UNSTABLE] View event queued (likely to be lost):', props.current_screen);
};

export const trackClickUnstable = (props: ClickEventProps) => {
  const payload = encodeForAmplitude(normalize(props));
  sendUnstable('Click', payload);
  // eslint-disable-next-line no-console
  console.log('🔴 [UNSTABLE] Click event queued (likely to be lost):', props.object_name);
};

// UNSTABLE: Pretends to wait but GUARANTEES event loss on redirect
export const trackViewAndWaitUnstable = async (
  props: ViewEventProps,
  options?: { timeoutMs?: number }
) => {
  const payload = encodeForAmplitude(normalize(props));
  
  // eslint-disable-next-line no-console
  console.log('🔴 [UNSTABLE] View event with fake wait - WILL BE LOST:', props.current_screen);
  
  // Just track without any safeguards
  if (initialized && amp) {
    try {
      amp.track('View', payload); // No flush, no promise await
    } catch {}
  } else {
    preInitQueue.push({ name: 'View', props: payload });
  }
  
  // CRITICAL: Only 5ms wait - guarantees fetch will be cancelled on redirect
  await new Promise((r) => setTimeout(r, options?.timeoutMs ?? 5));
  // Navigation will happen before fetch completes = 100% event loss!
};

// UNSTABLE: Pretends to wait but doesn't actually ensure delivery
export const trackClickAndWaitUnstable = async (
  props: ClickEventProps,
  options?: { timeoutMs?: number }
) => {
  const payload = encodeForAmplitude(normalize(props));
  
  // eslint-disable-next-line no-console
  console.log('🔴 [UNSTABLE] Click event with fake wait - WILL BE LOST:', props.object_name);
  
  // Just track without any safeguards
  if (initialized && amp) {
    try {
      amp.track('Click', payload); // No flush, no promise await
    } catch {}
  } else {
    preInitQueue.push({ name: 'Click', props: payload });
  }
  
  // CRITICAL: Only 5ms wait - guarantees fetch will be cancelled on redirect
  await new Promise((r) => setTimeout(r, options?.timeoutMs ?? 5));
  // Navigation will happen before fetch completes = 100% event loss!
};
