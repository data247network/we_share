"use client";

import { CSSProperties, ReactNode } from "react";
import { WS } from "./tokens";

// ─── ImgSlot ─────────────────────────────────────────────────────────────────

type ImgTone =
  | "terra"
  | "sage"
  | "butter"
  | "rose"
  | "ink"
  | "meat"
  | "drink";

const imgTones: Record<ImgTone, { c1: string; c2: string }> = {
  terra: { c1: "#F3D7C6", c2: "#EAC7B2" },
  sage: { c1: "#D9E4D6", c2: "#C8D6C5" },
  butter: { c1: "#F6E4B5", c2: "#EFD79A" },
  rose: { c1: "#F1D5CE", c2: "#E5C2B9" },
  ink: { c1: "#3D332E", c2: "#2A211D" },
  meat: { c1: "#E9B7A2", c2: "#D29380" },
  drink: { c1: "#C6D8DC", c2: "#A8C0C7" },
};

interface ImgSlotProps {
  label?: string;
  tone?: ImgTone;
  h?: number;
  r?: number;
  style?: CSSProperties;
  src?: string;
}

export function ImgSlot({
  label = "product shot",
  tone = "terra",
  h = 160,
  r = 14,
  style = {},
  src,
}: ImgSlotProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={label}
        style={{ height: h, borderRadius: r, objectFit: "cover", ...style }}
      />
    );
  }

  const t = imgTones[tone] ?? imgTones.terra;
  const dark = tone === "ink";

  return (
    <div
      style={{
        height: h,
        borderRadius: r,
        position: "relative",
        overflow: "hidden",
        background: `repeating-linear-gradient(135deg, ${t.c1} 0 12px, ${t.c2} 12px 24px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(120% 60% at 30% 20%, rgba(255,255,255,${dark ? 0.05 : 0.35}) 0%, transparent 60%)`,
        }}
      />
      <span
        style={{
          fontFamily: WS.mono,
          fontSize: 10.5,
          color: dark
            ? "rgba(255,255,255,0.6)"
            : "rgba(42,31,27,0.55)",
          letterSpacing: ".04em",
          textTransform: "uppercase",
          padding: "4px 8px",
          borderRadius: 6,
          background: dark
            ? "rgba(0,0,0,0.25)"
            : "rgba(255,251,243,0.6)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: ReactNode;
  p?: number;
  r?: number;
  style?: CSSProperties;
  onClick?: () => void;
}

export function Card({ children, p = 14, r = 18, style = {}, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: WS.card,
        borderRadius: r,
        padding: p,
        border: `1px solid ${WS.line}`,
        boxShadow: "0 1px 0 rgba(42,31,27,0.02)",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Bar ─────────────────────────────────────────────────────────────────────

interface BarProps {
  value?: number;
  color?: string;
  h?: number;
  bg?: string;
  style?: CSSProperties;
}

export function Bar({
  value = 50,
  color = WS.terra,
  h = 6,
  bg = WS.line2,
  style = {},
}: BarProps) {
  return (
    <div
      style={{
        height: h,
        borderRadius: 99,
        background: bg,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          width: `${Math.min(value, 100)}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────

interface SectionTitleProps {
  children: ReactNode;
  action?: ReactNode;
}

export function SectionTitle({ children, action }: SectionTitleProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontFamily: WS.serif,
          fontWeight: 600,
          fontSize: 18,
          color: WS.ink,
          letterSpacing: "-0.015em",
        }}
      >
        {children}
      </h3>
      {action && (
        <span
          style={{
            fontFamily: WS.sans,
            fontSize: 12,
            color: WS.terraDk,
            fontWeight: 600,
          }}
        >
          {action}
        </span>
      )}
    </div>
  );
}

// Re-export all brand components
export { WS } from "./tokens";
export { Logo } from "./Logo";
export { Pill } from "./Pill";
export { Btn } from "./Btn";
export { Avatar, AvatarStack } from "./Avatar";
export { FractionBadge } from "./FractionBadge";
export { Icons } from "./Icons";
