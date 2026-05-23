"use client";

export const runtime = "edge";

import { WS } from "@/components/brand/tokens";
import { Pill, Btn, Avatar, Icons } from "@/components/brand";

export default function RiderHandoff() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: WS.ink, color: "#fff", fontFamily: WS.sans }}>

      {/* Top bar */}
      <div style={{ padding: "12px 18px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {Icons.back("#fff", 18)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: "rgba(255,255,255,0.5)" }}>STOP 3 OF 5 · POOL WS-3914</div>
          <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>Drop-off</div>
        </div>
        <Pill tone="butter" size="xs">2.0 kg</Pill>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "24px 20px" }}>

        {/* Recipient */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <Avatar name="Ada Adekunle" size={64} bg={WS.terra} />
          <div>
            <div style={{ fontFamily: WS.serif, fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em" }}>Ada Adekunle</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)" }}>22 Akoka Rd · Apt 4B</div>
          </div>
        </div>

        {/* Portion info */}
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 18, marginBottom: 14 }}>
          <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: ".06em" }}>Their portion</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: WS.terraLt, color: WS.terraDk, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: WS.serif, fontSize: 18, fontWeight: 700 }}>
              1/2
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: WS.serif, fontSize: 16, fontWeight: 600 }}>Premium Ribeye · 2.0 kg</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)" }}>2 sealed packs · case #4</div>
            </div>
          </div>
        </div>

        {/* Verification code */}
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 18px", textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: ".06em" }}>Verification code</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 14 }}>
            {["4", "8", "2", "1"].map((d, i) => (
              <div key={i} style={{ width: 50, height: 60, borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: WS.serif, fontSize: 32, fontWeight: 700 }}>
                {d}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>Ada reads this from her app to confirm.</div>
        </div>

        {/* Photo snap button */}
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "none", color: "#fff", fontFamily: WS.sans, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
          📸 Snap photo of handoff
        </button>
      </div>

      {/* Bottom actions */}
      <div style={{ padding: "14px 20px 22px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 8 }}>
        <Btn tone="ghost" size="lg" style={{ flex: 1, color: "#fff", borderColor: "rgba(255,255,255,0.18)" }}>Call</Btn>
        <Btn tone="primary" size="lg" style={{ flex: 2 }}>Mark delivered ✓</Btn>
      </div>
    </div>
  );
}
