"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Balloon } from "./Balloon";
import type { BalloonData, Category, CategoryItem, DifficultyConfig } from "@/types/game";
import { BALLOON_COLORS } from "@/types/game";

interface BalloonSpawnerProps {
  category: Category;
  target: CategoryItem | null;
  difficultyConfig: DifficultyConfig;
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

function createBalloon(
  category: Category,
  target: CategoryItem | null,
  cfg: DifficultyConfig,
): BalloonData {
  const hasTarget = Math.random() < 0.35;
  let item: CategoryItem;

  if (hasTarget && target) {
    item = target;
  } else {
    const others = target
      ? category.items.filter((i) => i.label !== target.label)
      : category.items;
    item = pick(others.length > 0 ? others : category.items);
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: item.label,
    color: pick(BALLOON_COLORS),
    x: rand(8, 92),
    size: rand(75, 110),
    speed: rand(cfg.minSpeed, cfg.maxSpeed),
    createdAt: Date.now(),
  };
}

export function BalloonSpawner({
  category,
  target,
  difficultyConfig,
  onBalloonPopped,
  onBalloonMissed,
  paused,
}: BalloonSpawnerProps) {
  const [balloons, setBalloons] = useState<BalloonData[]>([]);
  const categoryRef = useRef(category);
  categoryRef.current = category;
  const targetRef = useRef(target);
  targetRef.current = target;
  const cfgRef = useRef(difficultyConfig);
  cfgRef.current = difficultyConfig;
  const onPoppedRef = useRef(onBalloonPopped);
  onPoppedRef.current = onBalloonPopped;
  const onMissedRef = useRef(onBalloonMissed);
  onMissedRef.current = onBalloonMissed;

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= cfgRef.current.maxBalloons) return prev;
        return [...prev, createBalloon(categoryRef.current, targetRef.current, cfgRef.current)];
      });
    }, difficultyConfig.spawnInterval);
    return () => clearInterval(interval);
  }, [paused, difficultyConfig.spawnInterval]);

  useEffect(() => {
    if (paused) return;
    const cleanup = setInterval(() => {
      setBalloons((prev) => {
        const now = Date.now();
        const remaining: BalloonData[] = [];
        for (const b of prev) {
          if ((now - b.createdAt) / 1000 > b.speed + 0.5) {
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
