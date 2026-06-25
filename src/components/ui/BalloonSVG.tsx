export function BalloonSVG({
  color,
  size = 64,
  delay = 0,
  label,
}: {
  color: string;
  size?: number;
  delay?: number;
  label?: string;
}) {
  const h = size * 1.4;
  const cx = size / 2;
  const ry = size / 2;
  const rx = size * 0.41;
  const cy = ry;

  return (
    <svg
      width={size}
      height={h}
      viewBox={`0 0 ${size} ${h}`}
      className="animate-bounce"
      style={{ animationDelay: `${delay}s` }}
    >
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} />
      <ellipse
        cx={cx - size * 0.12}
        cy={cy - size * 0.16}
        rx={rx * 0.22}
        ry={ry * 0.3}
        fill="rgba(255,255,255,0.35)"
        transform={`rotate(-20 ${cx - size * 0.12} ${cy - size * 0.16})`}
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
        strokeWidth={Math.max(1, size * 0.025)}
        strokeLinecap="round"
      />
      {label && (
        <text
          x={cx}
          y={cy + size * 0.08}
          textAnchor="middle"
          fontSize={size * 0.35}
          fontWeight="bold"
          fill="white"
          className="pointer-events-none"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
