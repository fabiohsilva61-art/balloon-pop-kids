"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { BalloonSVG } from "@/components/ui/BalloonSVG";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/useGameStore";
import { submitScore } from "@/lib/supabase";

function GameOverContent() {
  const searchParams = useSearchParams();
  const player = searchParams.get("player") || "Jogador";
  const score = Number(searchParams.get("score") || 0);
  const phase = Number(searchParams.get("phase") || 1);
  const achievements = useGameStore((s) => s.achievements);
  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  const submitted = useRef(false);
  useEffect(() => {
    if (submitted.current || score <= 0) return;
    submitted.current = true;
    submitScore(player, score, phase).catch(() => {});
  }, [player, score, phase]);

  return (
    <main className="flex flex-1 flex-col items-center gap-6 p-6 pt-8 overflow-y-auto">
      <div className="flex gap-2 opacity-50">
        <BalloonSVG color="#9CA3AF" size={40} delay={0} />
        <BalloonSVG color="#9CA3AF" size={48} delay={0.3} />
        <BalloonSVG color="#9CA3AF" size={40} delay={0.6} />
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg text-center">
        Fim de Jogo!
      </h1>

      <div className="flex flex-col items-center gap-2 bg-white/15 backdrop-blur-sm rounded-3xl px-8 py-6 w-full max-w-sm">
        <p className="text-white/70 text-lg">Jogador</p>
        <p className="text-white text-2xl font-bold">{player}</p>

        <div className="w-full h-px bg-white/20 my-2" />

        <p className="text-white/70 text-lg">Pontuação</p>
        <p className="text-5xl font-bold text-yellow-300">{score}</p>

        <div className="w-full h-px bg-white/20 my-2" />

        <p className="text-white/70 text-lg">Fase alcançada</p>
        <p className="text-white text-2xl font-bold">Fase {phase}</p>
      </div>

      {unlockedAchievements.length > 0 && (
        <div className="w-full max-w-sm">
          <p className="text-white/70 text-center text-sm mb-2">
            Conquistas desbloqueadas
          </p>
          <div className="grid grid-cols-2 gap-2">
            {unlockedAchievements.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 bg-yellow-400/20 rounded-xl px-3 py-2"
              >
                <span className="text-2xl">{a.icon}</span>
                <span className="text-white text-sm font-medium truncate">
                  {a.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
        <Button href="/" fullWidth>
          🔄 Tentar Novamente
        </Button>

        <Button variant="secondary" href="/ranking" fullWidth>
          🏆 Ver Ranking
        </Button>
      </div>
    </main>
  );
}

export default function GameOverPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-white text-2xl">
          Carregando...
        </div>
      }
    >
      <GameOverContent />
    </Suspense>
  );
}
