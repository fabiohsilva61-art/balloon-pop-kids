"use client";

const BALLOONS = [
  { color: "#EF4444", left: "8%", delay: 0, size: 48, duration: 6 },
  { color: "#FACC15", left: "25%", delay: 1.2, size: 40, duration: 7 },
  { color: "#22C55E", left: "45%", delay: 0.5, size: 52, duration: 5.5 },
  { color: "#3B82F6", left: "65%", delay: 2, size: 36, duration: 8 },
  { color: "#A855F7", left: "82%", delay: 0.8, size: 44, duration: 6.5 },
  { color: "#F97316", left: "15%", delay: 3, size: 32, duration: 7.5 },
  { color: "#EC4899", left: "55%", delay: 1.8, size: 38, duration: 6.8 },
  { color: "#14B8A6", left: "90%", delay: 2.5, size: 42, duration: 5.8 },
];

export function BackgroundBalloons() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {BALLOONS.map((b, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: b.left,
            bottom: "-15%",
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        >
          <svg
            width={b.size}
            height={b.size * 1.4}
            viewBox={`0 0 ${b.size} ${b.size * 1.4}`}
            style={{ opacity: 0.25 }}
          >
            <ellipse
              cx={b.size / 2}
              cy={b.size / 2}
              rx={b.size * 0.41}
              ry={b.size / 2}
              fill={b.color}
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
