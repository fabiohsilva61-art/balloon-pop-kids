import { create } from "zustand";
import type { BalloonData } from "@/types/game";
import { BALLOON_LABELS } from "@/types/game";

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
  { id: "master_letters", title: "Mestre das Letras", description: "Acerte 10 letras", icon: "🔤", unlocked: false },
  { id: "master_numbers", title: "Mestre dos Números", description: "Acerte 10 números", icon: "🔢", unlocked: false },
  { id: "master_animals", title: "Mestre dos Animais", description: "Acerte 10 animais", icon: "🐾", unlocked: false },
  { id: "combo_master", title: "Combo Master", description: "Faça um combo de 10", icon: "🔥", unlocked: false },
];

export type PhaseType = "letters" | "numbers" | "animals" | "colors" | "shapes" | "mixed";

export interface PhaseConfig {
  type: PhaseType;
  name: string;
  target: string;
  requiredHits: number;
  spawnInterval: number;
  minSpeed: number;
  maxSpeed: number;
  maxBalloons: number;
}

const PHASES: PhaseConfig[] = [
  { type: "letters", name: "Letras", target: "", requiredHits: 5, spawnInterval: 1400, minSpeed: 5, maxSpeed: 8, maxBalloons: 6 },
  { type: "numbers", name: "Números", target: "", requiredHits: 6, spawnInterval: 1300, minSpeed: 5, maxSpeed: 7.5, maxBalloons: 7 },
  { type: "animals", name: "Animais", target: "", requiredHits: 7, spawnInterval: 1200, minSpeed: 4.5, maxSpeed: 7, maxBalloons: 7 },
  { type: "colors", name: "Cores", target: "", requiredHits: 8, spawnInterval: 1100, minSpeed: 4, maxSpeed: 6.5, maxBalloons: 8 },
  { type: "shapes", name: "Formas", target: "", requiredHits: 9, spawnInterval: 1000, minSpeed: 3.5, maxSpeed: 6, maxBalloons: 9 },
  { type: "mixed", name: "Desafio Final", target: "", requiredHits: 10, spawnInterval: 900, minSpeed: 3, maxSpeed: 5.5, maxBalloons: 10 },
];

interface GameState {
  playerName: string;
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  phase: number;
  phaseHits: number;
  currentTarget: string;
  totalPopped: number;
  letterHits: number;
  numberHits: number;
  animalHits: number;
  gameOver: boolean;
  paused: boolean;
  achievements: Achievement[];
  newAchievement: Achievement | null;
  phases: PhaseConfig[];

  setPlayerName: (name: string) => void;
  startGame: (name: string) => void;
  handleCorrectPop: (balloon: BalloonData) => void;
  handleWrongPop: (balloon: BalloonData) => void;
  nextTarget: () => void;
  advancePhase: () => void;
  dismissAchievement: () => void;
  reset: () => void;
  getCurrentPhase: () => PhaseConfig;
}

function isLetter(label: string) {
  return /^[A-Z]$/.test(label);
}

function isNumber(label: string) {
  return /^[0-9]$/.test(label);
}

