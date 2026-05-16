"use client";

import { WS } from "@/components/brand/tokens";
import { SectionTitle } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { Avatar } from "@/components/brand/Avatar";
import { Icons } from "@/components/brand/Icons";
import { MobileScreen, TopBar } from "@/components/buyer-mobile/MobileShell";

const steps = [
  { t: "Pool full", s: "4 of 4 portions claimed", done: true, time: "9:14" },
  { t: "Shop preparing", s: "Tunde's Butchery packing", done: true, time: "9:46" },
  { t: "Picked up", s: "Rider on the way", done: true, time: "10:22", active: true },
  { t: "Drop 1 · Joy", s: "1 km away", done: false },
  { t: "Drop 2 · Bola", s: "", done: false },
  { t: "Drop 3 · You", s: "ETA 11:08", done: false, you: true },
];

export default function OrderTracking() {
  return (
    <MobileScreen
      footer={
        <div style={{ padding: "12px 16px 22px", background: "rgba(251,245,236,0.95)", backdropFilter: "blur(20px)", borderTop: `1px solid ${WS.line}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Avatar name="Kunle R" size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>Kunle · Rider</div>
            <div style={{ fontSize: 11.5, color: WS.ink2 }}>Honda CG · LSR-422-XK</div>
          </div>
          <Btn tone="ghost" size="sm">Call</Btn>
          <Btn tone="dark" size="sm">Chat</Btn>
        </div>
      }
    >
      <TopBar
        title="Order #WS-3914"
        left={Icons.back(WS.ink, 20)}
        right={<Pill tone="sage" size="xs">On the way</Pill>}
      />

      {/* Mini-map */}
      <div style={{ height: 200, borderRadius: 18, position: "relative", overflow: "hidden", border: `1px solid ${WS.line}`, background: "linear-gradient(135deg, #EFE7D6 0%, #E5DBC5 100%)", marginBottom: 18 }}>
        <svg width="100%" height="100%" viewBox="0 0 360 200" style={{ position: "absolute", inset: 0 }}>
          <path d="M0 130 Q 80 110 140 120 T 360 80" stroke="#fff" strokeWidth="12" fill="none" opacity="0.7" />
          <path d="M0 130 Q 80 110 140 120 T 360 80" stroke={WS.line} strokeWidth="2" fill="none" strokeDasharray="2 6" />
          <path d="M60 0 L80 200" stroke="#fff" strokeWidth="8" opacity="0.6" />
          <path d="M250 0 L240 200" stroke="#fff" strokeWidth="8" opacity="0.6" />
        </svg>
        <div style={{ position: "absolute", top: 30, left: 50 }}>{Icons.pin(WS.sage, 22)}</div>
        <div style={{ position: "absolute", top: 96, left: 170, background: "#fff", borderRadius: 18, padding: "4px 10px 4px 4px", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
          <Avatar name="Kunle R" size={22} />
          <span style={{ fontSize: 11, fontWeight: 600, fontFamily: WS.mono }}>🛵 1.2 km</span>
        </div>
        <div style={{ position: "absolute", bottom: 24, right: 30 }}>{Icons.pin(WS.terra, 26)}</div>
        <div style={{ position: "absolute", bottom: 14, left: 14, fontFamily: WS.mono, fontSize: 10.5, color: WS.ink2, background: "rgba(255,255,255,0.85)", padding: "4px 8px", borderRadius: 6 }}>ETA · 11:08 · 24 min</div>
      </div>

      <SectionTitle>Pool timeline</SectionTitle>
      <div style={{ paddingLeft: 8 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, position: "relative", paddingBottom: 14 }}>
            {i < steps.length - 1 && (
              <div style={{ position: "absolute", left: 11, top: 24, bottom: 0, width: 2, background: s.done ? WS.terra : WS.line }} />
            )}
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: s.done ? WS.terra : "#fff",
              border: s.done ? "none" : `2px solid ${WS.line}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, zIndex: 1,
              boxShadow: s.active ? `0 0 0 5px ${WS.terraLt}` : "none",
            }}>
              {s.done && Icons.check("#fff", 12)}
            </div>
            <div style={{ flex: 1, paddingTop: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: s.you ? WS.terraDk : WS.ink }}>
                  {s.t}
                  {s.you && <span style={{ fontFamily: WS.mono, fontSize: 10, marginLeft: 6, background: WS.terraLt, color: WS.terraDk, padding: "2px 6px", borderRadius: 4 }}>YOU</span>}
                </span>
                {s.time && <span style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>{s.time}</span>}
              </div>
              {s.s && <div style={{ fontSize: 12, color: WS.ink2, marginTop: 1 }}>{s.s}</div>}
            </div>
          </div>
        ))}
      </div>
    </MobileScreen>
  );
}
