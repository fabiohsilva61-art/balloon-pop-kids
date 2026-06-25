export const GAME_CONFIG = {
  MAX_LIVES: 3,
  POINTS_CORRECT: 10,
  POINTS_WRONG: -5,
  COMBO_5_BONUS: 50,
  COMBO_10_BONUS: 100,
  MAX_PLAYER_NAME_LENGTH: 20,
  RANKING_TOP: 10,
  HITS_PER_LEVEL: 8,
} as const;

export const PRAISE_MESSAGES = [
  "Muito bem!",
  "Excelente!",
  "Você acertou!",
  "Parabéns!",
  "Incrível!",
  "Mandou bem!",
  "Arrasou!",
  "Sensacional!",
];

export const BAD_WORDS = [
  "merda", "porra", "caralho", "foda", "puta", "cuzao",
  "buceta", "viado", "arrombado", "fdp", "pqp",
];

export function filterBadWords(name: string): boolean {
  const lower = name.toLowerCase().replace(/[^a-záàâãéèêíïóôõöúç]/gi, "");
  return !BAD_WORDS.some((word) => lower.includes(word));
}
