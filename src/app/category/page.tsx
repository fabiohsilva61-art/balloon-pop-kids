"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { BackgroundBalloons } from "@/components/ui/BackgroundBalloons";
import { CATEGORIES, DIFFICULTIES, type CategoryType, type Difficulty } from "@/types/game";
import { useConfigStore } from "@/store/useConfigStore";

function CategoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const player = searchParams.get("player") || "Jogador";
  const { selectedCategory, difficulty, setCategory, setDifficulty } = useConfigStore();

  function handleStart() {
    const params = new URLSearchParams({
      player,
      category: selectedCategory,
      difficulty,
    });
    router.push(`/play?${params.toString()}`);
  }

  return (
    <>
      <SoundToggle />
      <BackgroundBalloons />

      <main className="relative z-10 flex flex-1 flex-col items-center gap-5 p-4 pt-6 overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg text-center">
          📚 Escolha a Categoria
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.type}
              onClick={() => setCategory(cat.type as CategoryType)}
              className={[
                "flex flex-col items-center gap-2 rounded-2xl px-3 py-4 transition-all cursor-pointer",
                "active:scale-95",
                selectedCategory === cat.type
                  ? "bg-orange-400 text-gray-900 shadow-lg shadow-orange-400/30 scale-105"
                  : "bg-white/20 text-white hover:bg-white/30",
              ].join(" ")}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-semibold">{cat.name}</span>
            </button>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg text-center mt-2">
          ⚙️ Dificuldade
        </h2>

        <div className="flex gap-3 w-full max-w-lg justify-center">
          {(Object.entries(DIFFICULTIES) as [Difficulty, typeof DIFFICULTIES.easy][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              className={[
                "flex flex-col items-center gap-1 rounded-2xl px-5 py-3 transition-all cursor-pointer flex-1 max-w-[140px]",
                "active:scale-95",
                difficulty === key
                  ? "bg-orange-400 text-gray-900 shadow-lg shadow-orange-400/30 scale-105"
                  : "bg-white/20 text-white hover:bg-white/30",
              ].join(" ")}
            >
              <span className="text-2xl">{cfg.icon}</span>
              <span className="text-sm font-semibold">{cfg.name}</span>
              <span className="text-xs opacity-70">{cfg.maxBalloons} balões</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs mt-3">
          <Button onClick={handleStart} fullWidth>
            🎈 Começar!
          </Button>
          <Button variant="secondary" href="/" fullWidth>
            ← Voltar
          </Button>
        </div>
      </main>
    </>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center text-white text-2xl">Carregando...</div>
    }>
      <CategoryContent />
    </Suspense>
  );
}
