"use client";

import { useGameStore } from "@/store/useGameStore";
import { TARGET_INSTRUCTIONS, PHASE_NAMES } from "@/lib/constants";

export function HUD() {
  const { lives, score, combo, phase, currentTarget, playerName, totalPopped, phases } = useGameStore();
  const currentPhase = phases[phase];

  return (
    <header className="relative z-20 flex flex-col gap-2 px-4 py-3 bg-white/15 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={`text-2xl transition-all duration-300 ${i < lives ? "scale-100 opacity-100" : "scale-75 opacity-30 grayscale"}`}
            >
              ❤️
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white/70 text-sm hidden sm:inline">{playerName}</span>
          <div className="bg-white/20 rounded-xl px-3 py-1 text-sm text-white/70">
            Fase {phase + 1} — {PHASE_NAMES[currentPhase.type]}
          </div>
        </div>

        <div className="text-white font-bold text-xl bg-white/20 rounded-xl px-4 py-1 min-w-[80px] text-center">
          {score}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-white/20 px-4 py-1.5 text-white text-base font-semibold">
            {TARGET_INSTRUCTIONS[currentPhase.type]}:{" "}
            <span className="text-2xl text-yellow-300">{currentTarget}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {combo >= 2 && (
            <div className="text-orange-300 font-bold text-lg animate-pulse">
              🔥 x{combo}
            </div>
          )}
          <div className="text-white/60 text-sm">
            {totalPopped} 🎈
          </div>
        </div>
      </div>
    </header>
  );
}
