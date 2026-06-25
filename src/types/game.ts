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
  "#EF4444", "#F97316", "#FACC15", "#22C55E",
  "#3B82F6", "#8B5CF6", "#EC4899", "#14B8A6",
];

export type CategoryType =
  | "numbers" | "letters" | "animals" | "fruits"
  | "vehicles" | "flags" | "colors" | "shapes";

export interface Category {
  type: CategoryType;
  name: string;
  icon: string;
  items: CategoryItem[];
}

export interface CategoryItem {
  label: string;
  displayName: string;
}

export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyConfig {
  name: string;
  icon: string;
  maxBalloons: number;
  spawnInterval: number;
  minSpeed: number;
  maxSpeed: number;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { name: "Fácil", icon: "🐢", maxBalloons: 4, spawnInterval: 2000, minSpeed: 8, maxSpeed: 12 },
  medium: { name: "Médio", icon: "🐇", maxBalloons: 6, spawnInterval: 1500, minSpeed: 6, maxSpeed: 9 },
  hard: { name: "Difícil", icon: "🚀", maxBalloons: 10, spawnInterval: 1000, minSpeed: 4, maxSpeed: 7 },
};

export const CATEGORIES: Category[] = [
  {
    type: "numbers", name: "Números", icon: "🔢",
    items: "0123456789".split("").map((n) => ({ label: n, displayName: n })),
  },
  {
    type: "letters", name: "Letras", icon: "🔤",
    items: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => ({ label: l, displayName: l })),
  },
  {
    type: "animals", name: "Animais", icon: "🐶",
    items: [
      { label: "🐶", displayName: "Cachorro" },
      { label: "🐱", displayName: "Gato" },
      { label: "🐸", displayName: "Sapo" },
      { label: "🐰", displayName: "Coelho" },
      { label: "🐻", displayName: "Urso" },
      { label: "🦁", displayName: "Leão" },
      { label: "🐧", displayName: "Pinguim" },
      { label: "🐢", displayName: "Tartaruga" },
      { label: "🦋", displayName: "Borboleta" },
      { label: "🐝", displayName: "Abelha" },
      { label: "🐘", displayName: "Elefante" },
      { label: "🦊", displayName: "Raposa" },
    ],
  },
  {
    type: "fruits", name: "Frutas", icon: "🍎",
    items: [
      { label: "🍎", displayName: "Maçã" },
      { label: "🍌", displayName: "Banana" },
      { label: "🍇", displayName: "Uva" },
      { label: "🍊", displayName: "Laranja" },
      { label: "🍓", displayName: "Morango" },
      { label: "🍉", displayName: "Melancia" },
      { label: "🍍", displayName: "Abacaxi" },
      { label: "🥭", displayName: "Manga" },
      { label: "🍒", displayName: "Cereja" },
      { label: "🍑", displayName: "Pêssego" },
    ],
  },
  {
    type: "vehicles", name: "Veículos", icon: "🚗",
    items: [
      { label: "🚗", displayName: "Carro" },
      { label: "🚌", displayName: "Ônibus" },
      { label: "🚀", displayName: "Foguete" },
      { label: "✈️", displayName: "Avião" },
      { label: "🚂", displayName: "Trem" },
      { label: "🚢", displayName: "Navio" },
      { label: "🚲", displayName: "Bicicleta" },
      { label: "🏍️", displayName: "Moto" },
      { label: "🚁", displayName: "Helicóptero" },
      { label: "🚜", displayName: "Trator" },
    ],
  },
  {
    type: "flags", name: "Bandeiras", icon: "🌍",
    items: [
      { label: "🇧🇷", displayName: "Brasil" },
      { label: "🇺🇸", displayName: "Estados Unidos" },
      { label: "🇫🇷", displayName: "França" },
      { label: "🇯🇵", displayName: "Japão" },
      { label: "🇮🇹", displayName: "Itália" },
      { label: "🇩🇪", displayName: "Alemanha" },
      { label: "🇦🇷", displayName: "Argentina" },
      { label: "🇵🇹", displayName: "Portugal" },
      { label: "🇪🇸", displayName: "Espanha" },
      { label: "🇬🇧", displayName: "Reino Unido" },
    ],
  },
  {
    type: "colors", name: "Cores", icon: "🎨",
    items: [
      { label: "🔴", displayName: "Vermelho" },
      { label: "🟡", displayName: "Amarelo" },
      { label: "🟢", displayName: "Verde" },
      { label: "🔵", displayName: "Azul" },
      { label: "🟣", displayName: "Roxo" },
      { label: "🟠", displayName: "Laranja" },
      { label: "⚪", displayName: "Branco" },
      { label: "🟤", displayName: "Marrom" },
    ],
  },
  {
    type: "shapes", name: "Formas", icon: "🔺",
    items: [
      { label: "●", displayName: "Círculo" },
      { label: "■", displayName: "Quadrado" },
      { label: "▲", displayName: "Triângulo" },
      { label: "◆", displayName: "Losango" },
      { label: "★", displayName: "Estrela" },
      { label: "♥", displayName: "Coração" },
    ],
  },
];
