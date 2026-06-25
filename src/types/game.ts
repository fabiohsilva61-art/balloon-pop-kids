export interface BalloonData {
  id: string;
  label: string;
  color: string;
  x: number;
  size: number;
  speed: number;
  createdAt: number;
}

export type BalloonStatus = "floating" | "popping" | "gone";

export const BALLOON_COLORS = [
  "#EF4444",
  "#F97316",
  "#FACC15",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

export const BALLOON_LABELS = {
  letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  numbers: "0123456789".split(""),
  animals: ["🐶", "🐱", "🐸", "🐰", "🐻", "🦁", "🐧", "🐢", "🦋", "🐝"],
  colors: ["🔴", "🟡", "🟢", "🔵", "🟣", "🟠"],
  shapes: ["●", "■", "▲", "◆", "★", "♥"],
};
