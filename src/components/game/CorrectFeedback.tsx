"use client";

import { useState, useEffect, useCallback } from "react";
import { PRAISE_MESSAGES } from "@/lib/constants";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
}

let confettiId = 0;

export function useCorrectFeedback() {
  const [showPraise, setShowPraise] = useState<string | null>(null);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showStars, setShowStars] = useState(false);

  const trigger = useCallback(() => {
    const msg = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
    setShowPraise(msg);
    setShowStars(true);

    const pieces: ConfettiPiece[] = Array.from({ length: 12 }, () => ({
      id: ++confettiId,
      x: Math.random() * 100,
      color: ["#EF4444", "#FACC15", "#22C55E", "#3B82F6", "#EC4899", "#F97316"][
        Math.floor(Math.random() * 6)
      ],
      delay: Math.random() * 0.3,
      size: 6 + Math.random() * 6,
    }));
    setConfetti(pieces);

    setTimeout(() => setShowPraise(null), 1200);
    setTimeout(() => setShowStars(false), 800);
    setTimeout(() => setConfetti([]), 1500);
  }, []);

  return { showPraise, showStars, confetti, trigger };
}

export function CorrectFeedbackOverlay({
  praise,
  showStars,
  confetti,
}: {
  praise: string | null;
  showStars: boolean;
  confetti: ConfettiPiece[];
}) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {praise && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 animate-scale-in">
          <p
            className="text-4xl md:text-5xl font-bold text-center whitespace-nowrap drop-shadow-lg"
            style={{ color: "#FF6B00" }}
          >
            {praise}
          </p>
        </div>
      )}

      {showStars && (
        <>
          {[...Array(5)].map((_, i) => (
            <Star key={i} index={i} />
          ))}
        </>
      )}

      {confetti.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <div
            className="rounded-sm"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function Star({ index }: { index: number }) {
  const positions = [
    { left: "20%", top: "25%" },
    { left: "75%", top: "20%" },
    { left: "50%", top: "15%" },
    { left: "30%", top: "35%" },
    { left: "70%", top: "40%" },
  ];
  const pos = positions[index % positions.length];

  return (
    <div
      className="absolute text-3xl animate-star-pop"
      style={{ left: pos.left, top: pos.top, animationDelay: `${index * 80}ms` }}
    >
      ⭐
    </div>
  );
}