function isAnimal(label: string) {
  return ["🐶", "🐱", "🐸", "🐰", "🐻", "🦁", "🐧", "🐢", "🦋", "🐝"].includes(label);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTarget(phaseType: PhaseType): string {
  switch (phaseType) {
    case "letters": return pickRandom(BALLOON_LABELS.letters);
    case "numbers": return pickRandom(BALLOON_LABELS.numbers);
    case "animals": return pickRandom(BALLOON_LABELS.animals);
    case "colors": return pickRandom(BALLOON_LABELS.colors);
    case "shapes": return pickRandom(BALLOON_LABELS.shapes);
    case "mixed": return pickRandom([...BALLOON_LABELS.letters, ...BALLOON_LABELS.numbers, ...BALLOON_LABELS.animals]);
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  playerName: "",
  score: 0,
  lives: 3,
  combo: 0,
  maxCombo: 0,
  phase: 0,
  phaseHits: 0,
  currentTarget: "",
  totalPopped: 0,
  letterHits: 0,
  numberHits: 0,
  animalHits: 0,
  gameOver: false,
  paused: false,
  achievements: [...INITIAL_ACHIEVEMENTS],
  newAchievement: null,
  phases: PHASES,

  setPlayerName: (name) => set({ playerName: name }),

  startGame: (name) => {
    const target = generateTarget(PHASES[0].type);
    set({
      playerName: name,
      score: 0,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      phase: 0,
      phaseHits: 0,
      currentTarget: target,
      totalPopped: 0,
      letterHits: 0,
      numberHits: 0,
      animalHits: 0,
      gameOver: false,
      paused: false,
      achievements: [...INITIAL_ACHIEVEMENTS],
      newAchievement: null,
    });
  },

  handleCorrectPop: (balloon) => {
    const state = get();
    if (state.gameOver) return;

    let bonus = 0;
    const newCombo = state.combo + 1;
    if (newCombo === 5) bonus = 50;
    else if (newCombo === 10) bonus = 100;
    else if (newCombo > 10 && newCombo % 5 === 0) bonus = 50;

    const newScore = state.score + 10 + bonus;
    const newPopped = state.totalPopped + 1;
    const newPhaseHits = state.phaseHits + 1;
    const newMaxCombo = Math.max(state.maxCombo, newCombo);

    let newLetterHits = state.letterHits;
    let newNumberHits = state.numberHits;
    let newAnimalHits = state.animalHits;

    if (isLetter(balloon.label)) newLetterHits++;
    else if (isNumber(balloon.label)) newNumberHits++;
    else if (isAnimal(balloon.label)) newAnimalHits++;

    const achievements = [...state.achievements];
    let newAchievement: Achievement | null = null;

    function unlock(id: string) {
      const a = achievements.find((a) => a.id === id);
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
    if (newLetterHits >= 10) unlock("master_letters");
    if (newNumberHits >= 10) unlock("master_numbers");
    if (newAnimalHits >= 10) unlock("master_animals");
    if (newCombo >= 10) unlock("combo_master");

    const currentPhase = PHASES[state.phase];
    let shouldAdvance = false;
    if (newPhaseHits >= currentPhase.requiredHits && state.phase < PHASES.length - 1) {
      shouldAdvance = true;
    }

    set({
      score: newScore,
      combo: newCombo,
      maxCombo: newMaxCombo,
      totalPopped: newPopped,
      phaseHits: newPhaseHits,
      letterHits: newLetterHits,
      numberHits: newNumberHits,
      animalHits: newAnimalHits,
      achievements,
      newAchievement,
    });

    if (shouldAdvance) {
      setTimeout(() => get().advancePhase(), 500);
    } else {
      get().nextTarget();
    }
  },

  handleWrongPop: (_balloon) => {
    const state = get();
    if (state.gameOver) return;

    const newScore = Math.max(0, state.score - 5);
    const newLives = state.lives - 1;

    set({
      score: newScore,
      combo: 0,
      lives: newLives,
      gameOver: newLives <= 0,
      paused: newLives <= 0,
    });
  },

  nextTarget: () => {
    const state = get();
    const phase = PHASES[state.phase];
    set({ currentTarget: generateTarget(phase.type) });
  },

  advancePhase: () => {
    const state = get();
    const nextPhase = state.phase + 1;
    if (nextPhase >= PHASES.length) return;
    const target = generateTarget(PHASES[nextPhase].type);
    set({
      phase: nextPhase,
      phaseHits: 0,
      currentTarget: target,
      paused: true,
    });
    setTimeout(() => set({ paused: false }), 2000);
  },

  dismissAchievement: () => set({ newAchievement: null }),

  reset: () => {
    set({
      score: 0,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      phase: 0,
      phaseHits: 0,
      currentTarget: "",
      totalPopped: 0,
      letterHits: 0,
      numberHits: 0,
      animalHits: 0,
      gameOver: false,
      paused: false,
      achievements: [...INITIAL_ACHIEVEMENTS],
      newAchievement: null,
    });
  },

  getCurrentPhase: () => PHASES[get().phase],
}));
