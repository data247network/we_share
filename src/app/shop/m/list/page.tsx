"use client";

import { WS } from "@/components/brand/tokens";
import { Card, SectionTitle } from "@/components/brand";
import { Pill } from "@/components/brand/Pill";
import { Btn } from "@/components/brand/Btn";
import { FractionBadge } from "@/components/brand/FractionBadge";
import { Icons } from "@/components/brand/Icons";

const splitOptions = [
  { n: 2, label: "halves" },
  { n: 3, label: "thirds" },
  { n: 4, label: "quarters", active: true },
  { n: 8, label: "eighths" },
];

const pricing = [
  ["Wholesale (full case)", "£122.00"],
  ["Per portion (auto)", "£30.50"],
  ["Platform fee (8%)", "−£2.44"],
  ["You earn / portion", "£28.06", true],
];

export default function ShopListItem() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: WS.cream, color: WS.ink, fontFamily: WS.sans, overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0 14px" }}>
          <div>{Icons.back(WS.ink, 20)}</div>
          <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600 }}>New item</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: WS.mute }}>2 / 3</span>
        </div>

        <div style={{ fontFamily: WS.serif, fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.15, marginBottom: 4 }}>
          How should this be<br /><span style={{ color: WS.terra, fontStyle: "italic" }}>shared?</span>
        </div>
        <div style={{ fontSize: 13, color: WS.ink2, marginBottom: 18 }}>Buyers will claim portions until full, then we ship.</div>

        {/* Visual pie picker */}
        <Card style={{ marginBottom: 16, padding: "18px 14px 16px", background: WS.paper }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 0 12px" }}>
            <FractionBadge filled={4} total={4} size={140} label={false} />
          </div>
          <div style={{ fontFamily: WS.serif, fontSize: 18, fontWeight: 600, textAlign: "center" }}>Split into 4 portions</div>
          <div style={{ textAlign: "center", fontSize: 12.5, color: WS.ink2, marginTop: 2 }}>~1.0 kg per share · £30.50 each</div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
          {splitOptions.map((o) => (
            <div key={o.n} style={{ padding: "12px 6px", borderRadius: 12, border: `1.5px solid ${o.active ? WS.terra : WS.line}`, background: o.active ? WS.terraLt : "#fff", textAlign: "center" }}>
              <div style={{ margin: "0 auto", width: 36, height: 36 }}>
                <FractionBadge filled={o.n} total={o.n} size={36} ring={false} label={false} />
              </div>
              <div style={{ fontFamily: WS.serif, fontSize: 15, fontWeight: 600, marginTop: 6, color: o.active ? WS.terraDk : WS.ink }}>{o.n}</div>
              <div style={{ fontFamily: WS.mono, fontSize: 9.5, color: WS.mute, textTransform: "uppercase" }}>{o.label}</div>
            </div>
          ))}
        </div>

        <SectionTitle>Pricing</SectionTitle>
        <Card style={{ marginBottom: 14 }}>
          {pricing.map(([k, v, bold], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13.5, borderTop: i > 0 ? `1px solid ${WS.line2}` : "none" }}>
              <span style={{ color: WS.ink2 }}>{k}</span>
              <span style={{ color: WS.ink, fontWeight: bold ? 700 : 600, fontFamily: bold ? WS.serif : WS.sans, fontSize: bold ? 16 : 13.5 }}>{v}</span>
            </div>
          ))}
        </Card>

        <SectionTitle>Ship when</SectionTitle>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1.5px solid ${WS.terra}`, background: WS.terraLt, textAlign: "center" }}>
            <div style={{ fontFamily: WS.serif, fontWeight: 700, fontSize: 15, color: WS.terraDk }}>4 / 4</div>
            <div style={{ fontSize: 11, color: WS.terraDk }}>Pool fully claimed</div>
          </div>
          <div style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1.5px solid ${WS.line}`, background: "#fff", textAlign: "center" }}>
            <div style={{ fontFamily: WS.serif, fontWeight: 700, fontSize: 15 }}>2 / 4 min</div>
            <div style={{ fontSize: 11, color: WS.ink2 }}>Half-full minimum</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 16px 22px", background: "rgba(251,245,236,0.95)", backdropFilter: "blur(20px)", borderTop: `1px solid ${WS.line}`, display: "flex", gap: 8, flexShrink: 0 }}>
        <Btn tone="ghost" size="lg" style={{ flex: 1 }}>Back</Btn>
        <Btn tone="primary" size="lg" style={{ flex: 2 }}>Review listing →</Btn>
      </div>
    </div>
  );
}
