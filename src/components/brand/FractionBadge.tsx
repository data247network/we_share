"use client";

import { WS } from "./tokens";

interface FractionBadgeProps {
  filled?: number;
  total?: number;
  size?: number;
  ring?: boolean;
  label?: boolean;
}

export function FractionBadge({
  filled = 2,
  total = 4,
  size = 44,
  ring = true,
  label = true,
}: FractionBadgeProps) {
  const r = size / 2 - (ring ? 2 : 0);
  const cx = size / 2;
  const cy = size / 2;

  const slices = [];
  for (let i = 0; i < total; i++) {
    const a0 = (i / total) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / total) * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;

    slices.push(
      <path
        key={i}
        d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`}
        fill={i < filled ? WS.terra : WS.terraLt}
        stroke={WS.cream}
        strokeWidth="1.5"
      />
    );
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ flexShrink: 0 }}
      >
        {ring && (
          <circle
            cx={cx}
            cy={cy}
            r={size / 2 - 0.5}
            fill="none"
            stroke={WS.line}
            strokeWidth="1"
          />
        )}
        {slices}
      </svg>
      {label && (
        <span
          style={{
            fontFamily: WS.mono,
            fontSize: 11,
            color: WS.ink2,
            fontWeight: 600,
          }}
        >
          {filled}/{total}
        </span>
      )}
    </div>
  );
}
