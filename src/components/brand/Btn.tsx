"use client";

import { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { WS } from "./tokens";

type BtnTone =
  | "primary"
  | "dark"
  | "sage"
  | "ghost"
  | "soft"
  | "butter";
type BtnSize = "sm" | "md" | "lg";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: BtnTone;
  size?: BtnSize;
  block?: boolean;
  style?: CSSProperties;
}

const tones: Record<BtnTone, { bg: string; fg: string; br?: string }> = {
  primary: { bg: WS.terra, fg: "#fff" },
  dark: { bg: WS.ink, fg: "#fff" },
  sage: { bg: WS.sage, fg: "#fff" },
  ghost: { bg: "transparent", fg: WS.ink, br: `1px solid ${WS.line}` },
  soft: { bg: WS.terraLt, fg: WS.terraDk },
  butter: { bg: WS.butter, fg: WS.ink },
};

const sizes: Record<
  BtnSize,
  { h: number; fs: number; px: number; r: number }
> = {
  sm: { h: 34, fs: 13, px: 14, r: 11 },
  md: { h: 44, fs: 14.5, px: 18, r: 13 },
  lg: { h: 54, fs: 16, px: 22, r: 16 },
};

export function Btn({
  children,
  tone = "primary",
  size = "md",
  block = false,
  style = {},
  ...props
}: BtnProps) {
  const t = tones[tone];
  const sz = sizes[size];

  return (
    <button
      style={{
        height: sz.h,
        padding: `0 ${sz.px}px`,
        borderRadius: sz.r,
        background: t.bg,
        color: t.fg,
        border: t.br ?? "none",
        fontFamily: WS.sans,
        fontWeight: 600,
        fontSize: sz.fs,
        cursor: "pointer",
        letterSpacing: "-0.005em",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: block ? "100%" : "auto",
        boxShadow:
          tone === "primary"
            ? "0 1px 0 rgba(255,255,255,0.2) inset, 0 2px 0 rgba(178,83,47,0.18)"
            : "none",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
