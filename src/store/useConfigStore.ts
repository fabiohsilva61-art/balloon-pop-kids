import { create } from "zustand";

interface ConfigState {
  soundEnabled: boolean;
  locale: string;
  toggleSound: () => void;
  setLocale: (locale: string) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  soundEnabled: true,
  locale: "pt-BR",
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setLocale: (locale) => set({ locale }),
}));
