"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Balloon } from "./Balloon";
import type { BalloonData } from "@/types/game";
import { BALLOON_COLORS, BALLOON_LABELS } from "@/types/game";
import type { PhaseConfig } from "@/store/useGameStore";

interface BalloonSpawnerProps {
  phase: PhaseConfig;
  target: string;
  onBalloonPopped: (balloon: BalloonData) => void;
  onBalloonMissed: (balloon: BalloonData) => void;
  paused: boolean;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getLabelsForPhase(phaseType: string): string[] {
  switch (phaseType) {
    case "letters": return BALLOON_LABELS.letters;
    case "numbers": return BALLOON_LABELS.numbers;
    case "animals": return BALLOON_LABELS.animals;
    case "colors": return BALLOON_LABELS.colors;
    case "shapes": return BALLOON_LABELS.shapes;
    case "mixed": return [...BALLOON_LABELS.letters, ...BALLOON_LABELS.numbers, ...BALLOON_LABELS.animals];
    default: return BALLOON_LABELS.letters;
  }
}

function createBalloon(phase: PhaseConfig, target: string): BalloonData {
  const labels = getLabelsForPhase(phase.type);
  const hasTarget = Math.random() < 0.35;
  const label = hasTarget ? target : pick(labels.filter((l) => l !== target));

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: label || pick(labels),
    color: pick(BALLOON_COLORS),
    x: rand(8, 92),
    size: rand(70, 100),
    speed: rand(phase.minSpeed, phase.maxSpeed),
    createdAt: Date.now(),
  };
}

export function BalloonSpawner({
  phase,
  target,
  onBalloonPopped,
  onBalloonMissed,
  paused,
}: BalloonSpawnerProps) {
  const [balloons, setBalloons] = useState<BalloonData[]>([]);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const targetRef = useRef(target);
  targetRef.current = target;
  const onPoppedRef = useRef(onBalloonPopped);
  onPoppedRef.current = onBalloonPopped;
  const onMissedRef = useRef(onBalloonMissed);
  onMissedRef.current = onBalloonMissed;

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= phaseRef.current.maxBalloons) return prev;
        return [...prev, createBalloon(phaseRef.current, targetRef.current)];
      });
    }, phase.spawnInterval);

    return () => clearInterval(interval);
  }, [paused, phase.spawnInterval]);

  useEffect(() => {
    if (paused) return;

    const cleanup = setInterval(() => {
      setBalloons((prev) => {
        const now = Date.now();
        const remaining: BalloonData[] = [];
        for (const b of prev) {
          const elapsed = (now - b.createdAt) / 1000;
          if (elapsed > b.speed + 0.5) {
            onMissedRef.current(b);
          } else {
            remaining.push(b);
          }
        }
        return remaining.length !== prev.length ? remaining : prev;
      });
    }, 500);

    return () => clearInterval(cleanup);
  }, [paused]);

  const handlePop = useCallback((id: string) => {
    setBalloons((prev) => {
      const balloon = prev.find((b) => b.id === id);
      if (balloon) onPoppedRef.current(balloon);
      return prev.filter((b) => b.id !== id);
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {balloons.map((b) => (
        <Balloon key={b.id} balloon={b} onPop={handlePop} />
      ))}
    </div>
  );
}
