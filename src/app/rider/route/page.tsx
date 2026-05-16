"use client";

import { WS } from "@/components/brand/tokens";
import { Card, Pill, Btn, Avatar, Icons } from "@/components/brand";

const stops = [
  { n: "P", shop: "Tunde's Butchery", t: "9:30 AM", who: "Pickup · 4kg case", kind: "pickup", done: true },
  { n: 1, who: "Joy Mensah",   addr: "14B Herbert Macaulay", t: "10:05", kg: "1.0 kg", done: true },
  { n: 2, who: "Bola Kareem",  addr: "7 Birrel Ave",         t: "10:25", kg: "1.0 kg", done: true },
  { n: 3, who: "Ada Adekunle", addr: "22 Akoka Rd",          t: "10:48", kg: "2.0 kg", active: true },
  { n: 4, who: "Sam Okonkwo",  addr: "9 Hughes St",          t: "11:10", kg: "1.0 kg" },
];

export default function RiderRoute() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: WS.cream, color: WS.ink, fontFamily: WS.sans }}>
      <div style={{ flex: 1, overflow: "auto" }}>

        {/* Map header */}
        <div style={{ height: 220, position: "relative", background: "linear-gradient(135deg, #EFE7D6 0%, #E5DBC5 100%)" }}>
          <svg width="100%" height="100%" viewBox="0 0 402 220" style={{ position: "absolute", inset: 0 }}>
            <path d="M0 150 Q 60 130 120 140 T 280 90 T 402 110" stroke="#fff" strokeWidth="14" fill="none" opacity="0.7" />
            <path d="M0 150 Q 60 130 120 140 T 280 90 T 402 110" stroke={WS.terra} strokeWidth="2.5" fill="none" strokeDasharray="3 5" />
            <path d="M70 0 L90 220" stroke="#fff" strokeWidth="9" opacity="0.6" />
            <path d="M260 0 L250 220" stroke="#fff" strokeWidth="9" opacity="0.6" />
            {([[50, 140, "P"], [125, 135, "1"], [195, 118, "2"], [260, 100, "3"], [340, 105, "4"]] as [number, number, string][]).map(([x, y, n], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="13" fill={i === 3 ? WS.terra : i < 3 ? WS.sage : "#fff"} stroke={i === 3 ? WS.terra : "#fff"} strokeWidth="2" />
                <text x={x} y={y + 4} textAnchor="middle" fontFamily={WS.mono} fontSize="11" fontWeight="700" fill={i < 3 || i === 3 ? "#fff" : WS.ink}>{n}</text>
              </g>
            ))}
          </svg>
          <div style={{ position: "absolute", top: 14, left: 14, width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {Icons.back(WS.ink, 18)}
          </div>
          <div style={{ position: "absolute", top: 14, right: 14, padding: "6px 12px", borderRadius: 99, background: "rgba(255,255,255,0.92)", fontFamily: WS.mono, fontSize: 11, fontWeight: 700, color: WS.ink }}>
            POOL · WS-3914
          </div>
        </div>

        <div style={{ padding: "14px 16px 24px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em" }}>Today&apos;s route</div>
            <div style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>5 stops · 14 km</div>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            <Pill tone="sage" size="xs">✓ 3 done</Pill>
            <Pill tone="terra" size="xs">● 1 active</Pill>
            <Pill tone="line" size="xs">1 ahead</Pill>
          </div>

          {/* Next stop highlighted card */}
          <Card style={{ padding: 14, marginBottom: 14, background: WS.terraLt, border: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: WS.terra, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: WS.serif, fontSize: 20, fontWeight: 700 }}>
                3
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.terraDk, textTransform: "uppercase", letterSpacing: ".06em" }}>NEXT STOP · DROP-OFF</div>
                <div style={{ fontFamily: WS.serif, fontSize: 17, fontWeight: 600, color: WS.terraDk }}>Ada Adekunle · 2.0 kg</div>
                <div style={{ fontSize: 12, color: WS.terraDk, opacity: 0.85, marginTop: 1 }}>22 Akoka Rd · ETA 10:48 · 1.2 km</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Btn tone="dark" size="sm" style={{ flex: 1 }}>Navigate</Btn>
              <Btn tone="primary" size="sm" style={{ flex: 1 }}>Start drop-off →</Btn>
            </div>
          </Card>

          <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", margin: "8px 0 8px" }}>All stops</div>

          <div style={{ paddingLeft: 6 }}>
            {stops.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, position: "relative", paddingBottom: 14 }}>
                {i < stops.length - 1 && (
                  <div style={{ position: "absolute", left: 14, top: 30, bottom: 0, width: 2, background: s.done ? WS.sage : WS.line }} />
                )}
                <div style={{
                  width: 30, height: 30,
                  borderRadius: s.kind === "pickup" ? 8 : "50%",
                  background: s.done ? WS.sage : (s as typeof stops[3]).active ? WS.terra : "#fff",
                  border: s.done || (s as typeof stops[3]).active ? "none" : `2px solid ${WS.line}`,
                  color: s.done || (s as typeof stops[3]).active ? "#fff" : WS.ink,
                  fontFamily: WS.mono, fontWeight: 700, fontSize: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, zIndex: 1,
                  boxShadow: (s as typeof stops[3]).active ? `0 0 0 5px ${WS.terraLt}` : "none",
                }}>
                  {s.done ? Icons.check("#fff", 14) : s.n}
                </div>
                <div style={{ flex: 1, paddingTop: 3 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: s.done ? WS.mute : WS.ink, textDecoration: s.done ? "line-through" : "none" }}>
                      {s.who || s.shop}
                    </span>
                    <span style={{ fontFamily: WS.mono, fontSize: 11, color: WS.mute }}>{s.t}</span>
                  </div>
                  <div style={{ fontSize: 12, color: WS.ink2 }}>
                    {s.addr || s.who}
                    {"kg" in s && s.kg && <span style={{ fontFamily: WS.mono, marginLeft: 4 }}>· {s.kg}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
