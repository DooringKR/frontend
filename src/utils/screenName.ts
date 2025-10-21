export const setScreenName = (name: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    // Derive previous from current window or sessionStorage (persists across reloads in same tab)
    const storagePrev = (() => {
      try {
        return sessionStorage.getItem('screen_name_current');
      } catch (_) {
        return null;
      }
    })();
    const prev = (window.screen_name ?? storagePrev ?? null) as string | null;

    window.__prev_screen_name = prev;
    window.screen_name = name;

    try {
      sessionStorage.setItem('screen_name_prev', prev ?? '');
      sessionStorage.setItem('screen_name_current', name ?? '');
    } catch (_) {
      // ignore storage errors (e.g., Safari in private mode)
    }
  } catch (_) {
    window.__prev_screen_name = window.screen_name ?? null;
    window.screen_name = name;
  }
};

export const getCurrentScreenName = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.screen_name ?? null;
};

export const getPreviousScreenName = (): string | null => {
  if (typeof window === 'undefined') return null;
  const fromWindow = window.__prev_screen_name ?? null;
  if (fromWindow) return fromWindow;
  try {
    const v = sessionStorage.getItem('screen_name_prev');
    return v ? v : null;
  } catch (_) {
    return null;
  }
};

// Convenience alias used across the app
export const getScreenName = (): string | null => {
  if (typeof window === 'undefined') return null;
  const fromWindow = window.screen_name ?? null;
  if (fromWindow) return fromWindow;
  try {
    const v = sessionStorage.getItem('screen_name_current');
    return v && v.length > 0 ? v : null;
  } catch (_) {
    return null;
  }
};
