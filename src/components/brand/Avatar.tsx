"use client";

import { CSSProperties } from "react";
import { WS } from "./tokens";

const palette = [
  WS.terra,
  WS.sage,
  WS.butter,
  WS.plum,
  "#6E8FB8",
  "#A57D55",
];

interface AvatarProps {
  name?: string;
  size?: number;
  bg?: string;
  ring?: boolean;
  style?: CSSProperties;
  src?: string;
}

export function Avatar({
  name = "AA",
  size = 28,
  bg,
  ring = false,
  style = {},
  src,
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const code = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const color = bg ?? palette[code % palette.length];

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: ring ? `0 0 0 2px ${WS.cream}` : "none",
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        color: "#fff",
        fontFamily: WS.sans,
        fontWeight: 700,
        fontSize: size * 0.38,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: ring ? `0 0 0 2px ${WS.cream}` : "none",
        flexShrink: 0,
        ...style,
      }}
    >
      {initials}
    </div>
  );
}

interface AvatarStackProps {
  names?: string[];
  more?: number;
  size?: number;
}

export function AvatarStack({
  names = [],
  more = 0,
  size = 24,
}: AvatarStackProps) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      {names.map((n, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -size * 0.35 }}>
          <Avatar name={n} size={size} ring />
        </div>
      ))}
      {more > 0 && (
        <div
          style={{
            marginLeft: -size * 0.35,
            width: size,
            height: size,
            borderRadius: "50%",
            background: "#fff",
            color: WS.ink2,
            border: `1.5px solid ${WS.line}`,
            fontFamily: WS.sans,
            fontWeight: 700,
            fontSize: size * 0.36,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +{more}
        </div>
      )}
    </div>
  );
}
