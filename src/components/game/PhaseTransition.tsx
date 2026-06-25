"use client";

import { useGameStore } from "@/store/useGameStore";
import { PHASE_NAMES } from "@/lib/constants";

export function PhaseTransition() {
  const { paused, gameOver, phase, phases } = useGameStore();

  if (!paused || gameOver || phase === 0) return null;

  const currentPhase = phases[phase];

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="text-center animate-scale-in">
        <p className="text-yellow-300 text-2xl font-bold mb-2">Nova Fase!</p>
        <p className="text-white text-5xl md:text-6xl font-bold drop-shadow-lg">
          {PHASE_NAMES[currentPhase.type]}
        </p>
        <p className="text-white/70 text-lg mt-3">
          Fase {phase + 1} de {phases.length}
        </p>
      </div>
    </div>
  );
}
