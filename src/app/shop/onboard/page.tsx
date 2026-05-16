"use client";

import { WS } from "@/components/brand/tokens";
import { Card, ImgSlot } from "@/components/brand";
import { Logo } from "@/components/brand/Logo";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";

const WEB_SIDE = "#F4ECDC";

const steps = [
  { n: 1, l: "Shop basics", done: true },
  { n: 2, l: "Wholesale pricing", active: true },
  { n: 3, l: "Payouts", done: false },
  { n: 4, l: "Go live", done: false },
];

const categories = [
  { l: "Meat & poultry", on: true },
  { l: "Drinks", on: false },
  { l: "Produce", on: false },
  { l: "Dry goods", on: false },
  { l: "Frozen", on: true },
  { l: "Restaurant supply", on: false },
];

export default function SellerOnboarding() {
  return (
    <div style={{ display: "flex", height: "100dvh", background: WS.cream, fontFamily: WS.sans, color: WS.ink, overflow: "hidden" }}>
      {/* Step sidebar */}
      <div style={{ width: 260, background: WEB_SIDE, padding: "28px 22px", display: "flex", flexDirection: "column", gap: 18, borderRight: `1px solid ${WS.line}`, flexShrink: 0 }}>
        <Logo size={20} />
        <div style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", marginTop: 8, lineHeight: 1.15 }}>Enroll your shop on WeShare</div>
        <div style={{ fontSize: 12.5, color: WS.ink2 }}>Sell wholesale cases — buyers pool together until each case is full, then we ship.</div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 6 }}>
          {steps.map((s) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: s.active ? WS.terraLt : "transparent", color: s.active ? WS.terraDk : WS.ink2 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.done ? WS.terra : s.active ? "#fff" : "rgba(0,0,0,0.05)", color: s.done ? "#fff" : WS.ink, border: s.active ? `1.5px solid ${WS.terra}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: WS.mono, fontSize: 11, fontWeight: 700 }}>
                {s.done ? Icons.check("#fff", 11) : s.n}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "40px 56px 24px", overflowY: "auto" }}>
        <div style={{ fontFamily: WS.mono, fontSize: 11, color: WS.terraDk, fontWeight: 600, letterSpacing: ".06em" }}>STEP 2 / 4</div>
        <div style={{ fontFamily: WS.serif, fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, marginTop: 6 }}>Tell us your wholesale price.</div>
        <div style={{ fontSize: 14, color: WS.ink2, marginTop: 8, maxWidth: 560 }}>WeShare unlocks this price only when a pool fills. Pick the categories you sell.</div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32, marginTop: 32 }}>
          <div>
            <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Categories you sell</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {categories.map((c, i) => (
                <Pill key={i} tone={c.on ? "terra" : "line"} size="lg">{c.on ? "✓ " : ""}{c.l}</Pill>
              ))}
            </div>

            <Card style={{ padding: 24, marginBottom: 18 }}>
              <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 14 }}>Sample item — Premium Ribeye, 4 kg</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", marginBottom: 6 }}>Retail (1 kg)</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 14px", background: WS.cream, borderRadius: 10, border: `1px solid ${WS.line}` }}>
                    <span style={{ color: WS.mute }}>£</span>
                    <span style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 600 }}>38.00</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.terraDk, fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Wholesale (full case)</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 14px", background: WS.terraLt, borderRadius: 10, border: `1.5px solid ${WS.terra}` }}>
                    <span style={{ color: WS.terraDk }}>£</span>
                    <span style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 700, color: WS.terraDk }}>122.00</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 18, padding: 14, background: WS.paper, borderRadius: 12, display: "flex", alignItems: "center", gap: 14 }}>
                <FractionBadge filled={4} total={4} size={56} label={false} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>Split 4 ways → <span style={{ color: WS.terraDk }}>£30.50 per portion</span></div>
                  <div style={{ fontSize: 12, color: WS.ink2, marginTop: 2 }}>Buyers save 20% vs your retail price. You ship one case.</div>
                </div>
              </div>
            </Card>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Btn tone="ghost">← Back</Btn>
              <Btn tone="primary" size="lg">Continue to payouts →</Btn>
            </div>
          </div>

          {/* Preview rail */}
          <div>
            <div style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Buyer will see</div>
            <Card p={0} style={{ overflow: "hidden" }}>
              <ImgSlot label="ribeye" tone="meat" h={140} r={0} />
              <div style={{ padding: 14 }}>
                <Pill tone="terra" size="xs" style={{ marginBottom: 6 }}>WHOLESALE</Pill>
                <div style={{ fontFamily: WS.serif, fontSize: 15, fontWeight: 600 }}>Premium Ribeye, 4 kg case</div>
                <div style={{ fontSize: 11.5, color: WS.ink2, marginTop: 4 }}>Tunde's Butchery · ⭐ 4.9</div>
                <div style={{ marginTop: 12, padding: "10px 12px", background: WS.paper, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: WS.mono, fontSize: 10.5, color: WS.mute }}>1/4 SHARE</span>
                    <span style={{ fontFamily: WS.serif, fontWeight: 700, color: WS.terraDk }}>£30.50</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
