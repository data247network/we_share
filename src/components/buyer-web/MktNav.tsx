"use client";

import { WS } from "@/components/brand/tokens";
import { Logo } from "@/components/brand/Logo";
import { Btn } from "@/components/brand/Btn";
import { Icons } from "@/components/brand/Icons";

const navLinks = ["Browse", "Open pools", "How it works", "For shops"];

export function MktNav({ active = "Browse" }: { active?: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 18, padding: "14px 36px",
      borderBottom: `1px solid ${WS.line}`,
      background: "rgba(251,245,236,0.92)", backdropFilter: "blur(20px)",
      position: "sticky", top: 0, zIndex: 5,
    }}>
      <span style={{ cursor: "pointer" }} onClick={() => window.location.href = "/"}><Logo size={20} /></span>
      <nav style={{ display: "flex", gap: 18, marginLeft: 20 }}>
        {navLinks.map((n, i) => (
          <span key={i} style={{
            fontSize: 13.5, fontWeight: 600,
            color: n === active ? WS.ink : WS.ink2,
            borderBottom: n === active ? `2px solid ${WS.terra}` : "2px solid transparent",
            paddingBottom: 2, cursor: "pointer",
          }}>{n}</span>
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${WS.line}`, borderRadius: 10, padding: "7px 12px", width: 320 }}>
        {Icons.search(WS.mute, 14)}
        <span style={{ fontSize: 12.5, color: WS.mute }}>Search wholesale deals near you…</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: WS.ink2 }}>
        {Icons.pin(WS.terra, 14)} Newcastle
      </div>
      <Btn tone="ghost" size="sm" onClick={() => window.location.href = "/auth/login"}>Sign in</Btn>
      <Btn tone="primary" size="sm" onClick={() => window.location.href = "/auth/signup"}>Sign up</Btn>
    </div>
  );
}
