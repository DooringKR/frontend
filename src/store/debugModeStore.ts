import { create } from "zustand";

interface DebugModeStore {
  isDebugMode: boolean;
  toggleDebugMode: () => void;
}

const useDebugModeStore = create<DebugModeStore>()((set) => ({
  isDebugMode: false,
  toggleDebugMode: () => set((state) => ({ isDebugMode: !state.isDebugMode })),
}));

export default useDebugModeStore;
