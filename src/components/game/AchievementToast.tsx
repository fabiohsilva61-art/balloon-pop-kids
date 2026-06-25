"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { audioManager } from "@/lib/audio";

export function AchievementToast() {
  const { newAchievement, dismissAchievement } = useGameStore();

  useEffect(() => {
    if (!newAchievement) return;
    audioManager?.play("achievement");
    const timer = setTimeout(dismissAchievement, 3000);
    return () => clearTimeout(timer);
  }, [newAchievement, dismissAchievement]);

  if (!newAchievement) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-yellow-400 text-gray-900 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4 min-w-[280px]">
        <span className="text-4xl">{newAchievement.icon}</span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-yellow-800">
            Conquista Desbloqueada!
          </p>
          <p className="text-lg font-bold">{newAchievement.title}</p>
          <p className="text-sm text-yellow-900/70">{newAchievement.description}</p>
        </div>
      </div>
    </div>
  );
}
