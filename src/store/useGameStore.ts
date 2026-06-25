import { create } from "zustand";
import type { BalloonData, CategoryType, Category, CategoryItem, Difficulty, DifficultyConfig } from "@/types/game";
import { CATEGORIES, DIFFICULTIES } from "@/types/game";
import { GAME_CONFIG } from "@/lib/constants";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_pop", title: "Primeiro Balão", description: "Estoure seu primeiro balão", icon: "🎈", unlocked: false },
  { id: "score_100", title: "100 Pontos", description: "Alcance 100 pontos", icon: "💯", unlocked: false },
  { id: "score_500", title: "500 Pontos", description: "Alcance 500 pontos", icon: "🌟", unlocked: false },
  { id: "score_1000", title: "Campeão", description: "Alcance 1000 pontos", icon: "🏆", unlocked: false },
  { id: "combo_master", title: "Combo Master", description: "Faça um combo de 10", icon: "🔥", unlocked: false },
  { id: "perfect_round", title: "Rodada Perfeita", description: "Complete uma fase sem errar", icon: "⭐", unlocked: false },
];

export interface GameStats {
  totalCorrect: number;
  totalWrong: number;
  startTime: number;
  endTime: number;
  categoryPlayed: CategoryType;
  difficulty: Difficulty;
  bestScore: number;
}

interface GameState {
  playerName: string;
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  level: number;
  levelHits: number;
  currentTarget: CategoryItem | null;
  totalPopped: number;
  totalWrong: number;
  gameOver: boolean;
  paused: boolean;
  achievements: Achievement[];
  newAchievement: Achievement | null;
  category: Category;
  difficultyConfig: DifficultyConfig;
  difficultyType: Difficulty;
  stats: GameStats | null;
  levelErrors: number;

