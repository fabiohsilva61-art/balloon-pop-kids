"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef } from "react";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { BalloonSpawner } from "@/components/game/BalloonSpawner";
import { HUD } from "@/components/game/HUD";
import { AchievementToast } from "@/components/game/AchievementToast";
import { PhaseTransition } from "@/components/game/PhaseTransition";
import { ScoreFeedbackOverlay, useScoreFeedback } from "@/components/game/ScoreFeedback";
import { CorrectFeedbackOverlay, useCorrectFeedback } from "@/components/game/CorrectFeedback";
import { useGameStore } from "@/store/useGameStore";
import { audioManager } from "@/lib/audio";
import type { BalloonData, CategoryType, Difficulty } from "@/types/game";

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const player = searchParams.get("player") || "Jogador";
  const categoryParam = (searchParams.get("category") || "numbers") as CategoryType;
  const difficultyParam = (searchParams.get("difficulty") || "easy") as Difficulty;

  const { items: feedbackItems, showFeedback } = useScoreFeedback();
  const { showPraise, showStars, confetti, trigger: triggerCorrect } = useCorrectFeedback();

  const {
    startGame,
    handleCorrectPop,
    handleWrongPop,
    gameOver,
    paused,
    score,
    currentTarget,
    category,
    difficultyConfig,
  } = useGameStore();

  const hasStarted = useRef(false);
  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      startGame(player, categoryParam, difficultyParam);
    }
  }, [player, categoryParam, difficultyParam, startGame]);

  const redirectedRef = useRef(false);
  useEffect(() => {
    if (gameOver && !redirectedRef.current) {
      redirectedRef.current = true;
      audioManager?.play("gameOver");
      const state = useGameStore.getState();
      setTimeout(() => {
        const params = new URLSearchParams({
          player,
          score: String(state.score),
          level: String(state.level),
          category: categoryParam,
          correct: String(state.stats?.totalCorrect || 0),
          wrong: String(state.stats?.totalWrong || 0),
          time: String(Math.floor(((state.stats?.endTime || Date.now()) - (state.stats?.startTime || Date.now())) / 1000)),
        });
        router.push(`/game-over?${params.toString()}`);
      }, 1500);
    }
  }, [gameOver, router, player, categoryParam]);

  const onPopped = useCallback(
    (balloon: BalloonData) => {
      if (currentTarget && balloon.label === currentTarget.label) {
        handleCorrectPop(balloon);
        audioManager?.play("pop");
        triggerCorrect();
        const state = useGameStore.getState();
        if (state.combo === 5 || state.combo === 10) {
          audioManager?.play("combo");
          showFeedback(`COMBO x${state.combo}!`, "#FF6B00");
        }
        showFeedback("+10", "#22C55E");
      } else {
        handleWrongPop(balloon);
        audioManager?.play("wrong");
        showFeedback("-5", "#EF4444");
      }
    },
    [currentTarget, handleCorrectPop, handleWrongPop, showFeedback, triggerCorrect],
  );

  const onMissed = useCallback(() => {}, []);

  return (
    <>
      <SoundToggle />
      <HUD />

      <div className="relative flex-1">
        <BalloonSpawner
          category={category}
          target={currentTarget}
          difficultyConfig={difficultyConfig}
          onBalloonPopped={onPopped}
          onBalloonMissed={onMissed}
          paused={paused || gameOver}
        />
      </div>

      <ScoreFeedbackOverlay items={feedbackItems} />
      <CorrectFeedbackOverlay praise={showPraise} showStars={showStars} confetti={confetti} />
      <AchievementToast />
      <PhaseTransition />

      {gameOver && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <p className="text-white text-5xl font-bold animate-pulse mb-4">Fim de Jogo!</p>
            <p className="text-3xl font-bold" style={{ color: "#FF6B00" }}>{score} pontos</p>
          </div>
        </div>
      )}
    </>
  );
}

export default function PlayPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense fallback={
        <div className="flex flex-1 items-center justify-center text-white text-2xl">Carregando...</div>
      }>
        <GameContent />
      </Suspense>
    </main>
  );
}
