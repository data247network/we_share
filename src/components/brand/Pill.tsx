"use client";

import { CSSProperties, ReactNode } from "react";
import { WS } from "./tokens";

type PillTone =
  | "ink"
  | "terra"
  | "sage"
  | "butter"
  | "rose"
  | "line"
  | "solid";
type PillSize = "xs" | "sm" | "lg";

interface PillProps {
  children: ReactNode;
  tone?: PillTone;
  size?: PillSize;
  style?: CSSProperties;
  onClick?: () => void;
}

const tones: Record<PillTone, { bg: string; fg: string; br?: string }> = {
  ink: { bg: "rgba(42,31,27,0.06)", fg: WS.ink },
  terra: { bg: WS.terraLt, fg: WS.terraDk },
  sage: { bg: WS.sageLt, fg: "#33623A" },
  butter: { bg: WS.butterLt, fg: "#8A6914" },
  rose: { bg: WS.rose, fg: WS.plum },
  line: { bg: WS.cream, fg: WS.ink2, br: `1px solid ${WS.line}` },
  solid: { bg: WS.ink, fg: "#fff" },
};

const sizes: Record<PillSize, { h: number; fs: number; px: number }> = {
  xs: { h: 18, fs: 10, px: 7 },
  sm: { h: 22, fs: 11, px: 10 },
  lg: { h: 30, fs: 12.5, px: 12 },
};

export function Pill({
  children,
  tone = "ink",
  size = "sm",
  style = {},
  onClick,
}: PillProps) {
  const t = tones[tone];
  const sz = sizes[size];

  return (
    <span
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: sz.h,
        padding: `0 ${sz.px}px`,
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
        fontSize: sz.fs,
        fontWeight: 600,
        fontFamily: WS.sans,
        letterSpacing: ".01em",
        border: t.br ?? "none",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