  startGame: (name: string, categoryType: CategoryType, difficulty: Difficulty) => void;
  handleCorrectPop: (balloon: BalloonData) => void;
  handleWrongPop: (balloon: BalloonData) => void;
  nextTarget: () => void;
  advanceLevel: () => void;
  dismissAchievement: () => void;
  getCurrentInstruction: () => string;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTarget(category: Category): CategoryItem {
  return pickRandom(category.items);
}

function getInstruction(categoryType: CategoryType, item: CategoryItem): string {
  const prefix: Record<CategoryType, string> = {
    numbers: "Toque no balão que contém o número",
    letters: "Toque no balão que contém a letra",
    animals: "Toque no balão do",
    fruits: "Toque no balão da",
    vehicles: "Toque no balão do",
    flags: "Toque na bandeira do",
    colors: "Toque no balão da cor",
    shapes: "Toque no balão do",
  };
  const useDisplay = ["animals", "fruits", "vehicles", "flags", "colors", "shapes"].includes(categoryType);
  return `${prefix[categoryType]} ${useDisplay ? item.displayName : item.label}`;
}

export const useGameStore = create<GameState>((set, get) => ({
  playerName: "",
  score: 0,
  lives: 3,
  combo: 0,
  maxCombo: 0,
  level: 1,
  levelHits: 0,
  currentTarget: null,
  totalPopped: 0,
  totalWrong: 0,
  gameOver: false,
  paused: false,
  achievements: [...INITIAL_ACHIEVEMENTS],
  newAchievement: null,
  category: CATEGORIES[0],
  difficultyConfig: DIFFICULTIES.easy,
  difficultyType: "easy",
  stats: null,
  levelErrors: 0,

  startGame: (name, categoryType, difficulty) => {
    const category = CATEGORIES.find((c) => c.type === categoryType) || CATEGORIES[0];
    const target = generateTarget(category);
    const diffConfig = DIFFICULTIES[difficulty];
    set({
      playerName: name,
      score: 0,
      lives: GAME_CONFIG.MAX_LIVES,
      combo: 0,
      maxCombo: 0,
      level: 1,
      levelHits: 0,
      currentTarget: target,
      totalPopped: 0,
      totalWrong: 0,
      gameOver: false,
      paused: false,
      achievements: [...INITIAL_ACHIEVEMENTS],
      newAchievement: null,
      category,
      difficultyConfig: diffConfig,
      difficultyType: difficulty,
      stats: {
        totalCorrect: 0,
        totalWrong: 0,
        startTime: Date.now(),
        endTime: 0,
        categoryPlayed: categoryType,
        difficulty,
        bestScore: 0,
      },
      levelErrors: 0,
    });
  },

  handleCorrectPop: (_balloon) => {
    const state = get();
    if (state.gameOver) return;

    let bonus = 0;
    const newCombo = state.combo + 1;
    if (newCombo === 5) bonus = 50;
    else if (newCombo === 10) bonus = 100;
    else if (newCombo > 10 && newCombo % 5 === 0) bonus = 50;

    const newScore = state.score + GAME_CONFIG.POINTS_CORRECT + bonus;
    const newPopped = state.totalPopped + 1;
    const newLevelHits = state.levelHits + 1;
    const newMaxCombo = Math.max(state.maxCombo, newCombo);

    const achievements = [...state.achievements];
    let newAchievement: Achievement | null = null;

    function unlock(id: string) {
      const a = achievements.find((x) => x.id === id);
      if (a && !a.unlocked) {
        a.unlocked = true;
        a.unlockedAt = Date.now();
        newAchievement = { ...a };
      }
    }

    if (newPopped === 1) unlock("first_pop");
    if (newScore >= 100) unlock("score_100");
    if (newScore >= 500) unlock("score_500");
    if (newScore >= 1000) unlock("score_1000");
    if (newCombo >= 10) unlock("combo_master");

    const shouldAdvance = newLevelHits >= GAME_CONFIG.HITS_PER_LEVEL;

    if (shouldAdvance && state.levelErrors === 0) {
      unlock("perfect_round");
    }

    const newStats = state.stats
      ? { ...state.stats, totalCorrect: state.stats.totalCorrect + 1, bestScore: Math.max(state.stats.bestScore, newScore) }
      : null;

    set({
      score: newScore,
      combo: newCombo,
      maxCombo: newMaxCombo,
      totalPopped: newPopped,
      levelHits: newLevelHits,
      achievements,
      newAchievement,
      stats: newStats,
    });

    if (shouldAdvance) {
      setTimeout(() => get().advanceLevel(), 600);
    } else {
      get().nextTarget();
    }
  },

  handleWrongPop: (_balloon) => {
    const state = get();
    if (state.gameOver) return;

    const newScore = Math.max(0, state.score + GAME_CONFIG.POINTS_WRONG);
    const newLives = state.lives - 1;
    const newTotalWrong = state.totalWrong + 1;
    const isGameOver = newLives <= 0;

    const newStats = state.stats
      ? {
          ...state.stats,
          totalWrong: state.stats.totalWrong + 1,
          endTime: isGameOver ? Date.now() : 0,
          bestScore: Math.max(state.stats.bestScore, state.score),
        }
      : null;

    set({
      score: newScore,
      combo: 0,
      lives: newLives,
      totalWrong: newTotalWrong,
      gameOver: isGameOver,
      paused: isGameOver,
      levelErrors: state.levelErrors + 1,
      stats: newStats,
    });
  },

  nextTarget: () => {
    const state = get();
    set({ currentTarget: generateTarget(state.category) });
  },

  advanceLevel: () => {
    const state = get();
    const newLevel = state.level + 1;
    const target = generateTarget(state.category);
    set({
      level: newLevel,
      levelHits: 0,
      levelErrors: 0,
      currentTarget: target,
      paused: true,
    });
    setTimeout(() => set({ paused: false }), 2000);
  },

  dismissAchievement: () => set({ newAchievement: null }),

  getCurrentInstruction: () => {
    const state = get();
    if (!state.currentTarget) return "";
    return getInstruction(state.category.type, state.currentTarget);
  },
}));
