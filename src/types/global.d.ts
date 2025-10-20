export {};

declare global {
  interface Window {
    screen_name: string | null;
    __prev_screen_name?: string | null;
  }
}
