"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { BalloonSVG } from "@/components/ui/BalloonSVG";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/useGameStore";
import { submitScore } from "@/lib/supabase";
import { CATEGORIES } from "@/types/game";

function GameOverContent() {
  const searchParams = useSearchParams();
  const player = searchParams.get("player") || "Jogador";
  const score = Number(searchParams.get("score") || 0);
  const level = Number(searchParams.get("level") || 1);
  const categoryType = searchParams.get("category") || "numbers";
  const correct = Number(searchParams.get("correct") || 0);
  const wrong = Number(searchParams.get("wrong") || 0);
  const timeSec = Number(searchParams.get("time") || 0);
  const achievements = useGameStore((s) => s.achievements);
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const cat = CATEGORIES.find((c) => c.type === categoryType);

  const submitted = useRef(false);
  useEffect(() => {
    if (submitted.current || score <= 0) return;
    submitted.current = true;
    submitScore(player, score, level).catch(() => {});
  }, [player, score, level]);

  const minutes = Math.floor(timeSec / 60);
  const seconds = timeSec % 60;
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <main className="flex flex-1 flex-col items-center gap-5 p-5 pt-6 overflow-y-auto">
      <div className="flex gap-2 opacity-50">
        <BalloonSVG color="#9CA3AF" size={36} delay={0} />
        <BalloonSVG color="#9CA3AF" size={44} delay={0.3} />
        <BalloonSVG color="#9CA3AF" size={36} delay={0.6} />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center">
        Fim de Jogo!
      </h1>

      <div className="flex flex-col items-center gap-2 bg-white/15 backdrop-blur-sm rounded-3xl px-6 py-5 w-full max-w-sm">
        <p className="text-white/70 text-base">Jogador</p>
        <p className="text-white text-xl font-bold">{player}</p>
        <div className="w-full h-px bg-white/20 my-1" />
        <p className="text-white/70 text-base">Pontuação</p>
        <p className="text-4xl font-bold" style={{ color: "#FF6B00" }}>{score}</p>
        <div className="w-full h-px bg-white/20 my-1" />
        <p className="text-white/70 text-base">Nível alcançado</p>
        <p className="text-white text-xl font-bold">Nível {level}</p>
      </div>

      <div className="bg-white/10 rounded-2xl px-5 py-4 w-full max-w-sm">
        <p className="text-white/70 text-sm text-center mb-3 font-medium">📊 Estatísticas</p>
        <div className="grid grid-cols-2 gap-3">
          <StatItem label="Categoria" value={`${cat?.icon || ""} ${cat?.name || categoryType}`} />
          <StatItem label="Tempo" value={timeStr} />
          <StatItem label="Acertos" value={String(correct)} color="#22C55E" />
          <StatItem label="Erros" value={String(wrong)} color="#EF4444" />
        </div>
      </div>

      {unlockedAchievements.length > 0 && (
        <div className="w-full max-w-sm">
          <p className="text-white/70 text-center text-sm mb-2">Conquistas desbloqueadas</p>
          <div className="grid grid-cols-2 gap-2">
            {unlockedAchievements.map((a) => (
              <div key={a.id} className="flex items-center gap-2 bg-orange-400/20 rounded-xl px-3 py-2">
                <span className="text-2xl">{a.icon}</span>
                <span className="text-white text-sm font-medium truncate">{a.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs mt-1 pb-4">
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

function StatItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="text-center">
      <p className="text-white/50 text-xs">{label}</p>
      <p className="text-white text-lg font-bold" style={color ? { color } : undefined}>{value}</p>
    </div>
  );
}

export default function GameOverPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center text-white text-2xl">Carregando...</div>
    }>
      <GameOverContent />
    </Suspense>
  );
}
