import { create } from "zustand";
import type { Difficulty, CategoryType } from "@/types/game";

interface ConfigState {
  soundEnabled: boolean;
  difficulty: Difficulty;
  selectedCategory: CategoryType;
  locale: string;

  toggleSound: () => void;
  setDifficulty: (d: Difficulty) => void;
  setCategory: (c: CategoryType) => void;
  setLocale: (l: string) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  soundEnabled: true,
  difficulty: "easy",
  selectedCategory: "numbers",
  locale: "pt-BR",

  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setDifficulty: (difficulty) => set({ difficulty }),
  setCategory: (selectedCategory) => set({ selectedCategory }),
  setLocale: (locale) => set({ locale }),
}));
