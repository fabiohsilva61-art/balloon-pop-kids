"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getTopPlayers, type PlayerScore } from "@/lib/supabase";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function RankingPage() {
  const [players, setPlayers] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopPlayers(10)
      .then(setPlayers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex flex-1 flex-col items-center gap-6 p-6 pt-10 overflow-y-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center">
        🏆 Ranking Global
      </h1>

      <div className="w-full max-w-md flex flex-col gap-2">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">Nenhum jogador ainda!</p>
            <p className="text-white/50 text-sm mt-1">
              Seja o primeiro a entrar no ranking
            </p>
          </div>
        ) : (
          players.map((entry, i) => (
            <div
              key={entry.id}
              className={[
                "flex items-center gap-4 rounded-2xl px-5 py-4 transition-all",
                i < 3 ? "bg-white/25 backdrop-blur-sm" : "bg-white/10",
              ].join(" ")}
            >
              <span className="text-3xl w-10 text-center">
                {i < 3 ? MEDALS[i] : `${i + 1}º`}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-white text-xl font-semibold truncate block">
                  {entry.username}
                </span>
                <span className="text-white/50 text-xs">
                  Fase {entry.max_phase}
                </span>
              </div>
              <span className="text-yellow-300 text-xl font-bold whitespace-nowrap">
                {entry.max_score} pts
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pb-4">
        <Button variant="secondary" href="/">
          ← Voltar ao Menu
        </Button>
      </div>
    </main>
  );
}
