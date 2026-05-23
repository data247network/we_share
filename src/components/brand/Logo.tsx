"use client";

import { WS } from "./tokens";

interface LogoProps {
  size?: number;
  color?: string;
  mark?: string;
}

export function Logo({
  size = 22,
  color = WS.ink,
  mark = WS.terra,
}: LogoProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontFamily: WS.serif,
        fontWeight: 600,
        fontSize: size,
        color,
        letterSpacing: "-0.01em",
        lineHeight: 1,
      }}
    >
      <svg
        width={size * 1.05}
        height={size * 1.05}
        viewBox="0 0 24 24"
        aria-hidden
      >
        <circle cx="12" cy="12" r="11" fill={mark} />
        <path d="M12 1a11 11 0 0 0-11 11h11V1z" fill={WS.butter} />
        <path
          d="M12 12V1a11 11 0 0 1 7.78 3.22L12 12z"
          fill={WS.sage}
        />
        <circle cx="12" cy="12" r="2.4" fill={WS.cream} />
      </svg>
      <span>
        we
        <span style={{ fontStyle: "italic", color: mark }}>·</span>
        share
      </span>
    </div>
  );
}
