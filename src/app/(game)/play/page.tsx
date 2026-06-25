"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef } from "react";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { BalloonSpawner } from "@/components/game/BalloonSpawner";
import { HUD } from "@/components/game/HUD";
import { AchievementToast } from "@/components/game/AchievementToast";
import { PhaseTransition } from "@/components/game/PhaseTransition";
import { ScoreFeedbackOverlay, useScoreFeedback } from "@/components/game/ScoreFeedback";
import { useGameStore } from "@/store/useGameStore";
import { audioManager } from "@/lib/audio";
import type { BalloonData } from "@/types/game";

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const player = searchParams.get("player") || "Jogador";
  const { items: feedbackItems, showFeedback } = useScoreFeedback();

  const {
    startGame,
    handleCorrectPop,
    handleWrongPop,
    gameOver,
    paused,
    score,
    currentTarget,
    phase,
    phases,
  } = useGameStore();

  const currentPhase = phases[phase];
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      startGame(player);
    }
  }, [player, startGame]);

  const redirectedRef = useRef(false);
  useEffect(() => {
    if (gameOver && !redirectedRef.current) {
      redirectedRef.current = true;
      audioManager?.play("gameOver");
      const finalScore = useGameStore.getState().score;
      const finalPhase = useGameStore.getState().phase + 1;
      setTimeout(() => {
        router.push(
          `/game-over?player=${encodeURIComponent(player)}&score=${finalScore}&phase=${finalPhase}`
        );
      }, 1500);
    }
  }, [gameOver, router, player]);

  const onPopped = useCallback(
    (balloon: BalloonData) => {
      if (balloon.label === currentTarget) {
        handleCorrectPop(balloon);
        audioManager?.play("pop");
        const state = useGameStore.getState();
        if (state.combo === 5 || state.combo === 10) {
          audioManager?.play("combo");
          showFeedback(`COMBO x${state.combo}!`, "#F97316");
        }
        showFeedback("+10", "#22C55E");
      } else {
        handleWrongPop(balloon);
        audioManager?.play("wrong");
        showFeedback("-5", "#EF4444");
      }
    },
    [currentTarget, handleCorrectPop, handleWrongPop, showFeedback]
  );

  const onMissed = useCallback((_balloon: BalloonData) => {}, []);

  return (
    <>
      <SoundToggle />
      <HUD />

      <div className="relative flex-1">
        <BalloonSpawner
          phase={currentPhase}
          target={currentTarget}
          onBalloonPopped={onPopped}
          onBalloonMissed={onMissed}
          paused={paused || gameOver}
        />
      </div>

      <ScoreFeedbackOverlay items={feedbackItems} />
      <AchievementToast />
      <PhaseTransition />

      {gameOver && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <p className="text-white text-5xl font-bold animate-pulse mb-4">
              Fim de Jogo!
            </p>
            <p className="text-yellow-300 text-3xl font-bold">{score} pontos</p>
          </div>
        </div>
      )}
    </>
  );
}

export default function PlayPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center text-white text-2xl">
            Carregando...
          </div>
        }
      >
        <GameContent />
      </Suspense>
    </main>
  );
}
