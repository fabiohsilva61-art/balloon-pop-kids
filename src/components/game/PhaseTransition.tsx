"use client";

import { useGameStore } from "@/store/useGameStore";

export function PhaseTransition() {
  const { paused, gameOver, level, category } = useGameStore();

  if (!paused || gameOver || level <= 1) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="text-center animate-scale-in">
        <p className="text-6xl mb-3">🏆</p>
        <p className="text-orange-400 text-2xl font-bold mb-2">Fase Completa!</p>
        <p className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
          Nível {level}
        </p>
        <p className="text-white/70 text-lg mt-3">
          {category.icon} {category.name}
        </p>
      </div>
    </div>
  );
}
