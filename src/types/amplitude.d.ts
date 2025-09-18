declare global {
  interface Window {
    amplitude?: {
      track: (eventName: string, eventProperties?: Record<string, any>) => void;
      setUserId?: (userId: string) => void;
    };
  }
}
export {};
