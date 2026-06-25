"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useConfigStore } from "@/store/useConfigStore";
import { audioManager } from "@/lib/audio";

export function HUD() {
  const { lives, score, combo, level, currentTarget, totalPopped, category, getCurrentInstruction } = useGameStore();
  const { soundEnabled } = useConfigStore();
  const instruction = getCurrentInstruction();
  const prevTargetRef = useRef(currentTarget?.label);

  useEffect(() => {
    if (!currentTarget || currentTarget.label === prevTargetRef.current) return;
    prevTargetRef.current = currentTarget.label;
    if (soundEnabled) {
      audioManager?.speak(instruction);
    }
  }, [currentTarget, instruction, soundEnabled]);

  return (
    <header className="relative z-20 flex flex-col gap-2 px-3 py-2 bg-white/15 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={`text-xl md:text-2xl transition-all duration-300 ${i < lives ? "scale-100 opacity-100" : "scale-75 opacity-30 grayscale"}`}
            >
              ❤️
            </span>
          ))}
        </div>

        <div className="bg-white/20 rounded-xl px-3 py-1 text-sm text-white/80 font-medium">
          {category.icon} Nível {level}
        </div>

        <div className="text-white font-bold text-xl bg-white/20 rounded-xl px-4 py-1 min-w-[80px] text-center">
          {score}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 rounded-2xl bg-white/20 px-4 py-2.5 text-center">
          <p className="text-white text-lg md:text-xl font-bold leading-tight">
            🎯 {instruction}
          </p>
          {currentTarget && (
            <p className="text-4xl md:text-5xl mt-1 drop-shadow-md" style={{ color: "#FF6B00" }}>
              {currentTarget.label}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          {combo >= 2 && (
            <div className="text-orange-300 font-bold text-base animate-pulse whitespace-nowrap">
              🔥 x{combo}
            </div>
          )}
          <div className="text-white/60 text-xs whitespace-nowrap">
            {totalPopped} 🎈
          </div>
        </div>
      </div>
    </header>
  );
}
