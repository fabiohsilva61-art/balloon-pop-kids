"use client";

import { useState, useCallback } from "react";
import type { BalloonData, BalloonStatus } from "@/types/game";

interface BalloonProps {
  balloon: BalloonData;
  onPop: (id: string) => void;
}

export function Balloon({ balloon, onPop }: BalloonProps) {
  const [status, setStatus] = useState<BalloonStatus>("floating");

  const handlePop = useCallback(() => {
    if (status !== "floating") return;
    setStatus("popping");
    setTimeout(() => {
      setStatus("gone");
      onPop(balloon.id);
    }, 300);
  }, [status, balloon.id, onPop]);

  if (status === "gone") return null;

  const { size, color, label, x, speed } = balloon;
  const h = size * 1.4;
  const cx = size / 2;
  const ry = size / 2;
  const rx = size * 0.41;
  const isEmoji = /\p{Emoji}/u.test(label) && label.length <= 2;
  const fontSize = isEmoji ? size * 0.4 : size * 0.38;

  return (
    <div
      className="absolute bottom-0 will-change-transform"
      style={{
        left: `${x}%`,
        animation: `balloon-rise ${speed}s linear forwards`,
        transform: "translateX(-50%)",
      }}
    >
      <button
        type="button"
        onClick={handlePop}
        onTouchEnd={(e) => {
          e.preventDefault();
          handlePop();
        }}
        className="relative cursor-pointer outline-none border-none bg-transparent p-0 transition-transform duration-300 ease-out"
        style={{
          transform: status === "popping" ? "scale(1.5)" : "scale(1)",
          opacity: status === "popping" ? 0 : 1,
        }}
        aria-label={`Balão ${label}`}
      >
        <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
          <ellipse cx={cx} cy={ry} rx={rx} ry={ry} fill={color} />
          <ellipse
            cx={cx - size * 0.12}
            cy={ry - size * 0.16}
            rx={rx * 0.22}
            ry={ry * 0.3}
            fill="rgba(255,255,255,0.35)"
            transform={`rotate(-20 ${cx - size * 0.12} ${ry - size * 0.16})`}
          />
          <polygon
            points={`${cx},${size} ${cx - size * 0.06},${size + size * 0.06} ${cx + size * 0.06},${size + size * 0.06}`}
            fill={color}
          />
          <line
            x1={cx}
            y1={size + size * 0.06}
            x2={cx}
            y2={h - 2}
            stroke="#888"
            strokeWidth={Math.max(1, size * 0.02)}
            strokeLinecap="round"
          />
          <text
            x={cx}
            y={ry + fontSize * 0.35}
            textAnchor="middle"
            fontSize={fontSize}
            fontWeight="bold"
            fill="white"
            className="pointer-events-none select-none"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
          >
            {label}
          </text>
        </svg>

        {status === "popping" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-particle"
                style={{
                  backgroundColor: color,
                  animationDelay: `${i * 30}ms`,
                  transform: `rotate(${i * 60}deg) translateY(-${size * 0.4}px)`,
                }}
              />
            ))}
          </div>
        )}
      </button>
    </div>
  );
}
